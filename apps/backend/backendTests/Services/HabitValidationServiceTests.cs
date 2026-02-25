using backend.Context;
using backend.DTOs.Habit;
using backend.Models;
using backend.Models.Enums;
using backend.Services;
using backend.Services.Habit;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class HabitValidationServiceTests
    {
        private static (AppDbContext context, HabitValidationService service) CreateService(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            var context = new AppDbContext(options);
            var commonValidation = new CommonValidationService(context);
            var service = new HabitValidationService(commonValidation);
            return (context, service);
        }

        // --- ValidateHabitUpdateAsync ---

        // 1.
        [Fact]
        public async Task ValidateHabitUpdate_ShouldReturnSuccess_WhenDataIsValid()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile { Username = "testuser", Avatar = "a.png", UserId = user.Id };
            context.Profiles.Add(profile);
            await context.SaveChangesAsync();

            var habit = new Habit
            {
                Name = "Running",
                HabitCategory = HabitCategory.Exercise,
                Unit = Unit.Distance,
                ProfileId = profile.Id
            };
            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var dto = new UpdateHabitDto
            {
                Id = habit.Id,
                Name = "Updated Running",
                HabitCategory = HabitCategory.Exercise,
                Unit = Unit.Distance,
                Color = 2
            };

            // Act
            var result = await service.ValidateHabitUpdateAsync(dto);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 2.
        [Fact]
        public async Task ValidateHabitUpdate_ShouldReturnFailure_WhenHabitDoesNotExist()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());

            var dto = new UpdateHabitDto
            {
                Id = Guid.NewGuid(),
                Name = "Nonexistent",
                HabitCategory = HabitCategory.None,
                Unit = Unit.None,
                Color = 1
            };

            // Act
            var result = await service.ValidateHabitUpdateAsync(dto);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Habit not found", result.Message);
        }

        // 3.
        [Fact]
        public async Task ValidateHabitUpdate_ShouldReturnFailure_WhenNameIsTooShort()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile { Username = "testuser", Avatar = "a.png", UserId = user.Id };
            context.Profiles.Add(profile);
            await context.SaveChangesAsync();

            var habit = new Habit
            {
                Name = "Running",
                HabitCategory = HabitCategory.Exercise,
                Unit = Unit.Distance,
                ProfileId = profile.Id
            };
            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var dto = new UpdateHabitDto
            {
                Id = habit.Id,
                Name = "ab",
                HabitCategory = HabitCategory.Exercise,
                Unit = Unit.Distance,
                Color = 1
            };

            // Act
            var result = await service.ValidateHabitUpdateAsync(dto);

            // Assert
            Assert.False(result.Success);
        }
    }
}