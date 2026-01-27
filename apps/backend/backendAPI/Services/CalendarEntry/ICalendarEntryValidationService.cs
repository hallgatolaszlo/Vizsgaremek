using backend.DTOs;
using backend.DTOs.CalendarEntry;

namespace backend.Services.CalendarEntry
{
    public interface ICalendarEntryValidationService
    {
        Task<ServiceResponse<bool>> ValidateCalendarEntryCreateAsync(CreateCalendarEntryDTO calendarEntryDTO);
        Task<ServiceResponse<Models.CalendarEntry>> ValidateCalendarEntryUpdateAsync(UpdateCalendarEntryDTO calendarEntryDTO);
    }
}
