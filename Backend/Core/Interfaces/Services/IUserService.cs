using Backend.Core.Models;

namespace Backend.Core.Interfaces.Services;

public interface IUserService
{
    Task<User?> AuthenticateAsync(string email, string password);
    Task<User?> RegisterAsync(string email, string password, GlobalRole role);
}