using backend.Context;
using backend.DTOs;
using backend.DTOs.Calendar;
using backend.Models.Enums;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Calendar
{
    public class CalendarValidationService(ICommonValidationService validationService, AppDbContext context) : ICalendarValidationService
    {
        public ServiceResponse<bool> ValidateCalendarCreationAsync(Models.Calendar calendarDTO)
        {
            return ValidateCommonCalendarRulesAsync(calendarDTO.Name);
        }
        public ServiceResponse<bool> ValidateCalendarCreationAsync(CreateCalendarDTO calendarDTO)
        {
            return ValidateCommonCalendarRulesAsync(calendarDTO.Name);
        }

        public async Task<ServiceResponse<Models.Calendar>> ValidateCalendarUpdateAsync(UpdateCalendarDTO calendarDTO)
        {
            var calendar = await validationService.EntityExists<Models.Calendar>(calendarDTO.Id);
            if (!calendar.Success)
            {
                return new ServiceResponse<Models.Calendar> { Success = false, Message = calendar.Message };
            }

            var validationResponse = ValidateCommonCalendarRulesAsync(calendarDTO.Name);

            return new ServiceResponse<Models.Calendar> { Success = validationResponse.Success, Message = validationResponse.Message, Data = calendar.Data };
        }

        private ServiceResponse<bool> ValidateCommonCalendarRulesAsync(string name)
        {
            var textValidation = validationService.ValidateText(name);
            if (!textValidation.Success)
            {
                return new ServiceResponse<bool> { Success = false, Message = textValidation.Message };
            }

            return new ServiceResponse<bool> { Success = true };
        }
        public async Task<bool> HasCalendarAccessAsync(Guid profileId, Guid calendarId)
        {
            var hasAccess = await context.Calendars.AnyAsync(x => x.ProfileId == profileId && x.Id == calendarId) || await context.SharedCalendars.AnyAsync(x => x.ProfileId == profileId && x.CalendarId == calendarId);

            if (!hasAccess)
            {
                return false;
            }

            return true;
        }

        public async Task<List<AccessibleCalendarDTO>> GetAccessibleCalendarsAsync(Guid profileId, IEnumerable<Guid> calendarIds)
        {
            var ownCalendars = await context.Calendars.Where(x => calendarIds.Contains(x.Id) && x.ProfileId == profileId).Select(x=>new AccessibleCalendarDTO { CalendarId = x.Id, Role = Role.Editor}).ToListAsync();
            var sharedCalendars = await context.SharedCalendars.Where(x => calendarIds.Contains(x.CalendarId) && x.ProfileId == profileId).Select(x => new AccessibleCalendarDTO { CalendarId = x.CalendarId, Role = x.Role }).ToListAsync();

            return [.. ownCalendars, .. sharedCalendars];
        }
    }
}
