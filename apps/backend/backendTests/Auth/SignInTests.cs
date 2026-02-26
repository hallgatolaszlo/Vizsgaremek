using backend.Context;
using backend.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using TestHelpers;

namespace Auth
{
    public class SignInTests
    {
        // 1.
        [Fact]
        public async Task SignIn_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var authService = AuthServiceFactory.Create(Guid.NewGuid().ToString());
            var request = new SignInRequestDTO
            {
                Email = "nonexistent@example.com",
                Password = "ValidPass123!"
            };

            // Act
            var result = await authService.SignInAsync(request);

            // Assert
            Assert.Null(result);
        }

        // 2.
        [Fact]
        public async Task SignIn_ShouldReturnNull_WhenPasswordIsIncorrect()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var authService = AuthServiceFactory.Create(databaseName);

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "user@example.com",
                Password = "ValidPass123!"
            });

            var signInRequest = new SignInRequestDTO
            {
                Email = "user@example.com",
                Password = "WrongPass123!"
            };

            // Act
            var result = await authService.SignInAsync(signInRequest);

            // Assert
            Assert.Null(result);
        }

        // 3.
        [Fact]
        public async Task SignIn_ShouldReturnTokens_WhenCredentialsAreValid()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var authService = AuthServiceFactory.Create(databaseName);

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "valid@example.com",
                Password = "ValidPass123!"
            });

            var signInRequest = new SignInRequestDTO
            {
                Email = "valid@example.com",
                Password = "ValidPass123!"
            };

            // Act
            var result = await authService.SignInAsync(signInRequest);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AccessToken);
            Assert.NotEmpty(result.AccessToken);
            Assert.NotNull(result.RefreshToken);
            Assert.NotEmpty(result.RefreshToken);
        }

        // 4.
        [Fact]
        public async Task SignIn_ShouldSaveRefreshToken_WhenLoginSucceeds()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName)
                .Options;

            var authService = AuthServiceFactory.Create(databaseName);

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "refresh@example.com",
                Password = "ValidPass123!"
            });

            // Act
            var result = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "refresh@example.com",
                Password = "ValidPass123!"
            });

            // Assert
            Assert.NotNull(result);

            using var context = new AppDbContext(options);
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "refresh@example.com");
            Assert.NotNull(user);
            Assert.NotNull(user.RefreshToken);
            Assert.NotNull(user.RefreshTokenExpiryTime);
            Assert.True(user.RefreshTokenExpiryTime > DateTime.UtcNow);
        }

        // 5.
        [Fact]
        public async Task RefreshTokens_ShouldReturnNewTokens_WhenTokensAreValid()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var authService = AuthServiceFactory.Create(databaseName);

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "tokenuser@example.com",
                Password = "ValidPass123!"
            });

            var signInResult = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "tokenuser@example.com",
                Password = "ValidPass123!"
            });

            var refreshRequest = new TokenResponseDTO
            {
                AccessToken = signInResult!.AccessToken,
                RefreshToken = signInResult.RefreshToken
            };

            // Act
            var result = await authService.RefreshTokensAsync(refreshRequest);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AccessToken);
            Assert.NotNull(result.RefreshToken);
        }

        // 6.
        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenRefreshTokenIsInvalid()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var authService = AuthServiceFactory.Create(databaseName);

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "badtoken@example.com",
                Password = "ValidPass123!"
            });

            var signInResult = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "badtoken@example.com",
                Password = "ValidPass123!"
            });

            var refreshRequest = new TokenResponseDTO
            {
                AccessToken = signInResult!.AccessToken,
                RefreshToken = "invalid-refresh-token"
            };

            // Act
            var result = await authService.RefreshTokensAsync(refreshRequest);

            // Assert
            Assert.Null(result);
        }

        // 7.
        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenAccessTokenIsInvalid()
        {
            // Arrange
            var databaseName = Guid.NewGuid().ToString();
            var authService = AuthServiceFactory.Create(databaseName);

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "badaccess@example.com",
                Password = "ValidPass123!"
            });

            var signInResult = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "badaccess@example.com",
                Password = "ValidPass123!"
            });

            var refreshRequest = new TokenResponseDTO
            {
                AccessToken = "not-a-valid-jwt-token",
                RefreshToken = signInResult!.RefreshToken
            };

            // Act
            var result = await authService.RefreshTokensAsync(refreshRequest);

            // Assert
            Assert.Null(result);
        }
    }
}
