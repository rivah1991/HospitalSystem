using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalAPI.Controller
{

    // [Authorize]
    // [Authorize(Policy = "AdminPolicy")]
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("You have accessed the Admin controller");
        }

        [HttpGet("claims")]
        public IActionResult GetClaims()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(claims);
        }
    }


}