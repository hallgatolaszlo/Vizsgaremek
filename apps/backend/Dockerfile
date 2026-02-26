# ---- Build Stage ----
# We use the .NET SDK image to COMPILE the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /src

# Copy the project file first (for layer caching)
# Docker caches each step - if this file doesn't change,
# it won't re-download all NuGet packages on every build
COPY backendAPI/backend.csproj backendAPI/

# Restore (download) all NuGet dependencies
RUN dotnet restore backendAPI/backend.csproj

# Copy the rest of the source code
COPY . .

# Compile and publish the app in Release mode
# Output goes to /app/publish
RUN dotnet publish backendAPI/backend.csproj -c Release -o /app/publish

# ---- Runtime Stage ----
# We use a SMALLER image that only has the .NET runtime (not the full SDK)
# This makes the final image much smaller (~200MB vs ~800MB)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copy only the compiled output from the build stage
# This is called a "multi-stage build"
COPY --from=build /app/publish .

# The app listens on port 8080 inside the container
EXPOSE 8080

# Command to run when the container starts
ENTRYPOINT ["dotnet", "backend.dll"]