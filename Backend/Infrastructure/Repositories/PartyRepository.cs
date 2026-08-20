using Backend.Core.Interfaces;
using Backend.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Database.Repositories;

public class PartyRepository : IPartyRepository
{
    private readonly AppDbContext _context;

    public PartyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PoliticalParty> AddAsync(PoliticalParty party)
    {
        _context.PoliticalParties.Add(party);
        await _context.SaveChangesAsync();
        return party;
    }

    public async Task<PoliticalParty?> GetByIdAsync(Guid id)
    {
        return await _context.PoliticalParties
            .AsNoTracking() // Use AsNoTracking for read-only queries to improve performance
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}