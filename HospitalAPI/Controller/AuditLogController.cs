using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controller
{
    [Route("api/auditlog")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuditLogController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/auditlog
        [HttpGet]
        public async Task<IActionResult> GetAuditLogs()
        {
            var auditLogs = await _context.AuditLog
                                          .OrderByDescending(log => log.ActionDate)  // Optionnel : trier par date
                                          .ToListAsync();

            return Ok(auditLogs);  // Retourner tous les logs d'audit
        }

        // GET: api/auditlog/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuditLog(int id)
        {
            var auditLog = await _context.AuditLog
                                          .FirstOrDefaultAsync(log => log.Id == id);

            if (auditLog == null)
            {
                return NotFound();
            }

            return Ok(auditLog);
        }

    }
}