using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Dtos
{
    public class UpdateUserProfileDto
    {
        public string? UserId { get; set; }
        public string? Specialty { get; set; }
        public string? Qualification { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }  // Numéro de téléphone
        public bool? IsApproved { get; set; }
    }
}