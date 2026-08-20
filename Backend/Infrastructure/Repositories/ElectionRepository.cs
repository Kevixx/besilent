using Backend.Core.Interfaces;
using Backend.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Database.Repositories;

public class ElectionRepository : IElectionRepository
{
    private readonly AppDbContext _context;

    public ElectionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Election> AddAsync(Election election)
    {
        _context.Elections.Add(election);
        await _context.SaveChangesAsync();
        return election;
    }

    public async Task<Election?> GetByIdAsync(Guid id)
    {
        return await _context.Elections
            .AsNoTracking() // Use AsNoTracking for read-only queries to improve performance
            .FirstOrDefaultAsync(e => e.Id == id);
    }
}