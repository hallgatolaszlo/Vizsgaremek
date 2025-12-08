using backend.DTOs.Auth;
using backend.Models;
using backend.Services;
using backend.Context;
using backend.Controllers;
using backend.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;

namespace backendTests
{
    public class UserAuthTest
    {
        private static AuthService CreateAuthService(string databaseName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;
            var context = new AppDbContext(options);

            // Mock configuration with JWT settings to avoid null reference issues
            var inMemorySettings = new Dictionary<string, string>
            {
                {"jwt-secret-key", "test-secret-key-with-at-least-64-bytes-for-hmacsha512-algorithm!!"},
                {"AppSettings:Issuer", "test-issuer"},
                {"AppSettings:Audience", "test-audience"}
            };
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();

            return new AuthService(context, configuration);
        }

        [Fact]
        public async Task SignUp_ShouldReturnError_WhenEmailIsInvalid()
        {
            // Arrange
            var authService = CreateAuthService("TestDb_InvalidEmail");
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "invalidemail.com",
                Password = "ValidPass123!"
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Invalid email format.", result);
        }

        [Fact]
        public async Task SignUp_ShouldReturnError_WhenPasswordIsWeak()
        {
            // Arrange
            var authService = CreateAuthService("TestDb_WeakPassword");
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "testuser@example.com",
                Password = "weak"
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Password must be between 8 and 128 characters long and include uppercase, lowercase, digit, and special character.", result);
        }

        [Fact]
        public async Task SignUp_ShouldReturnError_WhenPasswordMissingUppercase()
        {
            // Arrange
            var authService = CreateAuthService("TestDb_NoUppercase");
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "testuser@example.com",
                Password = "validpass123!"
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Password must be between 8 and 128 characters long and include uppercase, lowercase, digit, and special character.", result);
        }

        [Fact]
        public async Task SignUp_ShouldReturnError_WhenPasswordMissingSpecialCharacter()
        {
            // Arrange
            var authService = CreateAuthService("TestDb_NoSpecialChar");
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "testuser@example.com",
                Password = "ValidPass123"
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Password must be between 8 and 128 characters long and include uppercase, lowercase, digit, and special character.", result);
        }

        [Fact]
        public async Task SignUp_ShouldReturnError_WhenEmailAlreadyExists()
        {
            // Arrange
            var databaseName = "TestDb_DuplicateEmail";
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            using var context = new AppDbContext(options);
            context.Users.Add(new User
            {
                Email = "existing@example.com",
                PasswordHash = "hashedpassword123"
            });
            await context.SaveChangesAsync();

            var authService = CreateAuthService(databaseName);
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "existing@example.com",
                Password = "ValidPass123!"
            };

            // Act
            var result = await authService.SignUpAsync(signUpRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("User with this email already exists.", result);
        }

