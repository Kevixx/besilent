using Backend.Core.Models;
using Backend.Core.DTOs;

namespace Backend.Core.Services;

public interface IPartyService
{
    Task<PoliticalParty> CreatePartyAsync(Guid userId, CreatePartyDto dto);
    Task<PoliticalParty?> GetPartyByIdAsync(Guid id);
}