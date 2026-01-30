using backend.DTOs;
using backend.DTOs.Calendar;
using backend.DTOs.CalendarEntry;
using backend.DTOs.Profile;

namespace backend.Services.Calendar
{
    public interface ICalendarValidationService
    {
        ServiceResponse<bool> ValidateCalendarCreationAsync(Models.Calendar calendarDTO);
        ServiceResponse<bool> ValidateCalendarCreationAsync(CreateCalendarDTO calendarDTO);
        Task<ServiceResponse<Models.Calendar>> ValidateCalendarUpdateAsync(UpdateCalendarDTO calendarDTO);
        Task<bool> HasCalendarAccessAsync(Guid profileId, Guid calendarId);
        Task<List<AccessibleCalendarDTO>> GetAccessibleCalendarsAsync(Guid profileId, IEnumerable<Guid> calendarIds);
    }
}
