using backend.Context;
using backend.DTOs.Calendar;
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
        public async Task<ActionResult> CreateSharedCalendar(CreateSharedCalendarDto request)
        {
            var sharedCalendar = new SharedCalendar
            {
                ProfileId = request.ProfileId,
                CalendarId = request.CalendarId,
                Role = request.Role,
            };

            context.SharedCalendars.Add(sharedCalendar);
            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
