using backend.Context;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class CommonValidationServiceTests
    {
        private static AppDbContext CreateContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new AppDbContext(options);
        }

        // --- EntityExists ---

        // 1.
        [Fact]
        public async Task EntityExists_ShouldReturnSuccess_WhenEntityExists()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            var context = CreateContext(dbName);
            var service = new CommonValidationService(context);

            var user = new User { Email = "test@test.com", PasswordHash = "hash" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Act
            var result = await service.EntityExists<User>(user.Id);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(user.Id, result.Data!.Id);
        }

        // 2.
        [Fact]
        public async Task EntityExists_ShouldReturnFailure_WhenEntityDoesNotExist()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var result = await service.EntityExists<User>(Guid.NewGuid());

            // Assert
            Assert.False(result.Success);
            Assert.Equal("User not found", result.Message);
        }

        // --- ValidateEnum ---

        // 3.
        [Fact]
        public void ValidateEnum_ShouldReturnSuccess_WhenValueIsValid()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var result = service.ValidateEnum<backend.Models.Enums.Role>("Editor");

            // Assert
            Assert.True(result.Success);
            Assert.Equal(backend.Models.Enums.Role.Editor, result.Data);
        }

        // 4.
        [Fact]
        public void ValidateEnum_ShouldReturnSuccess_WhenValueIsCaseInsensitive()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var result = service.ValidateEnum<backend.Models.Enums.Role>("viewer");

            // Assert
            Assert.True(result.Success);
            Assert.Equal(backend.Models.Enums.Role.Viewer, result.Data);
        }

        // 5.
        [Fact]
        public void ValidateEnum_ShouldReturnFailure_WhenValueIsInvalid()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var result = service.ValidateEnum<backend.Models.Enums.Role>("InvalidRole");

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Invalid Role value", result.Message);
        }

        // --- ValidateText ---

        // 6.
        [Fact]
        public void ValidateText_ShouldReturnSuccess_WhenTextIsValid()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var result = service.ValidateText("ValidName");

            // Assert
            Assert.True(result.Success);
        }

        // 7.
        [Fact]
        public void ValidateText_ShouldReturnFailure_WhenTextIsTooShort()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var result = service.ValidateText("ab");

            // Assert
            Assert.False(result.Success);
            Assert.Contains("must be at least 3 characters", result.Message);
        }

        // 8.
        [Fact]
        public void ValidateText_ShouldReturnFailure_WhenTextIsTooLong()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            var longText = new string('a', 33);

            // Act
            var result = service.ValidateText(longText);

            // Assert
            Assert.False(result.Success);
            Assert.Contains("must not exceed 32 characters", result.Message);
        }

        // 9.
        [Fact]
        public void ValidateText_ShouldReturnFailure_WhenTextIsEmpty()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var result = service.ValidateText("   ");

            // Assert
            Assert.False(result.Success);
            Assert.Contains("cannot be empty", result.Message);
        }

        // 10.
        [Fact]
        public void ValidateText_ShouldRespectCustomMinAndMaxLength()
        {
            // Arrange
            var context = CreateContext(Guid.NewGuid().ToString());
            var service = new CommonValidationService(context);

            // Act
            var tooShort = service.ValidateText("ab", 5, 100);
            var tooLong = service.ValidateText(new string('a', 101), 5, 100);
            var valid = service.ValidateText("hello", 5, 100);

            // Assert
            Assert.False(tooShort.Success);
            Assert.False(tooLong.Success);
            Assert.True(valid.Success);
        }
    }
}