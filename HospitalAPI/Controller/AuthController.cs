using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HospitalAPI.Data;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace HospitalAPI.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            // Vérifier si l'utilisateur existe déjà
            var existingUser = await _userManager.FindByNameAsync(model.Username);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Créer un nouvel utilisateur avec IsApproved = false
            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                IsApproved = false  // L'utilisateur n'est pas encore approuvé
            };

            // Créer l'utilisateur dans la base de données
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "User creation failed", errors = result.Errors });
            }


            return Ok(new { message = "User created successfully, awaiting approval" });
        }



        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveUser(int id, [FromBody] string role)
        {
            var admin = await _userManager.GetUserAsync(User);
            if (admin == null || !await _userManager.IsInRoleAsync(admin, "Admin"))
            {
                return Unauthorized();
            }

            var pendingUser = await _context.PendingUsers.FindAsync(id);
            if (pendingUser == null)
            {
                return NotFound();
            }

            // L'utilisateur est approuvé, on lui attribue le rôle et on le déplace dans la table principale
            var user = new ApplicationUser
            {
                UserName = pendingUser.Username,
                Email = pendingUser.Email
            };

            var createUserResult = await _userManager.CreateAsync(user);
            if (!createUserResult.Succeeded)
            {
                return BadRequest(createUserResult.Errors);
            }

            // L'admin assigne un rôle à l'utilisateur (Admin ou Professional)
            var result = await _userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Mettre à jour l'utilisateur dans PendingUsers
            pendingUser.IsApproved = true;
            _context.PendingUsers.Update(pendingUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User approved and role assigned" });
        }


        [HttpGet("pending-users")]
        [Authorize(Roles = "Admin")] // Seuls les admins peuvent voir cette liste
        public async Task<IActionResult> GetPendingUsers()
        {
            var admin = await _userManager.GetUserAsync(User);
            if (admin == null || !await _userManager.IsInRoleAsync(admin, "Admin"))
            {
                return Unauthorized(); // Assurez-vous que l'utilisateur est un admin
            }

            // Liste des utilisateurs en attente d'approbation
            var pendingUsers = await _userManager.Users
                .Where(u => !u.IsApproved) // Filtre les utilisateurs non approuvés
                .ToListAsync();

            return Ok(pendingUsers); // Renvoie les utilisateurs en attente
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            // Vérifiez si l'utilisateur est approuvé
            if (!user.IsApproved)
            {
                return Unauthorized(new { message = "You are waiting for approval" });
            }

            // Générer le JWT
            var token = GenerateJwtToken(user);

            // Générer un Refresh Token
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            };

            // Sauvegarder le Refresh Token dans la base de données
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                token,
                refreshToken = refreshToken.Token
            });
        }




        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshRequest request)
        {
            // Vérifier si le refresh token est null ou vide
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { message = "Refresh token is required" });
            }

            // Vérifier si le refresh token existe dans la base de données
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == request.RefreshToken);

            if (token == null || token.ExpiryDate < DateTime.UtcNow || token.IsRevoked)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }

            // Récupérer l'utilisateur associé au refresh token
            var user = await _userManager.FindByIdAsync(token.UserId);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            // Générer un nouveau JWT pour l'utilisateur
            var newToken = GenerateJwtToken(user);

            // Retourner le nouveau token
            return Ok(new
            {
                token = newToken,
                expiresIn = 3600 // Exemple de durée d'expiration de 1 heure
            });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var authClaims = new List<Claim>
    {
        // new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Name, user.UserName!)
    };

            // 🔥 Récupérer les rôles de l'utilisateur et les ajouter au token
            var userRoles = _userManager.GetRolesAsync(user).Result;
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                expires: DateTime.UtcNow.AddMinutes(60),
                claims: authClaims,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        [HttpPost("add-role")]
        public async Task<IActionResult> Role([FromBody] string role)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                var result = await _roleManager.CreateAsync(new IdentityRole(role));
                if (result.Succeeded)
                {
                    return Ok(new { message = "Role Added Successfully" });
                }
                return BadRequest(result.Errors);
            }
            return BadRequest("Role already Exists");
        }

        // [Authorize(Roles = "Admin")]
        [Authorize]
        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] UserRole model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            var result = await _userManager.AddToRoleAsync(user, model.Role);
            if (result.Succeeded)
            {
                return Ok(new { message = "Role assigned Successfully" });
            }
            return BadRequest(result.Errors);

        }
    }
}