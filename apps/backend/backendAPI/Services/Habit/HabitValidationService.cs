using backend.DTOs;
using backend.DTOs.Habit;

namespace backend.Services.Habit
{
    public class HabitValidationService(ICommonValidationService validationService) : IHabitValidationService
    {
        public async Task<ServiceResponse<Models.Habit>> ValidateHabitUpdateAsync(UpdateHabitDto habitDto)
        {
            var habitExists = await validationService.EntityExists<Models.Habit>(habitDto.Id);
            if (!habitExists.Success)
            {
                return new ServiceResponse<Models.Habit> { Success = false, Message = habitExists.Message };
            }


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
