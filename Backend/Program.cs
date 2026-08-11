using Microsoft.EntityFrameworkCore;
using Backend.Core.Interfaces.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddOpenApi();

var frontendUrl = builder.Configuration["Urls:FrontendUrl"] ?? throw new InvalidOperationException("Frontend URL is not configured in appsettings.json");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy => policy.WithOrigins(frontendUrl)
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Register the Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure C# to validate Supabase Asymmetric JWTs automatically
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var validIssuer = builder.Configuration["Jwt:ValidIssuer"];
        var authority = builder.Configuration["Jwt:Authority"];

        // Tell ASP.NET Core to automatically fetch the public keys from Supabase! No secret needed.
        options.Authority = authority;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,

            // Validate the Audience
            ValidateAudience = true,
            ValidAudience = "authenticated",

            // Ensure the token actually came from your specific project
            ValidateIssuer = true,
            ValidIssuer = validIssuer
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    // Force HTTPS in production
    app.UseHttpsRedirection();
}

// Enable the policy right away
app.UseCors("AllowAngularDev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "API is live and running!");
app.Run();