using backend.Common;
using backend.Context;
using backend.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestHelpers;

namespace Auth
{
    public class SignUpTests
    {
        // 1.
        [Fact]
        public async Task SignUp_ShouldReturnError_WhenEmailIsInvalid()
        {
            //Arrange
            var authService = AuthServiceFactory.Create(Guid.NewGuid().ToString());
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "invalidemail.com",
                Password = "ValidPass123!"
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(AuthErrors.InvalidEmail, result);
        }

        // 2.
        [Theory]
        [InlineData("testuser@example.com", "short")]
        [InlineData("testuser@example.com", "verylongpasswordverylongpasswordverylongpasswordverylongpasswordverylongpasswordverylongpasswordverylongpasswordverylongpasswordverylongpassword")]
        [InlineData("testuser@example.com", "VALIDPASS123!")]
        [InlineData("testuser@example.com", "validpass123!")]
        [InlineData("testuser@example.com", "ValidPass123")]
        [InlineData("testuser@example.com", "ValidPass!")]
        public async Task SignUp_ShouldReturnError_WhenPasswordIsInvalid(string email, string password)
        {
            // Arrange
            var authService = AuthServiceFactory.Create(Guid.NewGuid().ToString());
            var signUpRequest = new SignUpRequestDTO
            {
                Email = email,
                Password = password
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(AuthErrors.InvalidPassword, result);
        }

        // 3.
        [Fact]
        public async Task SignUp_ShouldCreateUser_WhenDataIsValid()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            var authService = AuthServiceFactory.Create(databaseName);
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "newuser@example.com",
                Password = "ValidPass123!"
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.Null(result); // Null indicates success

            // Verify user was created in database
            using var context = new AppDbContext(options);
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "newuser@example.com");
            Assert.NotNull(user);
            Assert.Equal("newuser@example.com", user.Email);
            Assert.NotNull(user.PasswordHash);
            Assert.NotEmpty(user.PasswordHash);
        }

        // 4.
        [Fact]
        public async Task SignUp_ShouldHashPassword_WhenUserIsCreated()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            var authService = AuthServiceFactory.Create(databaseName);
            var plainPassword = "SecurePass123!";
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "hashtest@example.com",
                Password = plainPassword
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.Null(result);

            using var context = new AppDbContext(options);
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "hashtest@example.com");
            Assert.NotNull(user);
            Assert.NotEqual(plainPassword, user.PasswordHash); // Password should be hashed
        }

        // 5.
        [Fact]
        public async Task SignUp_ShouldReturnError_WhenEmailAlreadyExists()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            var authService = AuthServiceFactory.Create(databaseName);
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "existing@example.com",
                Password = "ValidPass123!"
            };

            // Act
            await authService.SignUpAsync(signUpRequest); // First sign up
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(AuthErrors.UserAlreadyExists, result);
        }
    }
}
