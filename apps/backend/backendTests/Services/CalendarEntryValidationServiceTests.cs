using backend.Context;
using backend.DTOs.CalendarEntry;
using backend.Models;
using backend.Models.Enums;
using backend.Services;
using backend.Services.Calendar;
using backend.Services.CalendarEntry;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class CalendarEntryValidationServiceTests
    {
        private static (AppDbContext context, CalendarEntryValidationService service) CreateService(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            var context = new AppDbContext(options);
            var commonValidation = new CommonValidationService(context);
            var calendarValidation = new CalendarValidationService(commonValidation, context);
            var service = new CalendarEntryValidationService(commonValidation, calendarValidation);
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

        // --- ValidateCalendarEntryCreationAsync ---

        // 1.
        [Fact]
        public async Task ValidateEntryCreation_ShouldReturnSuccess_WhenDataIsValid()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, calendar) = await SeedData(context);

            var dto = new CreateCalendarEntryDTO
            {
                Name = "Meeting",
                EntryCategory = EntryCategory.Event,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddHours(1),
                CalendarId = calendar.Id
            };

            // Act
            var result = await service.ValidateCalendarEntryCreationAsync(dto, profile.Id);

            // Assert
            Assert.True(result.Success);
        }

        // 2.
        [Fact]
        public async Task ValidateEntryCreation_ShouldReturnFailure_WhenCalendarDoesNotExist()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, _) = await SeedData(context);

            var dto = new CreateCalendarEntryDTO
            {
                Name = "Meeting",
                EntryCategory = EntryCategory.Event,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddHours(1),
                CalendarId = Guid.NewGuid()
            };

            // Act
            var result = await service.ValidateCalendarEntryCreationAsync(dto, profile.Id);

            // Assert
            Assert.False(result.Success);
        }

        // 3.
        [Fact]
        public async Task ValidateEntryCreation_ShouldReturnFailure_WhenStartDateIsAfterEndDate()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, calendar) = await SeedData(context);

            var dto = new CreateCalendarEntryDTO
            {
                Name = "Bad Date Entry",
                EntryCategory = EntryCategory.Event,
                StartDate = DateTime.UtcNow.AddHours(2),
                EndDate = DateTime.UtcNow,
                CalendarId = calendar.Id
            };

            // Act
            var result = await service.ValidateCalendarEntryCreationAsync(dto, profile.Id);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("End date cannot be sooner than start date", result.Message);
        }

        // --- ValidateAndGetCalendarEntryForUpdateAsync ---

        // 4.
        [Fact]
        public async Task ValidateEntryUpdate_ShouldReturnSuccess_WhenDataIsValid()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, calendar) = await SeedData(context);

            var entry = new CalendarEntry
            {
                Name = "Original",
                EntryCategory = EntryCategory.Task,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddHours(1),
                CalendarId = calendar.Id,
                CreatedBy = profile.Id
            };
            context.CalendarEntries.Add(entry);
            await context.SaveChangesAsync();

            var dto = new UpdateCalendarEntryDTO
            {
                Id = entry.Id,
                Name = "Updated",
                EntryCategory = EntryCategory.Task,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddHours(2),
                CalendarId = calendar.Id
            };

            // Act
            var result = await service.ValidateAndGetCalendarEntryForUpdateAsync(dto, profile.Id);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 5.
        [Fact]
        public async Task ValidateEntryUpdate_ShouldReturnFailure_WhenEntryDoesNotExist()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (profile, calendar) = await SeedData(context);

            var dto = new UpdateCalendarEntryDTO
            {
                Id = Guid.NewGuid(),
                Name = "Missing",
                EntryCategory = EntryCategory.Event,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddHours(1),
                CalendarId = calendar.Id
            };

            // Act
            var result = await service.ValidateAndGetCalendarEntryForUpdateAsync(dto, profile.Id);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Entry not found", result.Message);
        }

        // 6.
        [Fact]
        public async Task ValidateEntryCreation_ShouldReturnFailure_WhenViewerTriesToCreate()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (ownerProfile, calendar) = await SeedData(context);

            var viewerUser = new User { Email = "viewer@test.com", PasswordHash = "hash" };
            context.Users.Add(viewerUser);
            await context.SaveChangesAsync();

            var viewerProfile = new Profile { Username = "viewer", Avatar = "a.png", UserId = viewerUser.Id };
            context.Profiles.Add(viewerProfile);
            await context.SaveChangesAsync();

            context.SharedCalendars.Add(new SharedCalendar
            {
                ProfileId = viewerProfile.Id,
                CalendarId = calendar.Id,
                Role = Role.Viewer
            });
            await context.SaveChangesAsync();

            var dto = new CreateCalendarEntryDTO
            {
                Name = "Viewer Entry",
                EntryCategory = EntryCategory.Event,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddHours(1),
                CalendarId = calendar.Id
            };

            // Act
            var result = await service.ValidateCalendarEntryCreationAsync(dto, viewerProfile.Id);

            // Assert
            Assert.False(result.Success);
        }
    }
}