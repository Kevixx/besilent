using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Core.Interfaces;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CandidateController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    // Inject the Service, NOT the Database Context
    public CandidateController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] CreateProfileDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            // The controller doesn't know HOW the profile is created, just that it happens.
            var profile = await _candidateService.CreateProfileAsync(userId, dto);

            return CreatedAtAction(nameof(CreateProfile), new { id = profile.Id }, profile);
        }
        catch (InvalidOperationException ex)
        {
            // Catches our business logic rule and returns a 409 Conflict
            return Conflict(new { message = ex.Message });
        }
    }
}