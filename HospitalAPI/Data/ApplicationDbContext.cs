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
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Ajout des tables Patient et ResponsableSante
        public DbSet<Patient> Patients { get; set; }
        public DbSet<HealthCarePro> HealthCarePro { get; set; }
        public DbSet<Recommendation> Recommendations { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<PendingUser> PendingUsers { get; set; }
        public DbSet<AuditLog> AuditLog { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration de la relation entre Patient et Recommendation
            modelBuilder.Entity<Recommendation>()
                .HasOne(r => r.Patient)
                .WithMany(p => p.Recommendations)
                .HasForeignKey(r => r.PatientId);

            // Configuration de la relation entre Patient et IdentityUser
            modelBuilder.Entity<Patient>()
                .HasOne<IdentityUser>()  // Spécifie seulement la relation à IdentityUser sans la propriété de navigation
                .WithMany()  // Il n'y a pas de navigation vers Patient dans IdentityUser
                .HasForeignKey(p => p.UserId)  // Utilise uniquement la clé UserId
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
