using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Models
{
    public class Patient
    {
        [Key] // Définition de la clé primaire
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]  // Auto-incrémentation
        public int Id { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string MedicalHistory { get; set; } = string.Empty;

        // One-to-many relationship with recommendations
        public ICollection<Recommendation> Recommendations { get; set; } = new List<Recommendation>();
    }
}