using backend.Context;
using backend.DTOs;
using backend.DTOs.SharedCalendar;
using backend.Extensions;
using backend.Models;
using backend.Services;
using backend.Services.SharedCalendar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharedCalendarController(AppDbContext context, ISharedCalendarValidationService sharedCalendarValidation) : ControllerBase
    {
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateSharedCalendar(CreateSharedCalendarDTO request)
        {
            if (request.Accounts == null || request.Accounts.Count == 0)
            {
                return BadRequest("At least one account is required.");
            }

            var calendarExists = await context.Calendars.AnyAsync(c => c.Id == request.CalendarId);
            if (!calendarExists)
            {
                return NotFound("Calendar not found.");
            }

            var sharedCalendars = new List<SharedCalendar>();

            foreach (var item in request.Accounts)
            {
                if (!Guid.TryParse(item.ProfileId, out var profileId))
                {
                    return BadRequest($"Invalid ProfileId: {item.ProfileId}");
                }

                sharedCalendars.Add(new SharedCalendar
                {
                    ProfileId = profileId,
                    CalendarId = request.CalendarId,
                    Role = item.Role,
                });
            }

            context.SharedCalendars.AddRange(sharedCalendars);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateSharedCalendar(Guid id, UpdateSharedCalendarRoleDto request)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var sharedCalendar = await sharedCalendarValidation.FindSharedCalendar(profileId.Value, id);
            if (!sharedCalendar.Success)
            {
                return NotFound(sharedCalendar.Message);
            }

            sharedCalendar.Data!.Role = request.Role;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var validationResult = await sharedCalendarValidation.FindSharedCalendar(profileId.Value, id);
                if (!validationResult.Success)
                {
                    return NotFound(validationResult.Message);
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteSharedCalendar(Guid id)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var sharedCalendar = await context.SharedCalendars
                .FirstOrDefaultAsync(sc => sc.CalendarId == id && sc.ProfileId == profileId.Value);

            if (sharedCalendar == null)
            {
                return NotFound();
            }

            context.SharedCalendars.Remove(sharedCalendar);
            await context.SaveChangesAsync();

            return NoContent();
        }
        //[HttpGet]
        //[Authorize]
        //public async Task<ActionResult<IEnumerable<GetAllSharedCalendarDto>>> GetAllSharedCalendarsForUser()
        //{
        //    var profileId = this.GetProfileId();
        //    if (profileId == null)
        //    {
        //        return Unauthorized();
        //    }

        //    var sharedCalendars = await context.SharedCalendars
        //        .Where(x => x.ProfileId == profileId)
        //        .Select(x => new GetAllSharedCalendarDto
        //        {
        //            ProfileUsername = x.Profile!.Username,
        //            CalendarName = x.Calendar!.Name,
        //            Role = x.Role,
        //        }).ToListAsync();

        //    return Ok(sharedCalendars);
        //}

    }
}
