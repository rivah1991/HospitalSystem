using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using HospitalAPI.Dtos;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;

        public UserController(UserManager<ApplicationUser> userManager, IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _environment = environment;
        }

        // PUT: api/user/update-profile
        [HttpPut("update-profile")]
        [Authorize]  // Protéger cette route
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.UserId))
            {
                return BadRequest("Invalid user data.");
            }

            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Mise à jour des informations du profil, sans toucher au username
            user.Specialty = model.Specialty ?? user.Specialty;
            user.Qualification = model.Qualification ?? user.Qualification;
            user.Email = model.Email ?? user.Email;

            // N'essayez pas de modifier le username (ce champ ne doit pas être modifiable)
            // user.UserName = model.UserName ?? user.UserName; // Cette ligne est enlevée

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Error updating profile.", errors = result.Errors });
            }

            return Ok(new { message = "Profile updated successfully." });
        }

        [HttpGet("profiles")]
        [Authorize] // Cette route est protégée par l'autorisation
        public async Task<IActionResult> GetUserProfiles()
        {
            // Récupérer tous les utilisateurs de manière asynchrone
            var users = await _userManager.Users.ToListAsync();

            if (users == null || !users.Any())
            {
                return NotFound(new { message = "Aucun utilisateur trouvé." });
            }

            // Créer un résultat avec les informations de chaque utilisateur
            var userProfiles = users.Select(user => new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.Specialty,
                user.Qualification
            }).ToList();

            return Ok(userProfiles);
        }

        // GET: api/user/current-user
        [HttpGet("current-user")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            if (!User.Identity?.IsAuthenticated ?? false) // Vérifie si Identity ou IsAuthenticated est null
            {
                return Unauthorized(new { message = "User not authenticated." });
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            return Ok(new
            {
                UserId = userId,
                Username = username,
                Role = role,
                Email = email,
            });
        }
    }
}
