using backend.Context;
using backend.DTOs;
using backend.DTOs.CalendarEntry;
using backend.Extensions;
using backend.Models;
using backend.Services;
using backend.Services.CalendarEntry;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarEntryController(AppDbContext context, ICalendarEntryValidationService calendarEntryValidation) : ControllerBase
    {

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetCalendarEntryDTO>>> GetCalendarEntry(Guid id, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = context.CalendarEntries.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(x => x.StartDate >= startDate);
            }

            if (endDate.HasValue)
            {
                query = query.Where(x => x.EndDate <= endDate);
            }

            var result = await query
                .Where(x => x.CalendarId == id)
                .Select(x => new GetCalendarEntryDTO
                {
                    Id = x.Id,
                    EntryCategory = x.EntryCategory,
                    Name = x.Name,
                    Description = x.Description,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Location = x.Location,
                    NotificationTime = x.NotificationTime,
                    Color = x.Color,
                    IsCompleted = x.IsCompleted,
                    IsAllDay = x.IsAllDay,
                    CalendarId = x.CalendarId,
                    CreatedBy = x.CreatedBy
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateCalendarEntry([FromBody] CreateCalendarEntryDTO dto)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }
            var validationResponse = await calendarEntryValidation.ValidateCalendarEntryCreateAsync(dto);
            if (!validationResponse.Success)
            {
                return BadRequest(validationResponse.Message);
            }

            var cEntry = new CalendarEntry
            {
                EntryCategory = dto.EntryCategory,
                Name = dto.Name!,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Location = dto.Location,
                NotificationTime = dto.NotificationTime,
                Color = dto.Color,
                IsAllDay = dto.IsAllDay ?? true,
                CalendarId = dto.CalendarId,
                CreatedBy = profileId.Value,
            };

            context.CalendarEntries.Add(cEntry);
            await context.SaveChangesAsync();
            return Ok();
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCalendarEntry(Guid id, [FromBody] UpdateCalendarEntryDTO dto)
        {
            var validationResponse = await calendarEntryValidation.ValidateCalendarEntryUpdateAsync(dto);
            if (!validationResponse.Success)
            {
                return BadRequest(validationResponse.Message);
            }

            var calendarEntry = validationResponse.Data!;

            calendarEntry.EntryCategory = dto.EntryCategory;
            calendarEntry.Name = dto.Name!;
            calendarEntry.Description = dto.Description;
            calendarEntry.StartDate = dto.StartDate;
            calendarEntry.EndDate = dto.EndDate;
            calendarEntry.Location = dto.Location;
            calendarEntry.NotificationTime = dto.NotificationTime;
            calendarEntry.Color = dto.Color;
            calendarEntry.IsCompleted = dto.IsCompleted;
            calendarEntry.IsAllDay = dto.IsAllDay ?? true;
            calendarEntry.CreatedBy = dto.CreatedBy;

            await context.SaveChangesAsync();
            return Ok();
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteCalendarEntry(Guid id)
        {
            var calendarEntry = await context.CalendarEntries.FindAsync(id);
            if (calendarEntry == null)
            {
                return NotFound();
            }
            context.CalendarEntries.Remove(calendarEntry);
            await context.SaveChangesAsync();
            return NoContent();

        }
    }
}
