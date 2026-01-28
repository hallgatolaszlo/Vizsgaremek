using backend.Context;
using backend.DTOs.Habit;
using backend.Extensions;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabitController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<GetHabitsDto>> GetAllHabitsForUser()
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var habits = await context.Habits
                .Where(h => h.ProfileId == profileId)
                .Select(x => new GetHabitsDto
                {
                    ProfileUsername = x.Profile!.Username,
                    Name = x.Name,
                    Description = x.Description,
                    HabitCategory = x.HabitCategory,
                    Unit = x.Unit,
                    Goal = x.Goal,
                    Days = x.Days,
                    Color = x.Color
                })
                .ToListAsync();

            return Ok(habits);
        }

        [HttpGet("{habitId}")]
        [Authorize]
        public async Task<ActionResult<GetHabitsDto>> GetHabitByHabitIdForUser(Guid habitId)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var habit = await context.Habits
                .Where(x => x.Id == habitId && x.ProfileId == profileId)
                .Select(x => new GetHabitsDto
                {
                    ProfileUsername = x.Profile!.Username,
                    Name = x.Name,
                    Description = x.Description,
                    HabitCategory = x.HabitCategory,
                    Unit = x.Unit,
                    Goal = x.Goal,
                    Days = x.Days,
                    Color = x.Color
                })
                .FirstOrDefaultAsync();

            return Ok(habit);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CreateHabitDto>> CreateHabit([FromBody] CreateHabitDto dto)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            Habit habit = new Habit
            {
                Name = dto.Name,
                Description = dto.Description,
                HabitCategory = dto.Habitcategory,
                Unit = dto.Unit,
                Goal = dto.Goal,
                Color = dto.Color,
                Days = dto.Days,
                ProfileId = profileId.Value
            };

            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{habitId}")]
        [Authorize]
        public async Task<ActionResult> DeleteHabit(Guid habitId)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }


            var habit = context.Habits.FirstOrDefault(h => h.Id == habitId);
            if (habit == null)
            {
                return NotFound("Habit not found");
            }


            var habitLog = await context.HabitLogs.Where(h => h.HabitId == habit.Id).ToListAsync();
            if (habitLog.Any())
            {
                context.HabitLogs.RemoveRange(habitLog);
            }

            context.Habits.Remove(habit);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
