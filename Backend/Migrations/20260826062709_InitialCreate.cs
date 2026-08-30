using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
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
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LinkedInUrl = table.Column<string>(type: "text", nullable: true),
                    Agenda = table.Column<string>(type: "text", nullable: false),
                    KeyWords = table.Column<List<string>>(type: "text[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CandidateProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Elections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elections", x => x.Id);
                });

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
                name: "CandidateProfilePoliticalParty",
                columns: table => new
                {
                    MembersId = table.Column<Guid>(type: "uuid", nullable: false),
                    PartiesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CandidateProfilePoliticalParty", x => new { x.MembersId, x.PartiesId });
                    table.ForeignKey(
                        name: "FK_CandidateProfilePoliticalParty_CandidateProfiles_MembersId",
                        column: x => x.MembersId,
                        principalTable: "CandidateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CandidateProfilePoliticalParty_PoliticalParties_PartiesId",
                        column: x => x.PartiesId,
                        principalTable: "PoliticalParties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CandidateProfilePoliticalParty_PartiesId",
                table: "CandidateProfilePoliticalParty",
                column: "PartiesId");

            migrationBuilder.CreateIndex(
                name: "IX_CandidateProfiles_UserId",
                table: "CandidateProfiles",
                column: "UserId",
                unique: true);

            // ---------------------------------------------------------
            // --- SUPABASE RLS POLICIES ---
            // ---------------------------------------------------------

            // 1. CANDIDATE PROFILES
            migrationBuilder.Sql("ALTER TABLE \"CandidateProfiles\" ENABLE ROW LEVEL SECURITY;");
            migrationBuilder.Sql(@"
                CREATE POLICY ""Candidates manage their own profile"" ON ""CandidateProfiles"" 
                FOR ALL USING (""UserId"" = auth.uid()) WITH CHECK (""UserId"" = auth.uid());
            ");
            migrationBuilder.Sql(@"
                CREATE POLICY ""Public view candidate profiles"" ON ""CandidateProfiles"" 
                FOR SELECT USING (true);
            ");

            // 2. ELECTIONS
            migrationBuilder.Sql("ALTER TABLE \"Elections\" ENABLE ROW LEVEL SECURITY;");
            migrationBuilder.Sql(@"
                CREATE POLICY ""Creators manage their own elections"" ON ""Elections"" 
                FOR ALL USING (""CreatedByUserId"" = auth.uid()) WITH CHECK (""CreatedByUserId"" = auth.uid());
            ");
            migrationBuilder.Sql(@"
                CREATE POLICY ""Public view elections"" ON ""Elections"" 
                FOR SELECT USING (true);
            ");

            // 3. POLITICAL PARTIES
            migrationBuilder.Sql("ALTER TABLE \"PoliticalParties\" ENABLE ROW LEVEL SECURITY;");
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

            // 4. CANDIDATE / PARTY AFFILIATIONS (JOIN TABLE)
            migrationBuilder.Sql("ALTER TABLE \"CandidateProfilePoliticalParty\" ENABLE ROW LEVEL SECURITY;");
            migrationBuilder.Sql(@"
                CREATE POLICY ""Public view affiliations"" ON ""CandidateProfilePoliticalParty"" 
                FOR SELECT USING (true);
            ");
            migrationBuilder.Sql(@"
                CREATE POLICY ""Candidates manage their affiliations"" ON ""CandidateProfilePoliticalParty"" 
                FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM ""CandidateProfiles"" cp 
                        WHERE cp.""Id"" = ""CandidateProfilePoliticalParty"".""MembersId"" 
                        AND cp.""UserId"" = auth.uid()
                    )
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CandidateProfilePoliticalParty");

            migrationBuilder.DropTable(
                name: "Elections");

            migrationBuilder.DropTable(
                name: "CandidateProfiles");

            migrationBuilder.DropTable(
                name: "PoliticalParties");
        }
    }
}
