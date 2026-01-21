using backend.Common;
using backend.Context;
using backend.DTOs;
using backend.DTOs.Auth;
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
        public async Task<ActionResult<IEnumerable<GetCalendarDto>>> GetAllCalendars()
        {
            /*var userId = this.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var profileId = await _context.Profiles.Where(x=>x.UserId == new Guid(userId)).Select(x=>x.Id).FirstOrDefaultAsync();

            IEnumerable<GetCalendarDto> owncalendars = await _context.Calendars.Where(x => x.ProfileId == profileId).Select(x=> new GetCalendarDto
            {
                Color = x.Color,
                Name = x.Name,
            }).ToListAsync();

            IEnumerable<GetCalendarDto> sharedCalendars = await _context.SharedCalendars.Where(x=>x.ProfileId==profileId).Select(x=> new GetCalendarDto
            {
                Name = x.Calendar!.Name,
                Color = x.Calendar!.Color,
            }).ToListAsync();

            IEnumerable<GetCalendarDto> calendars = [.. owncalendars, .. sharedCalendars];

            return Ok(calendars);*/
            return Ok();
        }
    }
}


//SELECT c."Name", c."Color" FROM "Calendars" AS c INNER JOIN "SharedCalendars" AS sc ON c."ProfileId" = sc."ProfileId";