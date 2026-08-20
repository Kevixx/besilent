namespace Backend.Core.Interfaces;

public interface ICandidateRepository
{
    Task<CandidateProfile?> GetProfileByIdAsync(Guid id);
    Task<CandidateProfile?> GetByUserIdAsync(Guid userId);
    Task<CandidateProfile> AddAsync(CandidateProfile profile);
    Task<CandidateProfile> UpdateAsync(CandidateProfile profile);

    Task<Guid?> GetCandidateIdByUserIdAsync(Guid userId);
}