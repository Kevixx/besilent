using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Reject anyone without a valid Supabase JWT token
public class UserController : ControllerBase
{
    [HttpGet("me")]
    public IActionResult GetCurrentProfile()
    {
        // When a valid token is provided, ASP.NET Core automatically decrypts it.
        // You can extract the Supabase User ID (UUID) from the token's "sub" or NameIdentifier claim.
        var supabaseUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue("sub");

        // Extract the user's email directly from the token's claims
        var email = User.FindFirstValue(ClaimTypes.Email);

        return Ok(new
        {
            Message = "Supabase token successfully validated by C#!",
            UserId = supabaseUserId,
            Email = email
        });
    }
}