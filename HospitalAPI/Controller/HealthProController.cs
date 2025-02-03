using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalAPI.Data;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Dtos.HealthSupervisor;
using HospitalAPI.Models;

namespace HospitalAPI.Controller
{
    // [Authorize(Roles = "User")]
    [Route("api/[Controller]")]
    [ApiController]
    public class HealthCareProController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public HealthCareProController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [Authorize(Roles = "Professional")]
        [HttpGet]
        public async Task<IActionResult> GetResponsables()
        {
            var responsables = await _context.HealthCarePro.ToListAsync();
            return Ok(_mapper.Map<List<HealthCareProDTO>>(responsables));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetResponsable(int id)
        {
            var responsable = await _context.HealthCarePro.FindAsync(id);
            if (responsable == null)
                return NotFound();

            return Ok(_mapper.Map<HealthCareProDTO>(responsable));
        }

        [HttpPost]
        public async Task<IActionResult> CreateResponsable([FromBody] HealthCareProDTO responsableDto)
        {
            var responsable = _mapper.Map<HealthCarePro>(responsableDto);
            _context.HealthCarePro.Add(responsable);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetResponsable), new { id = responsable.Id }, responsableDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResponsable(int id, [FromBody] HealthCareProDTO responsableDto)
        {
            var responsable = await _context.HealthCarePro.FindAsync(id);
            if (responsable == null)
                return NotFound();

            _mapper.Map(responsableDto, responsable);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResponsable(int id)
        {
            var responsable = await _context.HealthCarePro.FindAsync(id);
            if (responsable == null)
                return NotFound();

            _context.HealthCarePro.Remove(responsable);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}