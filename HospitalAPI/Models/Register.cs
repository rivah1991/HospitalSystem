using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Models
{
    public class Register
    {
        public required String Username { get; set; } = string.Empty;
        public required String Email { get; set; } = string.Empty;
        public required String Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Professional";
    }

}