using Microsoft.EntityFrameworkCore;
using Backend.Core.Interfaces;

namespace Backend.Infrastructure.Database.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly AppDbContext _context;

    public CandidateRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CandidateProfile?> GetByUserIdAsync(Guid userId)
    {
        return await _context.CandidateProfiles
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<CandidateProfile> AddAsync(CandidateProfile profile)
    {
        _context.CandidateProfiles.Add(profile);
        await _context.SaveChangesAsync();
        return profile;
    }

    public async Task<CandidateProfile> UpdateAsync(CandidateProfile profile)
    {
        _context.CandidateProfiles.Update(profile);
        await _context.SaveChangesAsync();
        return profile;
    }
}