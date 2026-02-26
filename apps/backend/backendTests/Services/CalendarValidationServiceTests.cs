using backend.Common;
using backend.Context;
using backend.DTOs.Calendar;
using backend.Models;
using backend.Models.Enums;
using backend.Services;
using backend.Services.Calendar;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class CalendarValidationServiceTests
    {
        private static (AppDbContext context, CalendarValidationService service) CreateService(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            var context = new AppDbContext(options);
            var commonValidation = new CommonValidationService(context);
            var service = new CalendarValidationService(commonValidation, context);
            return (context, service);
        }

        private static async Task<(User user, Profile profile)> SeedUserAndProfile(AppDbContext context)
        {
            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var profile = new Profile { Username = "testuser", Avatar = "a.png", UserId = user.Id };
            context.Profiles.Add(profile);
            await context.SaveChangesAsync();

            return (user, profile);
        }

        // --- ValidateCalendarCreation ---

        // 1.
        [Fact]
        public void ValidateCalendarCreation_ShouldReturnSuccess_WhenNameIsValid()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());
            var calendar = new backend.Models.Calendar { Name = "My Calendar" };

            // Act
            var result = service.ValidateCalendarCreation(calendar);

            // Assert
            Assert.True(result.Success);
        }

        // 2.
        [Fact]
        public void ValidateCalendarCreation_ShouldReturnFailure_WhenNameIsTooShort()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());
            var calendar = new backend.Models.Calendar { Name = "ab" };

            // Act
            var result = service.ValidateCalendarCreation(calendar);

            // Assert
            Assert.False(result.Success);
        }

        // 3.
        [Fact]
        public void ValidateCalendarCreation_WithDTO_ShouldReturnSuccess_WhenValid()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());
            var dto = new CreateCalendarDTO { Name = "Work Calendar", Color = 1 };

            // Act
            var result = service.ValidateCalendarCreation(dto);

            // Assert
            Assert.True(result.Success);
        }

        // --- ValidateAndGetCalendarForUpdateAsync ---

        // 4.
        [Fact]
        public async Task ValidateCalendarUpdate_ShouldReturnSuccess_WhenOwnerUpdates()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, profile) = await SeedUserAndProfile(context);

            var calendar = new backend.Models.Calendar { Name = "My Calendar", ProfileId = profile.Id };
            context.Calendars.Add(calendar);
            await context.SaveChangesAsync();

            var dto = new UpdateCalendarDTO { Id = calendar.Id, Name = "Updated", Color = 2 };

            // Act
            var result = await service.ValidateAndGetCalendarForUpdateAsync(profile.Id, dto);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 5.
        [Fact]
        public async Task ValidateCalendarUpdate_ShouldReturnFailure_WhenCalendarDoesNotExist()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, profile) = await SeedUserAndProfile(context);

            var dto = new UpdateCalendarDTO { Id = Guid.NewGuid(), Name = "Updated", Color = 1 };

            // Act
            var result = await service.ValidateAndGetCalendarForUpdateAsync(profile.Id, dto);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Calendar not found", result.Message);
        }

        // --- ValidateCalendarEditingPermissionAsync ---

        // 6.
        [Fact]
        public async Task ValidatePermission_ShouldReturnSuccess_WhenUserIsOwner()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, profile) = await SeedUserAndProfile(context);

            var calendar = new backend.Models.Calendar { Name = "My Calendar", ProfileId = profile.Id };
            context.Calendars.Add(calendar);
            await context.SaveChangesAsync();

            // Act
            var result = await service.ValidateCalendarEditingPermissionAsync(profile.Id, calendar.Id);

            // Assert
            Assert.True(result.Success);
        }

        // 7.
        [Fact]
        public async Task ValidatePermission_ShouldReturnFailure_WhenUserIsViewer()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, ownerProfile) = await SeedUserAndProfile(context);

            var viewerUser = new User { Email = "viewer@test.com", PasswordHash = "hash" };
            context.Users.Add(viewerUser);
            await context.SaveChangesAsync();

            var viewerProfile = new Profile { Username = "viewer", Avatar = "a.png", UserId = viewerUser.Id };
            context.Profiles.Add(viewerProfile);
            await context.SaveChangesAsync();

            var calendar = new backend.Models.Calendar { Name = "Shared Cal", ProfileId = ownerProfile.Id };
            context.Calendars.Add(calendar);
            await context.SaveChangesAsync();

            context.SharedCalendars.Add(new SharedCalendar
            {
                ProfileId = viewerProfile.Id,
                CalendarId = calendar.Id,
                Role = Role.Viewer
            });
            await context.SaveChangesAsync();

            // Act
            var result = await service.ValidateCalendarEditingPermissionAsync(viewerProfile.Id, calendar.Id);

            // Assert
            Assert.False(result.Success);
            Assert.Equal(CommonErrors.ImATeapot, result.Message);
        }

        // --- HasCalendarAccessAsync ---

        // 8.
        [Fact]
        public async Task HasCalendarAccess_ShouldReturnTrue_WhenUserIsOwner()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, profile) = await SeedUserAndProfile(context);

            var calendar = new backend.Models.Calendar { Name = "My Calendar", ProfileId = profile.Id };
            context.Calendars.Add(calendar);
            await context.SaveChangesAsync();

            // Act
            var result = await service.HasCalendarAccessAsync(profile.Id, calendar.Id);

            // Assert
            Assert.True(result);
        }

        // 9.
        [Fact]
        public async Task HasCalendarAccess_ShouldReturnFalse_WhenUserHasNoAccess()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, profile) = await SeedUserAndProfile(context);

            // Act
            var result = await service.HasCalendarAccessAsync(profile.Id, Guid.NewGuid());

            // Assert
            Assert.False(result);
        }

        // --- ValidateAndGetCalendarForDeletionAsync ---

        // 10.
        [Fact]
        public async Task ValidateCalendarDeletion_ShouldReturnSuccess_WhenOwnerDeletes()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, profile) = await SeedUserAndProfile(context);

            var calendar = new backend.Models.Calendar { Name = "Delete Me", ProfileId = profile.Id };
            context.Calendars.Add(calendar);
            await context.SaveChangesAsync();

            // Act
            var result = await service.ValidateAndGetCalendarForDeletionAsync(profile.Id, calendar.Id);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
        }

        // 11.
        [Fact]
        public async Task ValidateCalendarDeletion_ShouldReturnFailure_WhenCalendarNotFound()
        {
            // Arrange
            var (_, service) = CreateService(Guid.NewGuid().ToString());

            // Act
            var result = await service.ValidateAndGetCalendarForDeletionAsync(Guid.NewGuid(), Guid.NewGuid());

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Calendar not found", result.Message);
        }

        // --- GetAccessibleCalendarsAsync ---

        // 12.
        [Fact]
        public async Task GetAccessibleCalendars_ShouldReturnOwnAndShared()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var (context, service) = CreateService(dbName);
            var (_, profile) = await SeedUserAndProfile(context);

            var ownCalendar = new backend.Models.Calendar { Name = "Own", ProfileId = profile.Id };
            context.Calendars.Add(ownCalendar);
            await context.SaveChangesAsync();

            var otherUser = new User { Email = "other@test.com", PasswordHash = "hash" };
            context.Users.Add(otherUser);
            await context.SaveChangesAsync();

            var otherProfile = new Profile { Username = "other", Avatar = "a.png", UserId = otherUser.Id };
            context.Profiles.Add(otherProfile);
            await context.SaveChangesAsync();

            var sharedCal = new backend.Models.Calendar { Name = "Shared", ProfileId = otherProfile.Id };
            context.Calendars.Add(sharedCal);
            await context.SaveChangesAsync();

            context.SharedCalendars.Add(new SharedCalendar
            {
                ProfileId = profile.Id,
                CalendarId = sharedCal.Id,
                Role = Role.Editor
            });
            await context.SaveChangesAsync();

            var calendarIds = new List<Guid> { ownCalendar.Id, sharedCal.Id };

            // Act
            var result = await service.GetAccessibleCalendarsAsync(profile.Id, calendarIds);

            // Assert
            Assert.Equal(2, result.Count);
        }
    }
}