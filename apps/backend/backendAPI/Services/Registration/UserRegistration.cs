using System.Numerics;
using backend.Context;
using backend.DTOs;
using backend.DTOs.Auth;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace backend.Services.Registration
{
    public class UserRegistration : IUserRegistration
    {
        private readonly AppDbContext _context;
        private readonly IAuthService _authService;
        public UserRegistration(AppDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        public async Task<ServiceResponse<bool>> RegisterUserWithProfileAndCalendarAsync(SignUpRequestDTO request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Call the service to sign up
                ServiceResponse<bool> error = await _authService.SignUpAsync(request);

                // Validate response
                if (error.Success == false)
                {
                    throw new Exception(error.Message);
                }

                // Create new user
                User user = new User();
                user.Email = request.Email;

                // Hash password
                string? hashedPassword = new PasswordHasher<User>().HashPassword(user, request.Password);
                user.PasswordHash = hashedPassword!;

                // Save user to database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var profile = new Profile
                {
                    Username = request.Email,
                    Avatar = "placeholder",
                    IsPrivate = false,
                    UserId = user.Id,
                };

                _context.Profiles.Add(profile);
                await _context.SaveChangesAsync();

                var calendar = new Calendar
                {
                    Name = request.Email,
                    Color = 1,
                    ProfileId = profile.Id,
                };

                _context.Calendars.Add(calendar);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = ex.Message,
                };
            }
        }
    }
}
