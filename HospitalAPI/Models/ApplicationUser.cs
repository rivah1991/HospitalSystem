using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace HospitalAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public bool IsApproved { get; set; }

        public string? Specialty { get; set; }
        public string? Qualification { get; set; }

        public string? FullName { get; set; }

        public ICollection<Patient> Patients { get; set; } = new List<Patient>();

        public ICollection<PatientDoctorAssignment> AssignedPatients { get; set; } = new List<PatientDoctorAssignment>();



    }
}