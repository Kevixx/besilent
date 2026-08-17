using Backend.Core.Interfaces;
using Backend.Core.Models;

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
}