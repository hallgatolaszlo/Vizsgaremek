using backend.Context;
using backend.DTOs;
using backend.DTOs.Friend;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Friend
{
    public class FriendValidationService(AppDbContext context) : IFriendValidationService
    {
        public async Task<ServiceResponse<bool>> ValidateFriendCreationAsync(Guid user1PId, Guid user2PId)
        {
            var validationResult = await FriendExists(user1PId, user2PId);
            if (validationResult.Success)
            { 
                return new ServiceResponse<bool> { Success = false, Message = "Friend already exists" };
            }

            if (!NotSameUserValidation(user1PId, user2PId))
            {
                return new ServiceResponse<bool> { Success = false, Message = "Users cannot be the same" };
            }

            return new ServiceResponse<bool> { Success = true };
        }

        public async Task<ServiceResponse<Models.Friend>> ValidateAndGetFriendForUpdateAsync(Guid profileId, UpdateFriendStatus request)
        {
            var friend = await FriendExists(profileId, request.ProfileId);
            if (!friend.Success)
            { 
                return new ServiceResponse<Models.Friend> { Success = false, Message = "Friend already exists" };
            }

            if(!NotSameUserValidation(profileId, request.ProfileId))
            {
                return new ServiceResponse<Models.Friend> { Success = false, Message = "Users cannot be the same" };
            }

            return new ServiceResponse<Models.Friend> { Success = true, Data = friend.Data };
        }

        private bool NotSameUserValidation(Guid user1pId, Guid user2pId)
        {
            if (user1pId == user2pId)
            {
                return false;
            }

            return true;
        } 
        public async Task<ServiceResponse<Models.Friend>> FriendExists(Guid user1pId, Guid user2pId)
        {
            var friend = await context.Friends
                .Where(x =>
                    (x.User1ProfileId == user1pId && x.User2ProfileId == user2pId) ||
                    (x.User2ProfileId == user2pId && x.User1ProfileId == user1pId))
                .FirstOrDefaultAsync();

            if (friend == null)
            {
                return new ServiceResponse<Models.Friend>
                {
                    Success = false,
                    Message = "Friend not found"
                };
            }

            return new ServiceResponse<Models.Friend> { Success = true, Data = friend };
        }
    }
}
