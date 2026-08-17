namespace Backend.Core.Interfaces;

public interface ICandidateRepository
{
    Task<CandidateProfile?> GetByUserIdAsync(Guid userId);
    Task<CandidateProfile> AddAsync(CandidateProfile profile);
    Task<CandidateProfile> UpdateAsync(CandidateProfile profile);
}