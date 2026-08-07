using Microsoft.EntityFrameworkCore;

namespace Backend.Core.Interfaces.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // public DbSet<User> Users { get; set; }
    // public DbSet<Workspace> Workspaces { get; set; }
    // public DbSet<WorkspaceAccess> WorkspaceAccesses { get; set; }
    // public DbSet<ApiConnection> ApiConnections { get; set; }
    // public DbSet<AdMetric> AdMetrics { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}