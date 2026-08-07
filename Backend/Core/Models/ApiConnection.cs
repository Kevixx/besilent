using Backend.Core.Models;

public class ApiConnection
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = null!;
    public Platform Platform { get; set; }
    public string EncryptedApiKey { get; set; } = string.Empty;
    public string ExternalAccountId { get; set; } = string.Empty;
}