using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Core.DTOs;

namespace Backend.Core.Services;

public class ElectionService : IElectionService
{
    private readonly IElectionRepository _repository;

    public ElectionService(IElectionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Election> CreateElectionAsync(Guid userId, CreateElectionDto dto)
    {
        // Business Logic Validation
        if (dto.StartDate >= dto.EndDate)
        {
            throw new ArgumentException("The election end date must be after the start date.");
        }

        if (dto.StartDate < DateTime.UtcNow)
        {
            throw new ArgumentException("Elections cannot be scheduled in the past.");
        }

        var newElection = new Election
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            // Convert to UTC to keep PostgreSQL happy
            StartDate = dto.StartDate.ToUniversalTime(),
            EndDate = dto.EndDate.ToUniversalTime(),
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        return await _repository.AddAsync(newElection);
    }

    public async Task<Election?> GetElectionByIdAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }
}