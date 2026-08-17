using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface IPartyRepository
{
    Task<PoliticalParty> AddAsync(PoliticalParty party);
}