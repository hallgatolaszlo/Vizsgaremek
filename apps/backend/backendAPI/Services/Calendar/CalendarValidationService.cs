using backend.DTOs;
using backend.DTOs.Calendar;
using backend.Services;

namespace backend.Services.Calendar
{
    public class CalendarValidationService(ICommonValidationService validationService) : ICalendarValidationService
    {
        public ServiceResponse<bool> ValidateCalendarCreationAsync(Models.Calendar calendarDTO)
        {
            if (calendarDTO.Name is null)
            {
                return new ServiceResponse<bool> { Success = false, Message = "Calendar name is required." };
            }

            var textValidation = validationService.ValidateText(calendarDTO.Name);
            if (!textValidation.Success)
            {
                return new ServiceResponse<bool> { Success = false, Message = textValidation.Message };
            }

            return new ServiceResponse<bool> { Data = true, Success = true };
        }

    }
}
