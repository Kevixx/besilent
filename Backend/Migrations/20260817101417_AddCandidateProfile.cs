using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidateProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CandidateProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: false),
                    PartyId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CandidateProfiles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CandidateProfiles_UserId",
                table: "CandidateProfiles",
                column: "UserId",
                unique: true);

            // 1. Enable RLS on the CandidateProfiles table
            migrationBuilder.Sql("ALTER TABLE \"CandidateProfiles\" ENABLE ROW LEVEL SECURITY;");

            // 2. Policy: Candidates can only manage their own profile
            migrationBuilder.Sql(@"
        CREATE POLICY ""Candidates can manage their own profile"" 
        ON ""CandidateProfiles"" 
        FOR ALL 
        USING (""UserId"" = auth.uid()) 
        WITH CHECK (""UserId"" = auth.uid());
    ");

            // 3. Policy: The public can read all candidate profiles (for the directory/dashboard)
            migrationBuilder.Sql(@"
        CREATE POLICY ""Public can view all candidate profiles"" 
        ON ""CandidateProfiles"" 
        FOR SELECT 
        USING (true);
    ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CandidateProfiles");
        }
    }
}
