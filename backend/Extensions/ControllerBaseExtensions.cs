using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Extensions
{
    public static class ControllerBaseExtensions
    {
        // Write controller extension methods related to ControllerBase here


        // Extension method to get the User ID from the claims
        public static Guid? GetUserId(this ControllerBase controller)
        {
            var userIdClaim = controller.User.FindFirst(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userIdClaim?.Value, out Guid userId) ? userId : null;
        }
    }
}
