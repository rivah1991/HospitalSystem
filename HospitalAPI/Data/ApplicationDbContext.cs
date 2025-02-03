using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Data
{
    // public class ApplicationDbContext : DbContext
    // {

    //     public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    //     public DbSet<Patient> Patients { get; set; }

    //     public DbSet<Admin> Admins { get; set; }
    //     public DbSet<ResponsableSante> ResponsablesSante { get; set; }
    // }

    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        // Ajout des tables Patient et ResponsableSante
        public DbSet<Patient> Patients { get; set; }
        public DbSet<HealthCarePro> HealthCarePro { get; set; }
        public DbSet<Recommendation> Recommendations { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
    
        public DbSet<PendingUser> PendingUsers { get; set; }

         public DbSet<AuditLog> AuditLog { get; set; }

        protected ApplicationDbContext()
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration de la relation entre Patient et Recommendation
            modelBuilder.Entity<Recommendation>()
                .HasOne(r => r.Patient)
                .WithMany(p => p.Recommendations)
                .HasForeignKey(r => r.PatientId);
        }

    }
}