namespace Backend.Core.Interfaces;

public interface ICandidateService
{
    Task<CandidateProfile> CreateProfileAsync(Guid userId, CreateCandidateDto dto);
    Task<CandidateProfile?> GetProfileByIdAsync(Guid id);
    Task<CandidateProfile?> GetProfileByUserIdAsync(Guid userId);
    Task<CandidateProfile> UpdateProfileAsync(Guid userId, CandidateDto dto);
    Task DeleteProfileAsync(Guid userId);
    Task<IEnumerable<CandidateDto>> GetAllCandidatesAsync();
    Task<bool> IsCandidateAsync(Guid userId);
}