using backend.DTOs;
using backend.DTOs.CalendarEntry;

namespace backend.Services.CalendarEntry
{
    public interface ICalendarEntryValidationService
    {
        Task<ServiceResponse<bool>> ValidateCalendarEntryCreationAsync(CreateCalendarEntryDTO calendarEntryDTO, Guid createdBy);
        Task<ServiceResponse<Models.CalendarEntry>> ValidateAndGetCalendarEntryForUpdateAsync(UpdateCalendarEntryDTO calendarEntryDTO, Guid createdBy);
    }
}
