using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Core.Interfaces;
using Backend.Core.Models; // Make sure to include this for CandidateProfile

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CandidateController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidateController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] CreateCandidateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid user token." });

        try
        {
            var profile = await _candidateService.CreateProfileAsync(userId, dto);

            // FIX: Map to DTO before returning
            var responseDto = MapToDto(profile);
            return CreatedAtAction(nameof(GetProfile), new { id = profile.Id }, responseDto);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(Guid id)
    {
        var profile = await _candidateService.GetProfileByIdAsync(id);
        if (profile == null) return NotFound(new { message = "Profile not found." });

        return Ok(MapToDto(profile));
    }

    [HttpGet]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid user token." });

        var profile = await _candidateService.GetProfileByUserIdAsync(userId);
        if (profile == null)
            return NoContent();

        return Ok(MapToDto(profile));
    }

    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCandidates()
    {
        // Your service already maps this to DTOs, so this is perfect as is!
        var candidates = await _candidateService.GetAllCandidatesAsync();
        return Ok(candidates);
    }

    [HttpGet("isCandidate")]
    public async Task<IActionResult> IsCandidate()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid user token." });

        var isCandidate = await _candidateService.IsCandidateAsync(userId);
        return Ok(new { isCandidate });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] CandidateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid user token." });

        try
        {
            var updatedProfile = await _candidateService.UpdateProfileAsync(userId, dto);

            return Ok(MapToDto(updatedProfile));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Profile not found." });
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid user token." });

        try
        {
            await _candidateService.DeleteProfileAsync(userId);
            return Ok(new { message = "Profile deleted successfully." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Profile not found." });
        }
    }

    // ==========================================
    // HELPER METHOD
    // ==========================================
    private static CandidateDto MapToDto(CandidateProfile profile)
    {
        return new CandidateDto
        {
            Id = profile.Id,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Bio = profile.Bio,
            LinkedInUrl = profile.LinkedInUrl,
            Agenda = profile.Agenda,
            KeyWords = profile.KeyWords,

            // Safely map parties if they exist, otherwise return empty list
            PartyIds = profile.Parties?.Select(p => p.Id).ToList() ?? new List<Guid>()
        };
    }
}