# Stage 1: Build the application using the full .NET 10 SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy only the project file first and restore dependencies
# Docker caches this layer so future builds are lightning fast!
COPY Backend.csproj ./
RUN dotnet restore

# Copy the rest of the C# code and publish the release
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Create a lightweight runtime image for Railway
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Railway listens for web traffic on specific ports. 
# This ensures .NET routes traffic correctly.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# Copy the compiled files from Stage 1
COPY --from=build /app/publish .

# Start the application
ENTRYPOINT ["dotnet", "Backend.dll"]