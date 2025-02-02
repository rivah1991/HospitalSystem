using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Models
{
    public class Recommendation
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Statut { get; set; } = string.Empty;

        // Navigation to associated patient
        public required Patient Patient { get; set; }
    }
}