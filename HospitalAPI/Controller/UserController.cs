using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using HospitalAPI.Data;
using HospitalAPI.Dtos;
using HospitalAPI.Dtos.Patient;
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
        private readonly IMapper _mapper;


        private readonly ApplicationDbContext _context;
        public UserController(IMapper mapper, ApplicationDbContext context, UserManager<ApplicationUser> userManager, IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _environment = environment;
            _context = context;
            _mapper = mapper;

        }


        [HttpPut("update-profile")]
        [Authorize]
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
            user.FullName = model.FullName ?? user.FullName;
            user.Email = model.Email ?? user.Email;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Error updating profile.", errors = result.Errors });
            }

            return Ok(new { message = "Profile updated successfully." });
        }


        [HttpGet("profiles")]
        [Authorize]
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
                user.Qualification,
                user.FullName
            }).ToList();

            return Ok(userProfiles);
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetPatientByUser(string userId)
        {
            // Vérifiez si l'utilisateur existe
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Utilisateur introuvable." });
            }

            // Récupérez les associations entre patients et médecins
            var patientAssignments = await _context.PatientDoctorAssignments
                .Where(a => a.UserId == userId)
                .ToListAsync();

            if (patientAssignments == null || !patientAssignments.Any())
            {
                return NotFound(new { message = "Aucun patient trouvé pour cet utilisateur." });
            }

            // Récupérez les patients associés
            var patientIds = patientAssignments.Select(a => a.PatientId).ToList();
            var patients = await _context.Patients
                .Where(p => patientIds.Contains(p.Id))
                .ToListAsync();

            if (patients == null || !patients.Any())
            {
                return NotFound(new { message = "Aucun patient trouvé pour cet utilisateur." });
            }

            // Utilisation de AutoMapper pour transformer les données en DTOs
            var patientDtos = _mapper.Map<List<PatientDto>>(patients);

            return Ok(patientDtos);
        }



        [HttpGet("current-user")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (!User.Identity?.IsAuthenticated ?? false) // Vérifie si Identity ou IsAuthenticated est null
            {
                return Unauthorized(new { message = "User not authenticated." });
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Récupérer l'utilisateur à partir de l'ID
            var user = await _userManager.FindByIdAsync(userId!);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Récupération des informations nécessaires
            var username = user.UserName;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var email = user.Email;
            var specialty = user.Specialty;
            var qualification = user.Qualification;
            var fullName = user.FullName;

            return Ok(new
            {
                UserId = userId,
                Username = username,
                Role = role,
                Email = email,
                Specialty = specialty,
                Qualification = qualification,
                FullName = fullName
            });
        }

        [HttpPost("assign-doctor")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignDoctor([FromBody] PatientDoctorAssignmentDto assignmentDto)
        {
            if (assignmentDto == null)
            {
                return BadRequest("Missing data.");
            }

            // Vérifier si le médecin existe
            var doctor = await _userManager.FindByIdAsync(assignmentDto.UserId!);
            if (doctor == null)
            {
                return NotFound("The specified doctor does not exist.");
            }

            // Vérifier si le patient existe
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == assignmentDto.PatientId);
            if (patient == null)
            {
                return NotFound("The specified patient does not exist.");
            }

            // Vérifier si le patient est déjà assigné à un médecin
            var existingAssignment = await _context.PatientDoctorAssignments
                .FirstOrDefaultAsync(a => a.PatientId == assignmentDto.PatientId);
            if (existingAssignment != null)
            {
                return BadRequest("The patient is already assigned to a doctor. ");
            }

            // Créer une nouvelle affectation
            var assignment = new PatientDoctorAssignment
            {
                PatientId = assignmentDto.PatientId,
                UserId = assignmentDto.UserId
            };

            // Ajouter l'affectation à la base de données
            _context.PatientDoctorAssignments.Add(assignment);

            // Sauvegarder les changements dans la base de données
            await _context.SaveChangesAsync();

            return Ok(new { message = "The doctor has been successfully assigned to the patient." });
        }



    }
}
