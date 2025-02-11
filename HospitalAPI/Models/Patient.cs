using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace HospitalAPI.Models
{
    public class Patient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public int Age { get; set; }

        [Required]
        [MaxLength(10)]
        public string Gender { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Mobile { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string MaritalStatus { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Occupation { get; set; } = string.Empty;

        [Required]
        [MaxLength(5)]
        public string BloodGroup { get; set; } = string.Empty;

        [MaxLength(255)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [MaxLength(100)]
        public string State { get; set; } = string.Empty;

        [MaxLength(10)]
        public string PostalCode { get; set; } = string.Empty;

        public required string UserId { get; set; }

        // Navigation property pour l'utilisateur (assurez-vous que le modèle User existe)
        // public required IdentityUser User { get; set; }


        // Relation One-to-Many avec les recommandations
        public ICollection<Recommendation> Recommendations { get; set; } = new List<Recommendation>();


    }
}