using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; } // ID of the user who performed the action
        public string ActionType { get; set; } = string.Empty; // Type of action (Create, Update, Delete)
        public string EntityType { get; set; } = string.Empty; // Entity type (Patient, Recommendation, etc.)
        public string EntityId { get; set; } = string.Empty; // ID of the entity on which the action was performed
        public string Description { get; set; } = string.Empty; // Action description
        public DateTime ActionDate { get; set; }
    }
}