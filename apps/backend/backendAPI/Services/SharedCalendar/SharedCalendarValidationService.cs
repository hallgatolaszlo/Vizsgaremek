using backend.Context;
using backend.DTOs;
using backend.DTOs.SharedCalendar;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.SharedCalendar
{
    public class SharedCalendarValidationService(AppDbContext context) : ISharedCalendarValidationService
    {
        public async Task<ServiceResponse<bool>> SharedCalendarCreationAsync(Guid profileId, Guid calendarId)
        {
            var validationResult = await FindSharedCalendar(profileId, calendarId);
            if (validationResult.Success)
            {
                return new ServiceResponse<bool> { Success = false, Message = validationResult.Message };
            }

            return new ServiceResponse<bool> { Success = true };
        }

        public async Task<ServiceResponse<Models.SharedCalendar>> FindSharedCalendar(Guid profileId, Guid calendarId)
        {
            var sharedCalendar = await context.SharedCalendars
                .FirstOrDefaultAsync(sc => sc.CalendarId == calendarId && sc.ProfileId == profileId);

            if (sharedCalendar == null)
            {
                return new ServiceResponse<Models.SharedCalendar>
                {
                    Success = false,
                    Message = "Calendar not found"
                };
            }

            return new ServiceResponse<Models.SharedCalendar> { Success = true, Data = sharedCalendar };
        }

    }
}
