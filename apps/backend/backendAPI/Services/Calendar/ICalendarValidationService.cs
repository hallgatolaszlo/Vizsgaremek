using backend.DTOs;
using backend.DTOs.Calendar;
using backend.DTOs.CalendarEntry;
using backend.DTOs.Profile;

namespace backend.Services.Calendar
{
    public interface ICalendarValidationService
    {
        ServiceResponse<bool> ValidateCalendarCreationAsync(Models.Calendar calendarDTO);
        //Task<ServiceResponse<bool>> ValidateCalendarUpdateAsync(UpdateCalendarDTO updateCalendarDTO);
    }
}
