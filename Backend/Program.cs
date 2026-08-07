using Microsoft.EntityFrameworkCore;
using Backend.Core.Interfaces.Database;
using Backend.Core.Interfaces.Services;
using Backend.Core.Services;
using Backend.Core.Interfaces.Repositories;
using Backend.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddOpenApi();

// Define the policy (Great job including both URLs here!)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy => policy.WithOrigins(
                        "https://pl-and-partners.vercel.app",
                        "http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Register the Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

var app = builder.Build();

// Enable the policy right away
app.UseCors("AllowAngularDev");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "API is live and running!");
app.Run();