using backend.DTOs;
using backend.DTOs.CalendarEntry;

namespace backend.Services.CalendarEntry
{
    public interface ICalendarEntryValidationService
    {
        Task<ServiceResponse<bool>> ValidateCalendarEntryMutationAsync(CreateCalendarEntryDTO calendarEntryDTO);
        Task<ServiceResponse<bool>> ValidateCalendarEntryMutationAsync(UpdateCalendarEntryDTO calendarEntryDTO);
    }
}
