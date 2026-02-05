using backend.DTOs;

namespace backend.Services.SharedCalendar
{
    public interface ISharedCalendarValidationService
    {
        Task<ServiceResponse<bool>> SharedCalendarCreationAsync(Guid profileId, Guid calendarId);
        Task<ServiceResponse<Models.SharedCalendar>> FindSharedCalendar(Guid profileId, Guid calendarId);
    }
}
