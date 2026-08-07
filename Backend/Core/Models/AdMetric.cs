namespace Backend.Core.Models;

public class AdMetric
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = null!;
    public Platform Platform { get; set; }
    public DateOnly RecordDate { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public string AdName { get; set; } = string.Empty;
    public decimal Spend { get; set; }
    public int Impressions { get; set; }
    public int Clicks { get; set; }
    public int Conversions { get; set; }
}