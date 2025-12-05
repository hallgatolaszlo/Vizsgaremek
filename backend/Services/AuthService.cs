using backend.Context;
using backend.DTOs.Auth;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace backend.Services
{
    public class AuthService(AppDbContext context, IConfiguration configuration) : IAuthService
    {
        public async Task<string?> SignUpAsync(SignUpRequestDTO request)
        {
            // Validate email
            if (!IsValidEmail(request.Email))
            {
                return "Invalid email format.";
            }

            // Validate password
            if (!IsValidPassword(request.Password))
            {
                return "Password must be between 8 and 128 characters long and include uppercase, lowercase, digit, and special character.";
            }

            // Check if user with the same email already exists
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return "User with this email already exists.";
            }

            User user = new User();

            user.Email = request.Email;

            string? hashedPassword = new PasswordHasher<User>().HashPassword(user, request.Password);
            user.PasswordHash = hashedPassword!;

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return null;
        }

        public async Task<TokenResponseDTO?> SignInAsync(SignInRequestDTO request)
        {
            User? user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // User not found
            if (user is null)
            {
                return null;
            }

            // Verify password
            PasswordVerificationResult passwordVerificationResult = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return null;
            }

            TokenResponseDTO tokenDTO = new TokenResponseDTO
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };

            return tokenDTO;
        }

        public async Task<TokenResponseDTO?> RefreshTokensAsync(TokenResponseDTO request)
        {
            string accessToken = request.AccessToken;
            string refreshToken = request.RefreshToken;

            string? userIdFromToken = GetUserIdFromExpiredToken(accessToken);

            // Invalid access token
            if (userIdFromToken is null)
            {
                return null;
            }

            User? user = await ValidateRefreshTokenAsync(refreshToken, userIdFromToken);

            // Invalid refresh token
            if (user is null)
            {
                return null;
            }

            TokenResponseDTO tokenDTO = new TokenResponseDTO
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };
            return tokenDTO;
        }

        // Validate refresh token using an expired access token
        private async Task<User?> ValidateRefreshTokenAsync(string refreshToken, string userId)
        {
            User? user = await context.Users.FirstOrDefaultAsync(u =>
                u.RefreshToken == refreshToken &&
                u.Id.ToString() == userId);

            if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }

            return user;
        }

        // Extract user ID from an expired access token
        private string? GetUserIdFromExpiredToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!);

                // KEY: ValidateLifetime is false to get claims from expired token
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = configuration.GetValue<string>("AppSettings:Issuer"),
                    ValidateAudience = true,
                    ValidAudience = configuration.GetValue<string>("AppSettings:Audience"),
                    ValidateLifetime = false
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                return jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
            }
            catch
            {
                return null;
            }
        }

        // Generate a secure random refresh token
        private string GenerateRefreshToken()
        {
            byte[] randomNumber = new byte[32];
            using (RandomNumberGenerator? rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        // Generate and save refresh token to the database
        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            string refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            context.Users.Update(user);
            await context.SaveChangesAsync();
            return refreshToken;
        }

        // Create JWT access token
        private string CreateToken(User user)
        {
            // Define claims
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Create signing credentials
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("jwt-secret-key")!));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Create the token
            JwtSecurityToken tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                signingCredentials: creds,
                expires: DateTime.UtcNow.AddMinutes(30)
                );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        // Validate email format
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        // Validate password strength
        private bool IsValidPassword(string password)
        {
            // Password must be at least 8 characters long and no more than 128 characters
            if (string.IsNullOrEmpty(password) || password.Length < 8 || password.Length > 128)
            {
                return false;
            }

            // Password must contain at least one uppercase letter
            if (!Regex.IsMatch(password, @"[A-Z]"))
            {
                return false;
            }

            // Password must contain at least one lowercase letter
            if (!Regex.IsMatch(password, @"[a-z]"))
            {
                return false;
            }

            // Password must contain at least one digit
            if (!Regex.IsMatch(password, @"[0-9]"))
            {
                return false;
            }

            // Password must contain at least one special character
            if (!Regex.IsMatch(password, @"[!@#$%^&*()_+\-=\[\]{};':"",.<>?/\\|`~]"))
            {
                return false;
            }

            return true;
        }
    }
}