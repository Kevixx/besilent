using Backend.Core.Models;

public class CandidateProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? LinkedInUrl { get; set; }
    public string Agenda { get; set; } = string.Empty;
    public List<string>? KeyWords { get; set; } = new List<string>();
    // EF Core strictly requires the Entity type for Many-to-Many
    public List<PoliticalParty> Parties { get; set; } = [];
}
