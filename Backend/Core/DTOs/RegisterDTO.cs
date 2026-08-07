using Backend.Core.Models;

public class RegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public GlobalRole Role { get; set; }
}