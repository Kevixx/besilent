using Backend.Core.Interfaces;
using Backend.Core.Models;

namespace Backend.Core.Services;

public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _repository;

    public CandidateService(ICandidateRepository repository)
    {
        _repository = repository;
    }

    public async Task<CandidateProfile> CreateProfileAsync(Guid userId, CreateProfileDto dto)
    {
        // Business Rule: A user can only have one profile
        var existingProfile = await _repository.GetByUserIdAsync(userId);
        if (existingProfile != null)
        {
            throw new InvalidOperationException("You already have a candidate profile registered.");
        }

        var newProfile = new CandidateProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Bio = dto.Bio,
            LinkedInUrl = dto.LinkedInUrl,
            Agenda = dto.Agenda,
            KeyWords = dto.KeyWords,
            CreatedAt = DateTime.UtcNow
        };

        // Link the Parties (EF Core trick to link existing records by ID without querying them first)
        foreach (var partyId in dto.PartyIds)
        {
            newProfile.Parties.Add(new PoliticalParty { Id = partyId });
        }

        return await _repository.AddAsync(newProfile);
    }

    public async Task<CandidateProfile?> GetProfileByIdAsync(Guid id)
    {
        return await _repository.GetProfileByIdAsync(id);
    }

    public async Task<CandidateProfile?> GetProfileByUserIdAsync(Guid userId)
    {
        return await _repository.GetByUserIdAsync(userId);
    }

    public async Task<IEnumerable<ProfileDto>> GetAllCandidatesAsync()
    {
        var profiles = await _repository.GetAllAsync();

        // Map the database entities to the shape Angular expects
        return profiles.Select(p => new ProfileDto
        {
            Id = p.Id,
            FirstName = p.FirstName,
            LastName = p.LastName,
            Bio = p.Bio,
            LinkedInUrl = p.LinkedInUrl,
            Agenda = p.Agenda,
            KeyWords = p.KeyWords,
            PartyIds = p.Parties.Select(party => party.Id).ToList()
        });
    }

    public async Task<bool> IsCandidateAsync(Guid userId)
    {
        var candidateId = await _repository.GetCandidateIdByUserIdAsync(userId);
        return candidateId != null;
    }
}