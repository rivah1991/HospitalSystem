using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Models
{
    public class Register
    {
        // public required String Username { get; set; } = string.Empty;
        // public required String Email { get; set; } = string.Empty;
        // public required String Password { get; set; } = string.Empty;

        // public string Role { get; set; } = "Professional";

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(50, ErrorMessage = "Email must not exceed 50 characters.")]
        public string Email { get; set; } = string.Empty;

        // Validate that the password is required and must have at least 6 characters.
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;

        // [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = "Professional";

    }

}