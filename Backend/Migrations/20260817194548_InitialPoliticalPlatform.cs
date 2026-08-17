using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialPoliticalPlatform : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PoliticalParties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    FounderCandidateId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PoliticalParties", x => x.Id);
                });

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
                    table.ForeignKey(
                        name: "FK_CandidateProfiles_PoliticalParties_PartyId",
                        column: x => x.PartyId,
                        principalTable: "PoliticalParties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            // --- SUPABASE RLS: CANDIDATE PROFILES ---
            migrationBuilder.Sql("ALTER TABLE \"CandidateProfiles\" ENABLE ROW LEVEL SECURITY;");

            migrationBuilder.Sql(@"
                CREATE POLICY ""Candidates manage their own profile"" ON ""CandidateProfiles"" 
                FOR ALL USING (""UserId"" = auth.uid()) WITH CHECK (""UserId"" = auth.uid());
            ");

            migrationBuilder.Sql(@"
                CREATE POLICY ""Public view candidate profiles"" ON ""CandidateProfiles"" 
                FOR SELECT USING (true);
            ");

            // --- SUPABASE RLS: POLITICAL PARTIES ---
            migrationBuilder.Sql("ALTER TABLE \"PoliticalParties\" ENABLE ROW LEVEL SECURITY;");

            // Because FounderCandidateId links to CandidateProfiles, we check if the auth.uid() owns that profile!
            migrationBuilder.Sql(@"
                CREATE POLICY ""Founders manage their party"" ON ""PoliticalParties"" 
                FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM ""CandidateProfiles"" cp 
                    WHERE cp.""Id"" = ""PoliticalParties"".""FounderCandidateId"" 
                    AND cp.""UserId"" = auth.uid()
                        )
                    );
                ");

            migrationBuilder.Sql(@"
                CREATE POLICY ""Public view political parties"" ON ""PoliticalParties"" 
                FOR SELECT USING (true);
            ");

            migrationBuilder.CreateIndex(
                name: "IX_CandidateProfiles_PartyId",
                table: "CandidateProfiles",
                column: "PartyId");

            migrationBuilder.CreateIndex(
                name: "IX_CandidateProfiles_UserId",
                table: "CandidateProfiles",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CandidateProfiles");

            migrationBuilder.DropTable(
                name: "PoliticalParties");
        }
    }
}
