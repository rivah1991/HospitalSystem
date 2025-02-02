using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Dtos.HealthSupervisor
{
    public class HealthCareProDTO
    {
        public string LastName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;

        // public string UserId { get; set; } = string.Empty;
    }
}