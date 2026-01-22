using backend.Common;
using backend.Context;
using backend.DTOs.Auth;
using backend.DTOs.Calendar;
using backend.Extensions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CalendarController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetCalendarDto>>> GetAllCalendarsForUser()
        {
            var profileId = this.GetProfileId();
            if (profileId == null) 
            {
                return Unauthorized();
            }
            IEnumerable<GetCalendarDto> owncalendars = await _context.Calendars.Where(x => x.ProfileId == profileId).Select(x => new GetCalendarDto
            {
                Id = x.Id,
                Color = x.Color,
                Name = x.Name,
            }).ToListAsync();

            IEnumerable<GetCalendarDto> sharedCalendars = await _context.SharedCalendars.Where(x => x.ProfileId == profileId).Select(x => new GetCalendarDto
            {
                Id = x.CalendarId,
                Name = x.Calendar!.Name,
                Color = x.Calendar!.Color,
            }).ToListAsync();

            IEnumerable<GetCalendarDto> calendars = [.. owncalendars, .. sharedCalendars];

            return Ok(calendars);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateCalendar(CreateCalendarDto request)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var calendar = new Calendar
            {
                Name = request.Name,
                Color = request.Color,
                ProfileId = profileId.Value,
            };

            _context.Calendars.Add(calendar);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}