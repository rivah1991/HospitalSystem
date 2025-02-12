using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Models
{
    public class PatientDoctorAssignment
    {
        [Key]
        public int Id { get; set; }

        public int PatientId { get; set; }  // Relier directement avec PatientId
        public string? UserId { get; set; }
    }
}