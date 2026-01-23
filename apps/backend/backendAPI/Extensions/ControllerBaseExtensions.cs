using System.Security.Claims;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Extensions
{
    public static class ControllerBaseExtensions
    {
        // Write controller extension methods related to ControllerBase here


        // Extension method to get the User ID from the claims
        public static Guid? GetUserId(this ControllerBase controller)
        {
            var userId = controller.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userId, out Guid userGuid) ? userGuid : null;
        }

        public static Guid? GetProfileId(this ControllerBase controller) 
        {
            var profileId = controller.User.FindFirstValue("ProfileId");
            return Guid.TryParse(profileId, out Guid profileGuid) ? profileGuid : null;
        }
    }
}
