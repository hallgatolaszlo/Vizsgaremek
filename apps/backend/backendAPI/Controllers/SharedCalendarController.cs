using backend.Context;
using backend.DTOs.SharedCalendar;
using backend.Extensions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharedCalendarController(AppDbContext context) : ControllerBase
    {
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateSharedCalendar(CreateSharedCalendarDTO request)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var sharedCalendar = new SharedCalendar
            {
                ProfileId = profileId.Value,
                CalendarId = request.CalendarId,
                Role = request.Role,
            };

            context.SharedCalendars.Add(sharedCalendar);
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

            var sharedCalendar = await context.SharedCalendars
                .FirstOrDefaultAsync(sc => sc.CalendarId == id && sc.ProfileId == profileId.Value);

            if (sharedCalendar == null)
            {
                return NotFound();
            }

            sharedCalendar.Role = request.Role;

            await context.SaveChangesAsync();

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
