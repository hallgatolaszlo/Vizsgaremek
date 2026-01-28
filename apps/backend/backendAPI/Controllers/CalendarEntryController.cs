using System.Drawing;
using backend.Common;
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
    public class CalendarEntryController(AppDbContext context, ICalendarEntryValidationService calendarEntryValidation, ICommonValidationService commonValidation) : ControllerBase
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

        [HttpPost("query")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetCalendarEntryDTO>>> GetCalendarEntries(GetCalendarEntriesRequestDTO request) 
        {
            var guidList = request.Ids.Select(Guid.Parse).ToList();

            if(guidList.Count == 0)
            {
                return Ok(Enumerable.Empty<GetCalendarEntryDTO>());
            }

            var query = context.CalendarEntries.AsQueryable();

            if (request.StartDate.HasValue)
            {
                query = query.Where(x => x.StartDate >= request.StartDate);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(x => x.EndDate <= request.EndDate);
            }

            var result = await query
                .Where(x => guidList.Contains(x.CalendarId))
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

            var calendarColor = await context.Calendars.Where(x=>x.Id==dto.CalendarId).Select(x=>x.Color).FirstOrDefaultAsync();

            var cEntry = new CalendarEntry
            {
                EntryCategory = dto.EntryCategory,
                Name = dto.Name!,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Location = dto.Location,
                NotificationTime = dto.NotificationTime,
                Color = dto.Color ?? calendarColor,
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

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var commonValidationResponse = await commonValidation.EntityExists<CalendarEntry>(id);
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


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteCalendarEntry(Guid id)
        {
            var profileId = this.GetProfileId();

            var calendarEntry = await context.CalendarEntries.FindAsync(id);
            if (calendarEntry == null)
            {
                return NotFound("Entry not found");
            }

            var validUser = await calendarEntryValidation.validateCalendarRole(profileId!.Value, id);
            if (!validUser.Success)
            {
                return Forbid(CommonErrors.ImATeapot);
            }

            context.CalendarEntries.Remove(calendarEntry);
            await context.SaveChangesAsync();
            return NoContent();

        }
    }
}
