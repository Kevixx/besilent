namespace Backend.Core.Models;

public class PoliticalParty
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // The "Political ID" of the candidate who founded it
    public Guid FounderCandidateId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property for Entity Framework
    public ICollection<CandidateProfile> Members { get; set; } = new List<CandidateProfile>();
}