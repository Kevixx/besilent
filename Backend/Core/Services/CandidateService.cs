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

    public async Task<CandidateProfile> CreateProfileAsync(Guid userId, CreateCandidateDto dto)
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

    public async Task<CandidateProfile> UpdateProfileAsync(Guid userId, CandidateDto dto)
    {
        // Fetch the existing profile WITH tracking and WITH the Parties included.
        // Note: You may need to add a specific method to your repo like GetTrackedByUserIdAsync
        var existingProfile = await _repository.GetTrackedByUserIdAsync(userId);

        if (existingProfile == null)
        {
            // Throw the exception so the Controller catches it and returns 404
            throw new KeyNotFoundException("Candidate profile not found.");
        }

        // Update the scalar fields
        existingProfile.FirstName = dto.FirstName;
        existingProfile.LastName = dto.LastName;
        existingProfile.Bio = dto.Bio;
        existingProfile.LinkedInUrl = dto.LinkedInUrl;
        existingProfile.Agenda = dto.Agenda;
        existingProfile.KeyWords = dto.KeyWords;

        // Safely update the Many-to-Many relationship
        existingProfile.Parties.Clear();
        foreach (var partyId in dto.PartyIds)
        {
            // We only need to attach the ID. The repository will handle the rest.
            existingProfile.Parties.Add(new PoliticalParty { Id = partyId });
        }

        return await _repository.UpdateAsync(existingProfile);
    }

    public async Task DeleteProfileAsync(Guid userId)
    {
        var existingProfile = await _repository.GetByUserIdAsync(userId) ?? throw new KeyNotFoundException("Candidate profile not found.");
        await _repository.DeleteAsync(existingProfile);
    }

    public async Task<CandidateProfile?> GetProfileByIdAsync(Guid id)
    {
        return await _repository.GetProfileByIdAsync(id);
    }

    public async Task<CandidateProfile?> GetProfileByUserIdAsync(Guid userId)
    {
        return await _repository.GetByUserIdAsync(userId);
    }

    public async Task<IEnumerable<CandidateDto>> GetAllCandidatesAsync()
    {
        var profiles = await _repository.GetAllAsync();

        // Map the database entities to the shape Angular expects
        return profiles.Select(p => new CandidateDto
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