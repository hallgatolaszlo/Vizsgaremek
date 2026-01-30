using backend.DTOs;
using backend.DTOs.CalendarEntry;

namespace backend.Services.CalendarEntry
{
    public interface ICalendarEntryValidationService
    {
        Task<ServiceResponse<bool>> ValidateCalendarEntryCreateAsync(CreateCalendarEntryDTO calendarEntryDTO, Guid createdBy);
        Task<ServiceResponse<Models.CalendarEntry>> ValidateCalendarEntryUpdateAsync(UpdateCalendarEntryDTO calendarEntryDTO, Guid createdBy);
        Task<ServiceResponse<bool>> validateCalendarRole(Guid createdBy, Guid calendarId);
    }
}
