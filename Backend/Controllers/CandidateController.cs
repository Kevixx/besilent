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

            return CreatedAtAction(nameof(GetProfile), new { id = profile.Id }, profile);
        }
        catch (InvalidOperationException ex)
        {
            // Catches our business logic rule and returns a 409 Conflict
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(Guid id)
    {
        var profile = await _candidateService.GetProfileByIdAsync(id);

        if (profile == null) return NotFound(new { message = "Profile not found." });

        return Ok(profile);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        // Fetch the profile using the user's token ID
        var profile = await _candidateService.GetProfileByUserIdAsync(userId);


        if (profile == null)
        {
            return NoContent(); // Return 204 if the user has no profile
        }

        var dto = new ProfileDto
        {
            Id = profile.Id,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Bio = profile.Bio,
            LinkedInUrl = profile.LinkedInUrl,
            Agenda = profile.Agenda,
            KeyWords = profile.KeyWords,
            PartyIds = [.. profile.Parties.Select(p => p.Id)]
        };

        return Ok(dto);
    }

    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCandidates()
    {
        var candidates = await _candidateService.GetAllCandidatesAsync();
        return Ok(candidates);
    }

    [HttpGet("isCandidate")]
    public async Task<IActionResult> IsCandidate()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }
        var isCandidate = await _candidateService.IsCandidateAsync(userId);

        return Ok(new { isCandidate });
    }
}