using backend.Context;
using backend.DTOs.Friend;
using backend.Models;
using backend.Models.Enums;
using backend.Services.Friend;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class FriendValidationServiceTests
    {
        private static (AppDbContext context, FriendValidationService service) CreateService(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            var context = new AppDbContext(options);
            var service = new FriendValidationService(context);
            return (context, service);
        }

        private static async Task<(Profile profile1, Profile profile2)> SeedTwoProfiles(AppDbContext context)
        {
            var user1 = new User { Email = "user1@test.com", PasswordHash = "hash" };
            var user2 = new User { Email = "user2@test.com", PasswordHash = "hash" };
            context.Users.AddRange(user1, user2);
            await context.SaveChangesAsync();

            var profile1 = new Profile { Username = "user1", Avatar = "a.png", UserId = user1.Id };
            var profile2 = new Profile { Username = "user2", Avatar = "a.png", UserId = user2.Id };
            context.Profiles.AddRange(profile1, profile2);
            await context.SaveChangesAsync();

            return (profile1, profile2);
        }

        // --- ValidateFriendCreationAsync ---

        // 1.
        [Fact]
        public async Task ValidateFriendCreation_ShouldReturnSuccess_WhenFriendDoesNotExist()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, profile2) = await SeedTwoProfiles(context);

            // Act
            var result = await service.ValidateFriendCreationAsync(profile1.Id, profile2.Id);

            // Assert
            Assert.True(result.Success);
        }

        // 2.
        [Fact]
        public async Task ValidateFriendCreation_ShouldReturnFailure_WhenFriendAlreadyExists()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, profile2) = await SeedTwoProfiles(context);

            context.Friends.Add(new Friend
            {
                User1ProfileId = profile1.Id,
                User2ProfileId = profile2.Id,
                Status = Status.Accepted
            });
            await context.SaveChangesAsync();

            // Act
            var result = await service.ValidateFriendCreationAsync(profile1.Id, profile2.Id);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Friend already exists", result.Message);
        }

        // 3.
        [Fact]
        public async Task ValidateFriendCreation_ShouldReturnFailure_WhenSameUser()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, _) = await SeedTwoProfiles(context);

            // Act
            var result = await service.ValidateFriendCreationAsync(profile1.Id, profile1.Id);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Users cannot be the same", result.Message);
        }

        // --- FriendExists ---

        // 4.
        [Fact]
        public async Task FriendExists_ShouldReturnSuccess_WhenFriendshipExists()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, profile2) = await SeedTwoProfiles(context);

            context.Friends.Add(new Friend
            {
                User1ProfileId = profile1.Id,
                User2ProfileId = profile2.Id,
                Status = Status.Pending
            });
            await context.SaveChangesAsync();

            // Act
            var result = await service.FriendExists(profile1.Id, profile2.Id);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 5.
        [Fact]
        public async Task FriendExists_ShouldReturnFailure_WhenNoFriendship()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, profile2) = await SeedTwoProfiles(context);

            // Act
            var result = await service.FriendExists(profile1.Id, profile2.Id);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Friend not found", result.Message);
        }

        // --- ValidateAndGetFriendForUpdateAsync ---

        // 6.
        [Fact]
        public async Task ValidateFriendUpdate_ShouldReturnSuccess_WhenFriendExists()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, profile2) = await SeedTwoProfiles(context);

            context.Friends.Add(new Friend
            {
                User1ProfileId = profile1.Id,
                User2ProfileId = profile2.Id,
                Status = Status.Pending
            });
            await context.SaveChangesAsync();

            var request = new UpdateFriendStatus
            {
                ProfileId = profile2.Id,
                Status = Status.Accepted
            };

            // Act
            var result = await service.ValidateAndGetFriendForUpdateAsync(profile1.Id, request);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 7.
        [Fact]
        public async Task ValidateFriendUpdate_ShouldReturnFailure_WhenFriendNotFound()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, profile2) = await SeedTwoProfiles(context);

            var request = new UpdateFriendStatus
            {
                ProfileId = profile2.Id,
                Status = Status.Accepted
            };

            // Act
            var result = await service.ValidateAndGetFriendForUpdateAsync(profile1.Id, request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Friend not found", result.Message);
        }

        // 8.
        [Fact]
        public async Task ValidateFriendUpdate_ShouldReturnFailure_WhenSameUser()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile1, profile2) = await SeedTwoProfiles(context);

            // Seed a self-referencing friend record so FriendExists passes
            context.Friends.Add(new Friend
            {
                User1ProfileId = profile1.Id,
                User2ProfileId = profile1.Id,
                Status = Status.Pending
            });
            await context.SaveChangesAsync();

            var request = new UpdateFriendStatus
            {
                ProfileId = profile1.Id,
                Status = Status.Accepted
            };

            // Act
            var result = await service.ValidateAndGetFriendForUpdateAsync(profile1.Id, request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Users cannot be the same", result.Message);
        }
    }
}