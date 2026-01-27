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

                var profile = new Models.Profile
                {
                    Username = request.Email,
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
    }
}
