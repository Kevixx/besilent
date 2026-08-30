using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Core.Services;
using Backend.Core.DTOs;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ElectionController : ControllerBase
{
    private readonly IElectionService _electionService;

    public ElectionController(IElectionService service)
    {
        _electionService = service;
    }

    [HttpPost]
    public async Task<IActionResult> CreateElection([FromBody] CreateElectionDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var election = await _electionService.CreateElectionAsync(userId, dto);
            return CreatedAtAction(nameof(GetElection), new { id = election.Id }, election);
        }
        catch (ArgumentException ex)
        {
            // Returns a 400 Bad Request if the dates are wrong
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetElection(Guid id)
    {
        var election = await _electionService.GetElectionByIdAsync(id);

        if (election == null)
        {
            return NotFound(new { message = "Election not found." });
        }

        return Ok(election);
    }
}