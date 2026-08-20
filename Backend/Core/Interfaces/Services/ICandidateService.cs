namespace Backend.Core.Interfaces;

public interface ICandidateService
{
    Task<CandidateProfile> CreateProfileAsync(Guid userId, CreateProfileDto dto);
    Task<CandidateProfile?> GetProfileByIdAsync(Guid id);
    Task<CandidateProfile?> GetProfileByUserIdAsync(Guid userId);
    Task<bool> IsCandidateAsync(Guid userId);
}