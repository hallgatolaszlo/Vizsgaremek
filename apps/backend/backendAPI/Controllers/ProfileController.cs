using backend.Common;
using backend.Context;
using backend.DTOs.Profile;
using backend.Extensions;
using backend.Models;
using backend.Services;
using backend.Services.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController(AppDbContext context, IProfileValidationService profileValidation, ICommonValidationService commonValidation) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<GetProfileDTO>> GetUserProfile()
        {
            var userId = this.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var profile = await context.Profiles.Where(x => x.UserId == userId).Select(x => new GetProfileDTO
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


        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateUserProfile(Guid id, UpdateProfileDTO request)
        {
            if (request.Id != id)
            {
                return BadRequest(CommonErrors.InvalidRoute);
            }

            var validationResponse = await profileValidation.ValidateProfileUpdateAsync(request);
            if (!validationResponse.Success)
            {
                return BadRequest(validationResponse.Message);
            }

            var profile = validationResponse.Data;
            
            profile!.Username = request.Username;
            profile!.IsPrivate = request.IsPrivate;
            profile!.FirstName = request.FirstName;
            profile!.LastName = request.LastName;
            profile!.BirthDate = request.BirthDate;
            profile!.Avatar = request.Avatar;

            context.Entry(profile).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var commonValidationResponse = await commonValidation.EntityExists<Profile>(id);
                if (!commonValidationResponse.Success)
                {
                    return NotFound(commonValidationResponse.Message);
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
    }
}
