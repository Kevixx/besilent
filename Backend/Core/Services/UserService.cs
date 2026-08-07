using Backend.Core.Interfaces.Services;
using Backend.Core.Interfaces.Repositories;

namespace Backend.Core.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<User?> AuthenticateAsync(string email, string password)
    {
        // 1. Data Retrieval
        var user = await _userRepository.GetUserByEmailAsync(email);
        
        if (user == null) return null;

        // 2. Business Logic: Verify Password (Placeholder for real hashing)
        var isPasswordValid = VerifyPassword(password, user.PasswordHash);
        
        if (!isPasswordValid) return null;
        Console.WriteLine($"User {email} authenticated successfully.");
        return user;
    }

    public async Task<User?> RegisterAsync(string email, string password, GlobalRole role)
    {
        // 1. Business Logic: Validation
        var existingUser = await _userRepository.GetUserByEmailAsync(email);
        if (existingUser != null) return null; 

        // 2. Business Logic: Hashing
        var hashedPassword = HashPassword(password); 

        var user = new User
        {
            Email = email,
            PasswordHash = hashedPassword,
            GlobalRole = role
        };

        // 3. Data Persistence
        await _userRepository.AddUserAsync(user);

        return user;
    }

    // --- Private Helper Methods for Business Rules ---
    private string HashPassword(string rawPassword)
    {
        // TODO: Implement BCrypt or ASP.NET Core's IPasswordHasher here
        return $"hashed_{rawPassword}"; 
    }

    private bool VerifyPassword(string rawPassword, string hashedPassword)
    {
        // TODO: Implement real verification here
        return hashedPassword == $"hashed_{rawPassword}";
    }
}