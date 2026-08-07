using Microsoft.AspNetCore.Mvc;
using Backend.Core.Interfaces.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
private readonly IUserService _userService;

    // Inject the Service, NOT the Database
    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
        var user = await _userService.AuthenticateAsync(request.Email, request.Password);

        if (user == null)
        {
            return Unauthorized(new { Message = "Invalid credentials" });
        }
        
        return Ok(new 
        { 
            Message = "Login successful",
            UserId = user.Id,
            Role = user.GlobalRole.ToString(),
            Token = "mock-jwt-token-until-we-build-real-auth" 
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        try
        {
            var user = await _userService.RegisterAsync(request.Email, request.Password, request.Role);

            if (user == null)
            {
                return BadRequest(new { Message = "User already exists" });
            }

            return Ok(new { Message = "User registered successfully", UserId = user.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred during registration", Error = ex.Message });
        }
    }
}
