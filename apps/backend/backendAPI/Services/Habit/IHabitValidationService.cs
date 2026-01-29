using backend.DTOs;
using backend.DTOs.Habit;

namespace backend.Services.Habit
{
    public interface IHabitValidationService
    {
        ServiceResponse<bool> ValidateHabitCreationAsync(CreateHabitDto habitDto);
        Task<ServiceResponse<Models.Habit>> ValidateHabitUpdateAsync(UpdateHabitDto habitDto);
    }
}
