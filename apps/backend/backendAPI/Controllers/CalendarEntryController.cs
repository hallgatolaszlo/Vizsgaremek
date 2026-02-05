using System.Drawing;
using backend.Common;
using backend.Context;
using backend.DTOs;
using backend.DTOs.CalendarEntry;
using backend.Extensions;
using backend.Models;
using backend.Services;
using backend.Services.Calendar;
using backend.Services.CalendarEntry;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarEntryController(AppDbContext context, ICalendarEntryValidationService calendarEntryValidation, ICommonValidationService commonValidation, ICalendarValidationService calendarValidation) : ControllerBase
    {

        [HttpGet("{calendarId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetCalendarEntryDTO>>> GetCalendarEntry(Guid calendarId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var profileId = this.GetProfileId();
            if (profileId == null) 
            {
                return Unauthorized();
            }

            if (!await calendarValidation.HasCalendarAccessAsync(profileId.Value, calendarId))
            {
                return Forbid();
            }

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
                    Color = x.Color ?? x.Calendar!.Color,
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
            var profileId = this.GetProfileId();
            if(profileId == null)
            {
                return Unauthorized();
            }
            
            var calendarGuidList = request.Ids.Select(Guid.Parse).ToList();

            var accessibleCalendars = await calendarValidation.GetAccessibleCalendarsAsync(profileId.Value, calendarGuidList);
            if (accessibleCalendars.Count == 0)
            {
                return Ok(Enumerable.Empty<GetCalendarEntryDTO>());
            }

            var accessibleCalendarIds = accessibleCalendars.Select(x=>x.CalendarId).ToList();

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
                .Where(x => accessibleCalendarIds.Contains(x.CalendarId))
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
                    Color = x.Color ?? x.Calendar!.Color,
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

            var validationResult = await calendarEntryValidation.ValidateCalendarEntryCreationAsync(dto, profileId.Value);
            if (!validationResult.Success)
            {
                return BadRequest(validationResult.Message);
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
                Color = dto.Color ?? null,
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
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var calendarEntryResult = await calendarEntryValidation.ValidateAndGetCalendarEntryForUpdateAsync(dto, profileId.Value);
            if (!calendarEntryResult.Success)
            {
                return BadRequest(calendarEntryResult.Message);
            }

            var calendarEntry = calendarEntryResult.Data!;

            calendarEntry.EntryCategory = dto.EntryCategory;
            calendarEntry.Name = dto.Name;
            calendarEntry.Description = dto.Description;
            calendarEntry.StartDate = dto.StartDate;
            calendarEntry.EndDate = dto.EndDate;
            calendarEntry.Location = dto.Location;
            calendarEntry.NotificationTime = dto.NotificationTime;
            calendarEntry.Color = dto.Color;
            calendarEntry.IsCompleted = dto.IsCompleted;
            calendarEntry.IsAllDay = dto.IsAllDay ?? true;
            calendarEntry.CreatedBy = profileId.Value;

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

            var validUser = await calendarValidation.ValidateCalendarRoleAsync(profileId!.Value, calendarEntry.CalendarId);
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
