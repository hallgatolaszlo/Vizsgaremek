using backend.DTOs;
using backend.DTOs.Calendar;
using backend.Services;

namespace backend.Services.Calendar
{
    public class CalendarValidationService(ICommonValidationService validationService) : ICalendarValidationService
    {
        public ServiceResponse<bool> ValidateCalendarCreationAsync(Models.Calendar calendarDTO)
        {
            return ValidateCommonCalendarRulesAsync(calendarDTO.Name);
        }
        public ServiceResponse<bool> ValidateCalendarCreationAsync(CreateCalendarDTO calendarDTO)
        { 
            return ValidateCommonCalendarRulesAsync(calendarDTO.Name);
        }

        public async Task<ServiceResponse<Models.Calendar>> ValidateCalendarUpdateAsync(UpdateCalendarDTO calendarDTO) 
        {
            var calendar = await validationService.EntityExists<Models.Calendar>(calendarDTO.Id);
            if (!calendar.Success)
            {
                return new ServiceResponse<Models.Calendar> { Success = false, Message = calendar.Message };
            }

            var validationResponse = ValidateCommonCalendarRulesAsync(calendarDTO.Name);

            return new ServiceResponse<Models.Calendar> { Success = validationResponse.Success, Message = validationResponse.Message, Data = calendar.Data };
        }

        private ServiceResponse<bool> ValidateCommonCalendarRulesAsync(string name)
        {
            var textValidation = validationService.ValidateText(name);
            if (!textValidation.Success)
            {
                return new ServiceResponse<bool> { Success = false, Message = textValidation.Message };
            }

            return new ServiceResponse<bool> { Success = true };
        }
    }
}
