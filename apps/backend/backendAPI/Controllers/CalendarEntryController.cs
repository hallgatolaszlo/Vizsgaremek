using backend.Context;
using backend.DTOs.CalendarEntry;
using backend.Extensions;
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarEntryController(AppDbContext context) : ControllerBase
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
            if (dto == null)
            {
                return BadRequest();
            }
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
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
                CalendarId = dto.CalendarId,
                CreatedBy = profileId.Value,
            };

            context.CalendarEntries.Add(cEntry);
            await context.SaveChangesAsync();
            return Ok();
        }


        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateCalendarEntry(Guid id, [FromBody] UpdateCalendarEntryDTO dto)
        {
            if (dto == null)
            {
                return BadRequest();
            }

            var calendarEntry = await context.CalendarEntries.FindAsync(id);
            if (calendarEntry == null)
            {
                return NotFound();
            }

            calendarEntry.EntryCategory = dto.EntryCategory;
            calendarEntry.Name = dto.Name!;
            calendarEntry.Description = dto.Description;
            calendarEntry.StartDate = dto.StartDate;
            calendarEntry.EndDate = dto.EndDate;
            calendarEntry.Location = dto.Location;
            calendarEntry.NotificationTime = dto.NotificationTime;
            calendarEntry.Color = dto.Color;
            calendarEntry.IsCompleted = dto.IsCompleted;
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
