using backend.DTOs;
using backend.DTOs.Habit;

namespace backend.Services.Habit
{
    public class IHabitValidationService
    {
        ServiceResponse<bool> ValidateHabitCreationAsync(Models.Habit habit);
        ServiceResponse<bool> ValidateHabitCreationAsync(CreateHabitDto habitDto);
        ServiceResponse<Models.Habit> ValidateHabitUpdateAsync(CreateHabitDto habitDto);
    }
}
