using backend.Context;
using backend.DTOs.Profile;
using backend.Models;
using backend.Services;
using backend.Services.Profile;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class ProfileValidationServiceTests
    {
        private static (AppDbContext context, ProfileValidationService service) CreateService(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            var context = new AppDbContext(options);
            var commonValidation = new CommonValidationService(context);
            var service = new ProfileValidationService(context, commonValidation);
            return (context, service);
        }

        // --- ValidateProfileCreationAsync ---

        // 1.
        [Fact]
        public async Task ValidateProfileCreation_ShouldReturnSuccess_WhenDataIsValid()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile
            {
                Username = "validuser",
                Avatar = "avatar.png",
                IsPrivate = false,
                UserId = user.Id
            };

            // Act
            var result = await service.ValidateProfileCreationAsync(profile);

            // Assert
            Assert.True(result.Success);
        }

        // 2.
        [Fact]
        public async Task ValidateProfileCreation_ShouldReturnFailure_WhenUserDoesNotExist()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());

            var profile = new Profile
            {
                Username = "validuser",
                Avatar = "avatar.png",
                UserId = Guid.NewGuid()
            };

            // Act
            var result = await service.ValidateProfileCreationAsync(profile);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("User not found", result.Message);
        }

        // 3.
        [Fact]
        public async Task ValidateProfileCreation_ShouldReturnFailure_WhenUsernameIsTooShort()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile
            {
                Username = "ab",
                Avatar = "avatar.png",
                UserId = user.Id
            };

            // Act
            var result = await service.ValidateProfileCreationAsync(profile);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Name must be 3-64 characters long", result.Message);
        }

        // 4.
        [Fact]
        public async Task ValidateProfileCreation_ShouldReturnFailure_WhenBirthDateIsInFuture()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile
            {
                Username = "validuser",
                Avatar = "avatar.png",
                UserId = user.Id,
                BirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1))
            };

            // Act
            var result = await service.ValidateProfileCreationAsync(profile);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Are you from the future?", result.Message);
        }

        // --- ValidateProfileUpdateAsync ---

        // 5.
        [Fact]
        public async Task ValidateProfileUpdate_ShouldReturnSuccess_WhenDataIsValid()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile
            {
                Username = "originalname",
                Avatar = "avatar.png",
                UserId = user.Id
            };
            context.Profiles.Add(profile);
            await context.SaveChangesAsync();

            var updateDto = new UpdateProfileDTO
            {
                Id = profile.Id,
                Username = "updatedname",
                Avatar = "avatar.png",
                Email = "test@test.com"
            };

            // Act
            var result = await service.ValidateProfileUpdateAsync(updateDto);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 6.
        [Fact]
        public async Task ValidateProfileUpdate_ShouldReturnFailure_WhenUsernameAlreadyExists()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user1 = new User { Email = "user1@test.com", PasswordHash = "hash" };
            var user2 = new User { Email = "user2@test.com", PasswordHash = "hash" };
            context.Users.AddRange(user1, user2);
            await context.SaveChangesAsync();

            var profile1 = new Profile { Username = "takenname", Avatar = "a.png", UserId = user1.Id };
            var profile2 = new Profile { Username = "myname", Avatar = "a.png", UserId = user2.Id };
            context.Profiles.AddRange(profile1, profile2);
            await context.SaveChangesAsync();

            var updateDto = new UpdateProfileDTO
            {
                Id = profile2.Id,
                Username = "takenname",
                Avatar = "a.png",
                Email = "user2@test.com"
            };

            // Act
            var result = await service.ValidateProfileUpdateAsync(updateDto);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Username already exists", result.Message);
        }

        // 7.
        [Fact]
        public async Task ValidateProfileUpdate_ShouldReturnFailure_WhenProfileDoesNotExist()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());

            var updateDto = new UpdateProfileDTO
            {
                Id = Guid.NewGuid(),
                Username = "validuser",
                Avatar = "a.png",
                Email = "test@test.com"
            };

            // Act
            var result = await service.ValidateProfileUpdateAsync(updateDto);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Profile not found", result.Message);
        }

        // --- ValidateUniqueUsername ---

        // 8.
        [Fact]
        public async Task ValidateUniqueUsername_ShouldReturnTrue_WhenUsernameIsTaken()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            context.Profiles.Add(new Profile { Username = "taken", Avatar = "a.png", UserId = user.Id });
            await context.SaveChangesAsync();

            // Act
            var result = await service.ValidateUniqueUsername("taken");

            // Assert
            Assert.True(result);
        }

        // 9.
        [Fact]
        public async Task ValidateUniqueUsername_ShouldReturnFalse_WhenUsernameIsAvailable()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());

            // Act
            var result = await service.ValidateUniqueUsername("available");

            // Assert
            Assert.False(result);
        }

        // 10.
        [Fact]
        public async Task ValidateUniqueUsername_ShouldExcludeOwnId_WhenIdProvided()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile { Username = "myname", Avatar = "a.png", UserId = user.Id };
            context.Profiles.Add(profile);
            await context.SaveChangesAsync();

            // Act - same name but with own Id excluded
            var result = await service.ValidateUniqueUsername("myname", profile.Id);

            // Assert
            Assert.False(result);
        }
    }
}