        [Fact]
        public async Task SignUp_ShouldCreateUser_WhenDataIsValid()
        {
            // Arrange
            var databaseName = "TestDb_ValidSignUp";
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            var authService = CreateAuthService(databaseName);
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

        [Fact]
        public async Task SignUp_ShouldHashPassword_WhenUserIsCreated()
        {
            // Arrange
            var databaseName = "TestDb_PasswordHashing";
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            var authService = CreateAuthService(databaseName);
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
        [Fact]
        public async Task SignIn_ShouldReturnNull_WhenUserNotFound()
        {
            // Arrange
            var authService = CreateAuthService("TestDb_SignIn_UserNotFound");
            var signInRequest = new SignInRequestDTO
            {
                Email = "nonexistent@example.com"
            };

            // Act
            var result = await authService.SignInAsync(signInRequest);

            // Assert
            Assert.Null(result);
        }
        [Fact]
        public async Task SignIn_ShouldReturnToken_WhenCredentialsAreValid()
        {
            // Arrange
            var databaseName = "TestDb_SignIn_ValidCredentials";
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;
            using var context = new AppDbContext(options);
            var authService = CreateAuthService(databaseName);
            var signUpRequest = new SignUpRequestDTO
            {
                Email = "valid@example.com",
                Password = "ValidPass123!"
            };
            var signInRequest = new SignInRequestDTO
            {
                Email = "valid@example.com",
                Password = "ValidPass123!"
            };
            // First, sign up the user
            await authService.SignUpAsync(signUpRequest);
            // Act
            var result = await authService.SignInAsync(signInRequest);
            // Assert
            Assert.NotNull(result);
            Assert.False(string.IsNullOrEmpty(result!.AccessToken));
            Assert.False(string.IsNullOrEmpty(result.RefreshToken));
        }

        [Fact]
        public async Task SignIn_ShouldReturnValidAccesToken_WhenCredsAreValid()
        {
            // Arrange
            string databaseName = "TestDb_SignIn_ValidCredsWithValidAccessToken";
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;
            using var context = new AppDbContext(options);
            var authService = CreateAuthService(databaseName);

            var signUpRequest = new SignUpRequestDTO
            {
                Email = "test@email.com",
                Password = "TestPass123!"
            };
            var signInRequest = new SignInRequestDTO
            {
                Email = "test@email.com",
                Password = "TestPass123!"
            };

            await authService.SignUpAsync(signUpRequest);

            // Act
            var result = await authService.SignInAsync(signInRequest);

            // Assert
            Assert.NotNull(result);
            Assert.False(string.IsNullOrEmpty(result!.AccessToken));
            Assert.False(string.IsNullOrEmpty(result.RefreshToken));

            // Validate JWT token structure and claims
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(result.AccessToken);

            // Verify token claims
            Assert.NotNull(jwtToken);
            Assert.Equal("test-issuer", jwtToken.Issuer);
            Assert.Contains("test-audience", jwtToken.Audiences);

            // Verify user claims exist
            var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email);
            Assert.NotNull(emailClaim);
            Assert.Equal("test@email.com", emailClaim.Value);

            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
            Assert.NotNull(userIdClaim);
            Assert.False(string.IsNullOrEmpty(userIdClaim.Value));

            // Verify token expiration is in the future
            Assert.True(jwtToken.ValidTo > DateTime.UtcNow);

            // Verify refresh token was saved to database
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "test@email.com");
            Assert.NotNull(user);
            Assert.Equal(result.RefreshToken, user.RefreshToken);
            Assert.NotNull(user.RefreshTokenExpiryTime);
            Assert.True(user.RefreshTokenExpiryTime > DateTime.UtcNow);
        }

        [Fact]
        public async Task SignIn_ShouldReturnNull_WhenPasswordIsIncorrect()
        {
            // Arrange
            var databaseName = "TestDb_SignIn_WrongPassword";
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;
            var authService = CreateAuthService(databaseName);

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "user@example.com",
                Password = "CorrectPass123!"
            });

            // Act
            var result = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = "user@example.com",
                Password = "WrongPass123!"
            });

            // Assert
            Assert.Null(result);
        }
        [Fact]
        public async Task RefreshTokens_ShouldReturnNewTokens_WhenTokensAreValid()
        {
            // Arrange
            var databaseName = "TestDb_RefreshTokens_Valid";
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;
            var authService = CreateAuthService(databaseName);

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

        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenRefreshTokenIsInvalid()
        {
            // Arrange
            var authService = CreateAuthService("TestDb_RefreshTokens_InvalidToken");

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

        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenAccessTokenIsInvalid()
        {
            // Arrange
            var authService = CreateAuthService("TestDb_RefreshTokens_InvalidAccessToken");

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

        [Fact]
        public async Task RefreshTokens_ShouldReturnNull_WhenRefreshTokenIsExpired()
        {
            // Arrange
            var databaseName = "TestDb_RefreshTokens_Expired";
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

            var authService = CreateAuthService(databaseName);

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

