using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Core.DTOs;

namespace Backend.Core.Services;

public class PartyService : IPartyService
{
    private readonly ICandidateRepository _candidateRepo;
    private readonly IPartyRepository _partyRepo; // We will make this next

    public PartyService(ICandidateRepository candidateRepo, IPartyRepository partyRepo)
    {
        _candidateRepo = candidateRepo;
        _partyRepo = partyRepo;
    }

    public async Task<PoliticalParty> CreatePartyAsync(Guid userId, CreatePartyDto dto)
    {
        // 1. ENFORCE THE RULE: Get the user's Candidate Profile (their "Political ID")
        var candidateProfile = await _candidateRepo.GetByUserIdAsync(userId);

        if (candidateProfile == null)
        {
            throw new UnauthorizedAccessException("You must have a registered Candidate Profile to create a party.");
        }

        // 2. Map the DTO
        var newParty = new PoliticalParty
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            FounderCandidateId = candidateProfile.Id, // Set the founder to this candidate
            CreatedAt = DateTime.UtcNow
        };

        // 3. Save the new party
        var savedParty = await _partyRepo.AddAsync(newParty);

        // 4. (Optional but recommended) Automatically join the founder to their new party
        candidateProfile.PartyId = savedParty.Id;
        await _candidateRepo.UpdateAsync(candidateProfile);

        return savedParty;
    }

    public async Task<PoliticalParty?> GetPartyByIdAsync(Guid id)
    {
        return await _partyRepo.GetByIdAsync(id);
    }
}