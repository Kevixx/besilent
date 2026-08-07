public class WorkspaceAccess
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = null!;
}