using Backend.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<CandidateProfile> CandidateProfiles { get; set; }
    public DbSet<PoliticalParty> PoliticalParties { get; set; }
    public DbSet<Election> Elections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Enforce a 1-to-1 relationship: A UserId can only have ONE Candidate Profile
        modelBuilder.Entity<CandidateProfile>()
            .HasIndex(c => c.UserId)
            .IsUnique();

        // Enforce a many-to-many relationship between CandidateProfile and PoliticalParty
        modelBuilder.Entity<PoliticalParty>()
            .HasMany(p => p.Members)
            .WithMany(c => c.Parties);
    }
}