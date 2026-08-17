using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // This tells EF Core to create a table called "CandidateProfiles"
    public DbSet<CandidateProfile> CandidateProfiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Enforce a 1-to-1 relationship: A UserId can only have ONE Candidate Profile
        modelBuilder.Entity<CandidateProfile>()
            .HasIndex(c => c.UserId)
            .IsUnique();
    }
}