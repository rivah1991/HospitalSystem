using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HospitalAPI.Data;
using HospitalAPI.Dtos.Patient;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controller
{
    [Route("api/[Controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        private readonly UserManager<IdentityUser> _userManager;

        public PatientController(ApplicationDbContext context, IMapper mapper, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        private string? GetCurrentUserId()
        {
            var claims = User.Claims;
            foreach (var claim in claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
            }

            // Assurez-vous que vous obtenez le "sub" correctement
            var userId = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            return userId;
        }
        [Authorize]
        // [Authorize(Roles = "User")]
        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(_mapper.Map<List<PatientDto>>(patients));
        }

        [HttpGet("{id}")]
        // public async Task<IActionResult> GetPatient(int id)
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();

            return Ok(_mapper.Map<PatientDto>(patient));
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePatient([FromBody] PatientDto patientDto)
        {
            var patient = _mapper.Map<Patient>(patientDto);
            _context.Patients.Add(patient);

            // Save Audit Action
            // await LogAuditAsync(
            //     "Create",
            //     "Patient",
            //     patient.Id.ToString(),
            //     $"Patient {patient.FirstName} created."
            // );

            await _context.SaveChangesAsync();
            // return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patientDto);
            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientDto patientDto)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();

            _mapper.Map(patientDto, patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        private async Task LogAuditAsync(string actionType, string entityType, string entityId, string description)
        {
            var userIdString = GetCurrentUserId(); // Récupère l'ID de l'utilisateur
            Console.WriteLine($"User ID from JWT: {userIdString}");
            Console.WriteLine($"Entity ID: {entityId}");

            // Si vous comparez ces IDs, ajoutez un log supplémentaire :
            if (userIdString != entityId)
            {
                Console.WriteLine("IDs do not match. Unauthorized access.");
                throw new UnauthorizedAccessException("User is not authorized or invalid user ID.");
            }

            var auditLog = new AuditLog
            {
                UserId = userIdString, // Utilisez la valeur telle quelle
                ActionType = actionType,
                EntityType = entityType,
                EntityId = entityId,
                Description = description,
                ActionDate = DateTime.UtcNow
            };

            _context.AuditLog.Add(auditLog);
            await _context.SaveChangesAsync();
        }
    }
}