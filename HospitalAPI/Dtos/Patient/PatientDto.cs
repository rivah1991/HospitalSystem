using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Dtos.Patient
{
    public class PatientDto
    {
        public required int Id { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required int Age { get; set; }  // Remplace BirthDate

        public required string Gender { get; set; }

        public required string Email { get; set; }

        public required string Mobile { get; set; }

        public required string MaritalStatus { get; set; }

        public required string Occupation { get; set; }

        public required string BloodGroup { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? PostalCode { get; set; }
    }
}