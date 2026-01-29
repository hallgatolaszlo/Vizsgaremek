using backend.DTOs;
using backend.DTOs.Habit;

namespace backend.Services.Habit
{
    public class HabitValidationService(ICommonValidationService validationService) : IHabitValidationService
    {
        public ServiceResponse<bool> ValidateHabitCreationAsync(CreateHabitDto habitDto)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResponse<Models.Habit>> ValidateHabitUpdateAsync(UpdateHabitDto habitDto)
        {
            var habit = await validationService.EntityExists<Models.Habit>(habitDto.Id);
            if (!habit.Success)
            {
                return new ServiceResponse<Models.Habit> { Success = false, Message = habit.Message };
            }

            var validationResponse = ValidateCommonCalendarRulesAsync(habitDto.Name);
            if (!validationResponse.Success)
            {
                return new ServiceResponse<Models.Habit> { Success = false, Message = validationResponse.Message };
            }

            return new ServiceResponse<Models.Habit> { Success = true, Data = habit.Data };
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
