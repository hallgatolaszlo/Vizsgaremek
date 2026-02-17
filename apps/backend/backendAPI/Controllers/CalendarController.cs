using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Common;
using backend.Context;
using backend.DTOs.Auth;
using backend.DTOs.Calendar;
using backend.Extensions;
using backend.Models;
using backend.Services;
using backend.Services.Calendar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController(AppDbContext context, ICalendarValidationService calendarValidation, ICommonValidationService commonValidation) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetCalendarDTO>>> GetAllCalendarsForUser()
        {
            var profileId = this.GetProfileId();
            if (profileId == null) 
            {
                return Unauthorized();
            }

            var calendars = await context.Calendars
                .Where(x => x.ProfileId == profileId)
                .Select(x => new GetCalendarDTO
                    {
                        Id = x.Id,
                        Color = x.Color,
                        Name = x.Name,
                    })
                .Union(context.SharedCalendars
                    .Where(x => x.ProfileId == profileId)
                    .Select(x => new GetCalendarDTO
                        {
                            Id = x.CalendarId,
                            Name = x.Calendar!.Name,
                            Color = x.Calendar!.Color,
                        }))
                .ToListAsync();

            return Ok(calendars);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateCalendar(CreateCalendarDTO request)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var validationResult = calendarValidation.ValidateCalendarCreation(request);
            if (!validationResult.Success)
            {
                return BadRequest(validationResult.Message);
            }

            var calendar = new Calendar
            {
                Name = request.Name,
                Color = request.Color,
                ProfileId = profileId.Value,
            };

            context.Calendars.Add(calendar);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{calendarId}")]
        [Authorize]
        public async Task<ActionResult> UpdateCalendar(Guid calendarId, UpdateCalendarDTO request)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            if (calendarId != request.Id)
            {
                return BadRequest(CommonErrors.InvalidRoute);
            }

            var calendarResult = await calendarValidation.ValidateAndGetCalendarForUpdateAsync(profileId.Value, request);
            if (!calendarResult.Success)
            {
                return BadRequest(calendarResult.Message);
            }

            var calendar = calendarResult.Data!;

            calendar.Name = request.Name;
            calendar.Color = request.Color;

            context.Entry(calendar).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var commonValidationResponse = await commonValidation.EntityExists<Profile>(calendarId);
                if (!commonValidationResponse.Success)
                {
                    return NotFound(commonValidationResponse.Message);
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        [HttpDelete("{calendarId}")]
        [Authorize]
        public async Task<ActionResult> DeleteCalendar(Guid calendarId)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var calendarResult = await calendarValidation.ValidateAndGetCalendarForDeletionAsync(profileId.Value, calendarId);
            if (!calendarResult.Success)
            {
                return BadRequest(calendarResult.Message);
            }

            var entries = await context.CalendarEntries.Where(x => x.CalendarId == calendarId).ToListAsync();
            if (entries.Any())
            {
                context.CalendarEntries.RemoveRange(entries);
            }

            var sharedCalendars = await context.SharedCalendars.Where(x => x.CalendarId == calendarId).ToListAsync();
            if (sharedCalendars.Any())
            {
                context.SharedCalendars.RemoveRange(sharedCalendars);
            }

            context.Calendars.Remove(calendarResult.Data!);
            await context.SaveChangesAsync();

            return NoContent();
        }

    }
}