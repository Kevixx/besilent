namespace Backend.Core.Interfaces;

public interface ICandidateService
{
    Task<CandidateProfile> CreateProfileAsync(Guid userId, CreateProfileDto dto);
}