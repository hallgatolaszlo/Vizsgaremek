using backend.Context;
using backend.DTOs.Auth;
using backendTests.TestHelpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backendTests.Auth
{
    public class SignInTests
    {
        // 1.
        [Theory]
        [InlineData("nonexistent@example.com", "AnyPass123!")]
        [InlineData("user@example.com", "WrongPass123!")]
        public async Task SignIn_ShouldReturnNull_WhenCredsAreInvalid(string email, string password)
        {
            var authService = AuthServiceFactory.Create(Guid.NewGuid().ToString());

            await authService.SignUpAsync(new SignUpRequestDTO
            {
                Email = "user@example.com",
                Password = "CorrectPass123!"
            });

            var result = await authService.SignInAsync(new SignInRequestDTO
            {
                Email = email,
                Password = password
            });

            Assert.Null(result);
        }

        // 2.
        [Fact]
        public async Task SignIn_ShouldReturnValidTokens_WhenCredsAreValid()
        {
            // Arrange
            string databaseName = Guid.NewGuid().ToString();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;
            using var context = new AppDbContext(options);
            var authService = AuthServiceFactory.Create(databaseName);

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
            Assert.False(string.IsNullOrEmpty(result.AccessToken));
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
    }
}
