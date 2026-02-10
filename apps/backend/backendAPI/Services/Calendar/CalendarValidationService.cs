using backend.Common;
using backend.Context;
using backend.DTOs;
using backend.DTOs.Calendar;
using backend.Models.Enums;
using backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Calendar
{
    public class CalendarValidationService(ICommonValidationService validationService, AppDbContext context) : ICalendarValidationService
    {
        //
        public ServiceResponse<bool> ValidateCalendarCreation(Models.Calendar calendarDTO)
        {
            return ValidateCommonCalendarRules(calendarDTO.Name);
        }
        public ServiceResponse<bool> ValidateCalendarCreation(CreateCalendarDTO calendarDTO)
        {
            return ValidateCommonCalendarRules(calendarDTO.Name);
        }

        //
        public async Task<ServiceResponse<Models.Calendar>> ValidateAndGetCalendarForUpdateAsync(Guid createdBy, UpdateCalendarDTO calendarDTO)
        {
            var calendar = await validationService.EntityExists<Models.Calendar>(calendarDTO.Id);
            if (!calendar.Success)
            {
                return new ServiceResponse<Models.Calendar> { Success = false, Message = calendar.Message };
            }

            var validateUserRole = await ValidateCalendarEditingPermissionAsync(createdBy, calendarDTO.Id);
            if (!validateUserRole.Success) 
            {
                return new ServiceResponse<Models.Calendar> { Success = false, Message = validateUserRole.Message };
            }

            var validationResult = ValidateCommonCalendarRules(calendarDTO.Name);

            return new ServiceResponse<Models.Calendar> { Success = validationResult.Success, Message = validationResult.Message, Data = calendar.Data };
        }

        //
        private ServiceResponse<bool> ValidateCommonCalendarRules(string name)
        {
            var textValidation = validationService.ValidateText(name);
            if (!textValidation.Success)
            {
                return new ServiceResponse<bool> { Success = false, Message = textValidation.Message };
            }

            return new ServiceResponse<bool> { Success = true };
        }
        public async Task<ServiceResponse<bool>> ValidateCalendarEditingPermissionAsync(Guid createdBy, Guid calendarId)
        {
            var isOwner = await context.Calendars.AnyAsync(x => x.Id == calendarId && x.ProfileId == createdBy);
            if (isOwner)
            {
                return new ServiceResponse<bool> { Success = true };
            }

            var userRole = await context.SharedCalendars.Where(x => x.CalendarId == calendarId && x.ProfileId == createdBy).Select(x => x.Role).FirstOrDefaultAsync();

            if (userRole == Role.Viewer)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = CommonErrors.ImATeapot
                };
            }

            return new ServiceResponse<bool> { Success = true };
        }

        //
        public async Task<bool> HasCalendarAccessAsync(Guid profileId, Guid calendarId)
        {
            var hasAccess = await context.Calendars.AnyAsync(x => x.ProfileId == profileId && x.Id == calendarId) || await context.SharedCalendars.AnyAsync(x => x.ProfileId == profileId && x.CalendarId == calendarId);

            if (!hasAccess)
            {
                return false;
            }

            return true;
        }

        //
        public async Task<List<AccessibleCalendarDTO>> GetAccessibleCalendarsAsync(Guid profileId, IEnumerable<Guid> calendarIds)
        {
            var ownCalendars = await context.Calendars.Where(x => calendarIds.Contains(x.Id) && x.ProfileId == profileId).Select(x=>new AccessibleCalendarDTO { CalendarId = x.Id, Role = Role.Editor}).ToListAsync();
            var sharedCalendars = await context.SharedCalendars.Where(x => calendarIds.Contains(x.CalendarId) && x.ProfileId == profileId).Select(x => new AccessibleCalendarDTO { CalendarId = x.CalendarId, Role = x.Role }).ToListAsync();

            return [.. ownCalendars, .. sharedCalendars];
        }

        //
        public async Task<ServiceResponse<Models.Calendar>> ValidateAndGetCalendarForDeletionAsync(Guid createdBy, Guid calendarId)
        {
            var calendar = await context.Calendars.FindAsync(calendarId);
            if (calendar == null)
            {
                return new ServiceResponse<Models.Calendar>
                {
                    Success = false,
                    Message = "Calendar not found",
                };
            }

            var validateUser = await ValidateCalendarEditingPermissionAsync(createdBy, calendarId);
            if (!validateUser.Success)
            {
                return new ServiceResponse<Models.Calendar> { Success = false, Message = validateUser.Message };
            }

            return new ServiceResponse<Models.Calendar> { Success = true, Data = calendar};
        }
    }
}
