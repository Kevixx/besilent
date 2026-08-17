public class CreateProfileDto
{
    public string Bio { get; set; } = string.Empty;
    public Guid? PartyId { get; set; } // Optional link to a PoliticalParty
}