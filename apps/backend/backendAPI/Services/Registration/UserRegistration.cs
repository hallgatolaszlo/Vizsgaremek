using System.Numerics;
using backend.Context;
using backend.DTOs;
using backend.DTOs.Auth;
using backend.Models;
using backend.Services.Auth;
using backend.Services.Calendar;
using backend.Services.Profile;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace backend.Services.Registration
{

    public class UserRegistration(AppDbContext context, IAuthService authService, IProfileValidationService profileValidationService, ICalendarValidationService cVservice) : IUserRegistration
    {
        public async Task<ServiceResponse<bool>> RegisterUserWithProfileAndCalendarAsync(SignUpRequestDTO request)
        {
            await using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                // Call the service to sign up
                ServiceResponse<Guid> user = await authService.SignUpAsync(request);

                if (user.Success == false)
                {
                    throw new Exception(user.Message);
                }

                var username = await GenerateRandomUniqueUsername(request.Email);

                var profile = new Models.Profile
                {
                    Username = username,
                    Avatar = "placeholder",
                    IsPrivate = false,
                    UserId = user.Data,
                };

                var profileValidationResponse = await profileValidationService.ValidateProfileCreationAsync(profile);
                if (!profileValidationResponse.Success)
                {
                    throw new Exception(profileValidationResponse.Message);
                }

                context.Profiles.Add(profile);
                await context.SaveChangesAsync();

                var calendar = new Models.Calendar
                {
                    Name = request.Email,
                    Color = 1,
                    ProfileId = profile.Id,
                };
                var validCalendar = cVservice.ValidateCalendarCreationAsync(calendar);
                if (!validCalendar.Success)
                {
                    throw new Exception(validCalendar.Message);
                }

                context.Calendars.Add(calendar);
                await context.SaveChangesAsync();

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

        public async Task<string> GenerateRandomUniqueUsername(string email)
        {
            var baseUsername = email.Split("@")[0];

            if (baseUsername.Length > 50)
            {
                baseUsername = baseUsername.Substring(0, 50);
            }

            var username = baseUsername;
            var notUnique = await profileValidationService.ValidateUniqueUsername(username);

            if (!notUnique)
            {
                return username;
            }

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqerstuvwxyz0123456789";
            var retries = 0;

            while (notUnique && retries < 20)
            {
                var suffix = new string(Random.Shared.GetItems(chars.AsSpan(), 4));

                username = $"{baseUsername}{suffix}";
                notUnique = await profileValidationService.ValidateUniqueUsername(username);
                retries++;
            }

            if (notUnique)
            {
                throw new InvalidOperationException($"Unable to generate unique username after 20 attempts.");
            }

            return username;
        }
    }
}