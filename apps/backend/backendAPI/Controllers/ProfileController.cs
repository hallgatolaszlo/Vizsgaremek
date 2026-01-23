using backend.Context;
using backend.DTOs.Profile;
using backend.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<GetProfileDto>> GetUserProfile()
        {
            var userId = this.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var profile = await _context.Profiles.Where(x => x.UserId == userId).Select(x => new GetProfileDto
            {
                Id = x.Id,
                Username = x.Username,
                Avatar = x.Avatar,
                IsPrivate = x.IsPrivate,
                FirstName = x.FirstName,
                LastName = x.LastName,
                BirthDate = x.BirthDate,
            }).FirstOrDefaultAsync();

            return Ok(profile);
        }
    }
}
