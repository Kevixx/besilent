using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Reject anyone without a valid JWT token
public class UserController : ControllerBase
{
    [HttpGet("me")]
    public IActionResult GetCurrentProfile()
    {
        // Extract the Auth Provider UUID from the token
        // In .NET, the JWT "sub" claim maps to ClaimTypes.NameIdentifier
        var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(supabaseUserId))
        {
            return Unauthorized("User ID not found in token.");
        }

        // Extract the user's email directly from the token's claims or from the "email" claim if available
        var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");

        return Ok(new
        {
            Message = "Token successfully validated by C#!",
            UserId = supabaseUserId,
            Email = email
        });
    }
}