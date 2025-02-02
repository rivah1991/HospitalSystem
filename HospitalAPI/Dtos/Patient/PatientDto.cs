using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Dtos.Patient
{
    public class PatientDto
    {
        public int Id { get; set; }
        public required string LastName { get; set; }
        public required string FirstName { get; set; }
        public DateTime BirthDate { get; set; }
        public required string Gender { get; set; }
        public string? Telephone { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}