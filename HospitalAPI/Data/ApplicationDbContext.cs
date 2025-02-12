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
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>  // Remplace ApplicationUser par ApplicationUser
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Ajout des tables Patient et ResponsableSante
        public DbSet<Patient> Patients { get; set; }
        public DbSet<HealthCarePro> HealthCarePro { get; set; }
        public DbSet<Recommendation> Recommendations { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<PendingUser> PendingUsers { get; set; }
        public DbSet<AuditLog> AuditLog { get; set; }
        public DbSet<PatientDoctorAssignment> PatientDoctorAssignments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration de la relation entre Patient et Recommendation
            modelBuilder.Entity<Recommendation>()
                .HasOne(r => r.Patient)
                .WithMany(p => p.Recommendations)
                .HasForeignKey(r => r.PatientId);

            // Configuration de la relation entre Patient et ApplicationUser (en fait ApplicationUser)
            modelBuilder.Entity<Patient>()
                .HasOne<ApplicationUser>()  // Chaque patient est un utilisateur
                .WithMany()                  // Un utilisateur peut avoir plusieurs patients
                .HasForeignKey(p => p.UserId)  // Lier par UserId
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PatientDoctorAssignment>()
             .HasOne<Patient>()
             .WithMany()
             .HasForeignKey(pda => pda.PatientId);

            // Configuration de la relation entre PatientDoctorAssignment et ApplicationUser (en tant que médecin)
            modelBuilder.Entity<PatientDoctorAssignment>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(pda => pda.UserId);
        }
    }
}
