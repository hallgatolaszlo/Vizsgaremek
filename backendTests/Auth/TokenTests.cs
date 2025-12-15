using backend.Context;
using backend.DTOs.Auth;
using backend.Models;
using backendTests.TestHelpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backendTests.Auth
{
    public class TokenTests
    {
        // 1.
        [Fact]
        public async Task RefreshTokens_ShouldReturnNewTokens_WhenTokensAreValid()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;
            var authService = AuthServiceFactory.Create(databaseName);

            // Sign up and sign in
            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "refresh@example.com",
                Password = "ValidPass123!"
            });

            var originalTokens = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "refresh@example.com",
                Password = "ValidPass123!"
            });

            Assert.NotNull(originalTokens);

            // Act
            var newTokens = await authService.RefreshTokensAsync(originalTokens!);

            // Assert
            Assert.NotNull(newTokens);
            Assert.NotEqual(originalTokens.AccessToken, newTokens!.AccessToken);
            Assert.NotEqual(originalTokens.RefreshToken, newTokens.RefreshToken);

            // Verify new refresh token is saved to database
            using var context = new AppDbContext(options);
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "refresh@example.com");
            Assert.NotNull(user);
            Assert.Equal(newTokens.RefreshToken, user.RefreshToken);
        }

        // 2.
        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenRefreshTokenIsInvalid()
        {
            // Arrange
            var authService = AuthServiceFactory.Create(Guid.NewGuid().ToString());

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "user@example.com",
                Password = "ValidPass123!"
            });

            var tokens = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "user@example.com",
                Password = "ValidPass123!"
            });

            Assert.NotNull(tokens);

            // Create request with invalid refresh token
            var invalidRequest = new TokenResponseDTO
            {
                AccessToken = tokens!.AccessToken,
                RefreshToken = "invalid-refresh-token-12345"
            };

            // Act
            var result = await authService.RefreshTokensAsync(invalidRequest);

            // Assert
            Assert.Null(result);
        }

        // 3.
        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenAccessTokenIsInvalid()
        {
            // Arrange
            var authService = AuthServiceFactory.Create(Guid.NewGuid().ToString());

            var invalidRequest = new TokenResponseDTO
            {
                AccessToken = "invalid.access.token",
                RefreshToken = "some-refresh-token"
            };

            // Act
            var result = await authService.RefreshTokensAsync(invalidRequest);

            // Assert
            Assert.Null(result); // Should fail because GetUserIdFromExpiredToken returns null
        }

        // 4.
        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenRefreshTokenIsExpired()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            using var context = new AppDbContext(options);

            // Manually create user with expired refresh token
            var user = new User
            {
                Email = "expired@example.com",
                PasswordHash = new PasswordHasher<User>().HashPassword(null!, "ValidPass123!"),
                RefreshToken = "expired-token-123",
                RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(-1) // Expired yesterday
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var authService = AuthServiceFactory.Create(databaseName);

            // Sign in to get a valid access token
            var tokens = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "expired@example.com",
                Password = "ValidPass123!"
            });

            Assert.NotNull(tokens);

            // Create request with expired refresh token
            var expiredRequest = new TokenResponseDTO
            {
                AccessToken = tokens!.AccessToken,
                RefreshToken = "expired-token-123"
            };

            // Act
            var result = await authService.RefreshTokensAsync(expiredRequest);

            // Assert
            Assert.Null(result); // Should fail due to expired refresh token
        }
    }
}
