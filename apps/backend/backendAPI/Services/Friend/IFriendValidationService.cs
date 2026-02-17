using backend.DTOs;
using backend.DTOs.Friend;

namespace backend.Services.Friend
{
    public interface IFriendValidationService
    {
        Task<ServiceResponse<bool>> ValidateFriendCreationAsync(Guid user1PId, Guid user2PId);
        Task<ServiceResponse<Models.Friend>> ValidateAndGetFriendForUpdateAsync(Guid profileId, UpdateFriendStatus request);
        Task<ServiceResponse<Models.Friend>> FriendExists(Guid user1pId, Guid user2pId);
    }
}
