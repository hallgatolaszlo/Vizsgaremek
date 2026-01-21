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
    public class CalendarEntryController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CalendarEntryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetCalendarEntryDTO>>> GetCalendarEntry(Guid calendarId)
        {
            var result = await _context.CalendarEntries
                .Where(x => x.CalendarId == calendarId)
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
            var cEntry = new CalendarEntry
            {
                EntryCategory = dto.EntryCategory,
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Location = dto.Location,
                NotificationTime = dto.NotificationTime,
                Color = dto.Color,
                CalendarId = dto.CalendarId,
                CreatedBy = dto.CreatedBy,
            };

            _context.CalendarEntries.Add(cEntry);
            await _context.SaveChangesAsync();
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

            var calendarEntry = await _context.CalendarEntries.FindAsync(id);
            if (calendarEntry == null)
            {
                return NotFound();
            }

            calendarEntry.EntryCategory = dto.EntryCategory;
            calendarEntry.Name = dto.Name;
            calendarEntry.Description = dto.Description;
            calendarEntry.StartDate = dto.StartDate;
            calendarEntry.EndDate = dto.EndDate;
            calendarEntry.Location = dto.Location;
            calendarEntry.NotificationTime = dto.NotificationTime;
            calendarEntry.Color = dto.Color;
            calendarEntry.IsCompleted = dto.IsCompleted;
            calendarEntry.CreatedBy = dto.CreatedBy;

            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteCalendarEntry(Guid id)
        {
            var calendarEntry = await _context.CalendarEntries.FindAsync(id);
            if (calendarEntry == null)
            {
                return NotFound();
            }
            _context.CalendarEntries.Remove(calendarEntry);
            await _context.SaveChangesAsync();
            return NoContent();

        }
    }
}
