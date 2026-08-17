using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Core.Services;
using Backend.Core.DTOs;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PartyController : ControllerBase
{
    private readonly IPartyService _partyService;

    public PartyController(IPartyService partyService)
    {
        _partyService = partyService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateParty([FromBody] CreatePartyDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var party = await _partyService.CreatePartyAsync(userId, dto);
            return CreatedAtAction(nameof(CreateParty), new { id = party.Id }, party);
        }
        catch (UnauthorizedAccessException ex)
        {
            // If they don't have a Candidate Profile, return 403 Forbidden
            return StatusCode(403, new { message = ex.Message });
        }
    }
}