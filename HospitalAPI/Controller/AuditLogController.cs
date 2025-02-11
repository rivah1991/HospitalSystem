using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Data;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controllers
{
    [Route("api/audit")]
    [ApiController]
    public class AuditController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuditController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 Récupérer tous les logs d'audit
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs()
        {
            var logs = await _context.AuditLog
                .OrderByDescending(log => log.ActionDate)
                .ToListAsync();

            return Ok(logs);
        }
    }
}
