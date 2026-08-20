using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface IElectionRepository
{
    Task<Election> AddAsync(Election election);
    Task<Election?> GetByIdAsync(Guid id);
}