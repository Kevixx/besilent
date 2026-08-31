public class CandidateDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; } = string.Empty;
    public string? LinkedInUrl { get; set; }
    public string Agenda { get; set; } = string.Empty;
    public List<string>? KeyWords { get; set; }
    public List<Guid> PartyIds { get; set; } = [];
}