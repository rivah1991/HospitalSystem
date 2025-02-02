using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalAPI.Data;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controller
{
    public class RecommendationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecommendationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get all recommendations for a patient (GET /api/patients/{id}/recommendations)
        [HttpGet("/api/patients/{id}/recommendations")]
        public async Task<IActionResult> GetRecommendationsForPatient(int id)
        {
            var recommendations = await _context.Recommendations
                .Where(r => r.PatientId == id)
                .ToListAsync();

            if (recommendations == null || !recommendations.Any())
            {
                return NotFound(new { message = "No recommendations found for this patient." });
            }

            return Ok(recommendations);
        }

        // 2. Mark a recommendation as completed (PATCH /api/recommendations/{id}/complete)
        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> MarkRecommendationAsComplete(int id)
        {
            var recommendation = await _context.Recommendations.FindAsync(id);
            if (recommendation == null)
            {
                return NotFound(new { message = "Recommendation not found." });
            }

            recommendation.Statut = "Completed";
            _context.Recommendations.Update(recommendation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Recommendation successfully marked as completed." });
        }
        [HttpPost("/api/patients/{id}/recommendations")]
        public async Task<IActionResult> CreateRecommendation(int id, [FromBody] Recommendation recommendation)
        {
            if (recommendation == null || string.IsNullOrWhiteSpace(recommendation.Description))
            {
                return BadRequest(new { message = "Les données de la recommandation sont invalides." });
            }

            // Vérifier si le patient existe
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound(new { message = "Patient non trouvé." });
            }

            recommendation.PatientId = id;
            _context.Recommendations.Add(recommendation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecommendationsForPatient), new { id = id }, recommendation);
        }
    }
}