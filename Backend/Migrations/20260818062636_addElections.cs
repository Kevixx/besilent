using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addElections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            // 1. Enable RLS on the table
            migrationBuilder.Sql("ALTER TABLE \"Elections\" ENABLE ROW LEVEL SECURITY;");

            // 2. Policy: Only the user who created the election can manage it (update/delete)
            migrationBuilder.Sql(@"
                CREATE POLICY ""Creators manage their own elections"" ON ""Elections"" 
                FOR ALL USING (""CreatedByUserId"" = auth.uid()) WITH CHECK (""CreatedByUserId"" = auth.uid());
            ");

            // 3. Policy: The public (and other candidates) can view the events
            migrationBuilder.Sql(@"
                CREATE POLICY ""Public view elections"" ON ""Elections"" 
                FOR SELECT USING (true);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Elections");
        }
    }
}
