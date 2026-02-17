using backend.Context;
using backend.DTOs;
using backend.DTOs.Friend;
using backend.Extensions;
using backend.Hubs;
using backend.Models;
using backend.Models.Enums;
using backend.Services;
using backend.Services.Friend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController(AppDbContext context, ICommonValidationService commonValidation, IFriendValidationService friendValidation, IHubContext<NotificationHub> hubContext) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<IEnumerable<GetFriendsDTO>>>> GetFriends([FromQuery] string? stat)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            stat = stat ?? "Accepted";

            var statusResult = commonValidation.ValidateEnum<Status>(stat);
            if (!statusResult.Success)
            {
                return BadRequest("Invalid status provided");
            }

            var friends = await context.Friends
                .Where(x => x.User1ProfileId == profileId && x.Status == statusResult.Data).Select(x => new GetFriendsDTO
                {
                    ProfileId = x.User2ProfileId,
                    Username = x.User2Profile!.Username,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                })
                .Union(context.Friends
                .Where(x => x.User2ProfileId == profileId && x.Status == statusResult.Data).Select(x => new GetFriendsDTO
                {
                    ProfileId = x.User1ProfileId,
                    Username = x.User1Profile!.Username,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                }))
                .ToListAsync();

            return Ok(friends);
        }

        [HttpPost("friend-request")]
        [Authorize]
        public async Task<ActionResult> AddFriend(AddFriendDTO request)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var validationResult = await friendValidation.ValidateFriendCreationAsync(profileId.Value, request.ProfileId);
            if (!validationResult.Success)
            {
                return BadRequest(validationResult.Message);
            }

            var friend = new Friend
            {
                User1ProfileId = profileId.Value,
                User2ProfileId = request.ProfileId,
                Status = Status.Pending,
                CreatedAt = DateTime.UtcNow,
            };

            context.Friends.Add(friend);
            await context.SaveChangesAsync();

            await hubContext.Clients.User(request.ProfileId.ToString())
                .SendAsync("ReceiveNotification", new 
                { 
                    Type = "FriendRequest", 
                    Name = await context.Profiles.Where(x=> x.Id == profileId).Select(x=>x.Username).FirstOrDefaultAsync(), 
                    Message = "Sent you a friend request!", 
                    SentAt = DateTime.UtcNow 
                });

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> UpdateFriendStatus(UpdateFriendStatus request)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var friendResult = await friendValidation.ValidateAndGetFriendForUpdateAsync(profileId.Value, request);
            if (!friendResult.Success)
            {
                return NotFound(friendResult.Message);
            }

            var friend = friendResult.Data!;

            friend.Status = request.Status;
            friend.UpdatedAt = DateTime.UtcNow;

            context.Entry(friend).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var friendExists = await friendValidation.FriendExists(profileId.Value, request.ProfileId);
                if (!friendExists.Success)
                {
                    return NotFound(friendExists.Message);
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        [HttpDelete("{friendId}")]
        [Authorize]
        public async Task<ActionResult> DeleteFriend(Guid friendId)
        {
            var profileId = this.GetProfileId();
            if (profileId == null)
            {
                return Unauthorized();
            }

            var friend = await friendValidation.FriendExists(profileId.Value, friendId);
            if (!friend.Success)
            {
                return NotFound(friend.Message);
            }

            context.Friends.Remove(friend.Data!);
            return Ok();
        }
    }
}
