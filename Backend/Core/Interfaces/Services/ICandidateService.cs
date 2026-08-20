namespace Backend.Core.Interfaces;

public interface ICandidateService
{
    Task<CandidateProfile> CreateProfileAsync(Guid userId, CreateProfileDto dto);
    Task<CandidateProfile?> GetProfileByIdAsync(Guid id);
    Task<bool> IsCandidateAsync(Guid userId);
}