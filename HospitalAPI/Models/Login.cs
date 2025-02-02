using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI.Models
{
    public class Login
    {
        public required String Username { get; set; } = string.Empty;
        public required String Password { get; set; } = string.Empty;
    }
}