using backend.DTOs;
using backend.DTOs.Calendar;
using backend.DTOs.CalendarEntry;
using backend.DTOs.Profile;

namespace backend.Services.Calendar
{
    public interface ICalendarValidationService
    {
        ServiceResponse<bool> ValidateCalendarCreation(Models.Calendar calendarDTO);
        ServiceResponse<bool> ValidateCalendarCreation(CreateCalendarDTO calendarDTO);
        Task<ServiceResponse<Models.Calendar>> ValidateAndGetCalendarForUpdateAsync(Guid createdBy, UpdateCalendarDTO calendarDTO);
        Task<bool> HasCalendarAccessAsync(Guid profileId, Guid calendarId);
        Task<List<AccessibleCalendarDTO>> GetAccessibleCalendarsAsync(Guid profileId, IEnumerable<Guid> calendarIds);
        Task<ServiceResponse<bool>> ValidateCalendarRoleAsync(Guid createdBy, Guid calendarId);
        Task<ServiceResponse<Models.Calendar>> ValidateAndGetCalendarForDeletionAsync(Guid createdBy, Guid calendarId);
    }
}
