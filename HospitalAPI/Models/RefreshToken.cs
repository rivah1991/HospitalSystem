using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace HospitalAPI.Models
{

    public class RefreshToken
    {
        public int Id { get; set; }
        public required string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string UserId { get; set; } = string.Empty;
        public bool IsRevoked { get; set; } = false;
        public ApplicationUser? User { get; set; }

        public RefreshToken() { }

        public RefreshToken(string token, DateTime expiryDate, string userId)
        {
            Token = token;
            ExpiryDate = expiryDate;
            UserId = userId;
        }
    }


}