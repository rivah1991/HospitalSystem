using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Dtos
{
    public class PatientDoctorAssignmentDto
    {
        public int PatientId { get; set; }  // Référence à l'ID du patient
        public string? UserId { get; set; }
    }
}