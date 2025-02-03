using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Dtos
{
    public class RecommendationDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string? Type { get; set; }
        public string? Description { get; set; }
        public string? Statut { get; set; }
    }
}