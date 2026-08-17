public class CandidateProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; } // Links to the Supabase Auth User
    public string Bio { get; set; } = string.Empty;
    public Guid? PartyId { get; set; } // Optional link to a PoliticalParty
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}