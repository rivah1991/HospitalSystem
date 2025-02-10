using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalAPI.Data;
using HospitalAPI.Dtos;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controller
{

    [Route("api/recommendations")] // Définir la route de base pour toutes les actions dans ce contrôleur
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecommendationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get all recommendations for a patient (GET /api/recommendations/patients/{id})
        [HttpGet("patients/{id}")]
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
        // [HttpPatch("{id}/status")]
        // public async Task<IActionResult> MarkRecommendationAsComplete(int id)
        // {
        //     var recommendation = await _context.Recommendations.FindAsync(id);
        //     if (recommendation == null)
        //     {
        //         return NotFound(new { message = "Recommendation not found." });
        //     }

        //     recommendation.Statut = "Completed";
        //     _context.Recommendations.Update(recommendation);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { message = "Recommendation successfully marked as completed." });
        // }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateRecommendationStatus(int id, [FromBody] string newStatus)
        {
            var recommendation = await _context.Recommendations.FindAsync(id);

            if (recommendation == null)
            {
                return NotFound($"Recommendation with ID {id} not found.");
            }

            // Mise à jour du statut
            recommendation.Statut = newStatus;

            try
            {
                // Sauvegarde des changements dans la base de données
                await _context.SaveChangesAsync();
                return Ok(recommendation); // Retourne la recommandation mise à jour
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 3. Create a new recommendation for a patient (POST /api/recommendations/patients/{id})
        [HttpPost("patients/{id}")]
        public async Task<IActionResult> CreateRecommendation(int id, [FromBody] Recommendation recommendation)
        {
            Console.WriteLine($"Request Body Content-Type: {Request.ContentType}");

            if (recommendation == null)
            {
                Console.WriteLine("Recommendation is null!");
                return BadRequest(new { message = "Invalid recommendation data." });
            }

            Console.WriteLine($"Received Recommendation: {recommendation.Type}, {recommendation.Description}, {recommendation.Statut}");

            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound(new { message = "Patient not found." });
            }

            recommendation.PatientId = id;
            _context.Recommendations.Add(recommendation);
            await _context.SaveChangesAsync();

            var recommendationDto = new RecommendationDto
            {
                Id = recommendation.Id,
                PatientId = recommendation.PatientId,
                Type = recommendation.Type,
                Description = recommendation.Description,
                Statut = recommendation.Statut
            };

            return CreatedAtAction(nameof(GetRecommendationsForPatient), new { id = id }, recommendationDto);
        }
    }
}