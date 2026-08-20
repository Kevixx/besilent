using Backend.Core.Models;
using Backend.Core.DTOs;

namespace Backend.Core.Services;

public interface IElectionService
{
    Task<Election> CreateElectionAsync(Guid userId, CreateElectionDto dto);
    Task<Election?> GetElectionByIdAsync(Guid id);
}