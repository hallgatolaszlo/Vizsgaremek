using backend.Context;
using backend.DTOs.Calendar;
using backend.Extensions;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    }
}
