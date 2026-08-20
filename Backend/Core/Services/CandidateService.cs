using Backend.Core.Interfaces;

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
        // 1. Business Rule: A user can only have one profile
        var existingProfile = await _repository.GetByUserIdAsync(userId);
        if (existingProfile != null)
        {
            throw new InvalidOperationException("You already have a candidate profile registered.");
        }

        // 2. Map DTO to Entity
        var newProfile = new CandidateProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Bio = dto.Bio,
            PartyId = dto.PartyId,
            CreatedAt = DateTime.UtcNow
        };

        // 3. Save via repository
        return await _repository.AddAsync(newProfile);
    }

    public async Task<CandidateProfile?> GetProfileByIdAsync(Guid id)
    {
        return await _repository.GetByUserIdAsync(id);
    }

    public async Task<bool> IsCandidateAsync(Guid userId)
    {
        var candidateId = await _repository.GetCandidateIdByUserIdAsync(userId);
        return candidateId != null;
    }
}