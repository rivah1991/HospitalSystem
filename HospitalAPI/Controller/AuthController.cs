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
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }
        // [HttpPost("register")]
        // public async Task<IActionResult> Register([FromBody] Register model)
        // {
        //     var user = new IdentityUser { UserName = model.Username };
        //     var result = await _userManager.CreateAsync(user, model.Password);

        //     if (result.Succeeded)
        //     {
        //         return Ok(new { message = "User registered Successfully" });
        //     }
        //     return BadRequest(result.Errors);
        // }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {

            var user = new IdentityUser
            {
                UserName = model.Username,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Ajouter l'utilisateur dans la table PendingUsers avec le rôle proposé
            var pendingUser = new PendingUser
            {
                Username = model.Username,
                Email = model.Email,
                Role = model.Role, // Rôle choisi "Admin" ou "Professional"
            };

            _context.PendingUsers.Add(pendingUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully and pending approval" });
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
            var user = new IdentityUser
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
        public async Task<IActionResult> GetPendingUsers()
        {
            var admin = await _userManager.GetUserAsync(User);
            if (admin == null || !await _userManager.IsInRoleAsync(admin, "Admin"))
            {
                return Unauthorized();
            }

            // Liste des utilisateurs en attente
            var pendingUsers = await _context.PendingUsers.Where(u => !u.IsApproved).ToListAsync();
            return Ok(pendingUsers);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized(new { message = "Invalid credentials" });

            // Generate the JWT
            var token = GenerateJwtToken(user);

            // Generate a Refresh Token
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                ExpiryDate = DateTime.UtcNow.AddDays(7), // Refresh token valid for 7 days
                UserId = user.Id
            };

            // Save the Refresh Token in the database
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

        private string GenerateJwtToken(IdentityUser user)
        {
            var authClaims = new List<Claim>
    {
        // new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.Id)
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