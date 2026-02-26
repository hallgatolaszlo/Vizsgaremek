using backend.Context;
using backend.Models;
using backend.Models.Enums;
using backend.Services.SharedCalendar;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class SharedCalendarValidationServiceTests
    {
        private static (AppDbContext context, SharedCalendarValidationService service) CreateService(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            var context = new AppDbContext(options);
            var service = new SharedCalendarValidationService(context);
            return (context, service);
        }

        private static async Task<(Profile profile, backend.Models.Calendar calendar)> SeedData(AppDbContext context)
        {
            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile { Username = "testuser", Avatar = "a.png", UserId = user.Id };
            context.Profiles.Add(profile);
            await context.SaveChangesAsync();

            var calendar = new backend.Models.Calendar { Name = "Test Cal", ProfileId = profile.Id };
            context.Calendars.Add(calendar);
            await context.SaveChangesAsync();

            return (profile, calendar);
        }

        // --- SharedCalendarCreationAsync ---

        // 1.
        [Fact]
        public async Task SharedCalendarCreation_ShouldReturnSuccess_WhenNotAlreadyShared()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, calendar) = await SeedData(context);

            // Act
            var result = await service.SharedCalendarCreationAsync(profile.Id, calendar.Id);

            // Assert
            Assert.True(result.Success);
        }

        // 2.
        [Fact]
        public async Task SharedCalendarCreation_ShouldReturnFailure_WhenAlreadyShared()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, calendar) = await SeedData(context);

            context.SharedCalendars.Add(new SharedCalendar
            {
                ProfileId = profile.Id,
                CalendarId = calendar.Id,
                Role = Role.Editor
            });
            await context.SaveChangesAsync();

            // Act
            var result = await service.SharedCalendarCreationAsync(profile.Id, calendar.Id);

            // Assert
            Assert.False(result.Success);
        }

        // --- FindSharedCalendar ---

        // 3.
        [Fact]
        public async Task FindSharedCalendar_ShouldReturnSuccess_WhenFound()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, calendar) = await SeedData(context);

            context.SharedCalendars.Add(new SharedCalendar
            {
                ProfileId = profile.Id,
                CalendarId = calendar.Id,
                Role = Role.Editor
            });
            await context.SaveChangesAsync();

            // Act
            var result = await service.FindSharedCalendar(profile.Id, calendar.Id);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 4.
        [Fact]
        public async Task FindSharedCalendar_ShouldReturnFailure_WhenNotFound()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());

            // Act
            var result = await service.FindSharedCalendar(Guid.NewGuid(), Guid.NewGuid());

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Calendar not found", result.Message);
        }
    }
}