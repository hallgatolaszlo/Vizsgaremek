using backend.Hubs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestNotificationController(IHubContext<NotificationHub> hubContext) : ControllerBase
    {
        [HttpPost("send-friend-request/{targetProfileId}")]
        public async Task<IActionResult> SendTest(string targetProfileId)
        {
            // This simulates a real event happening in your system
            await hubContext.Clients.User(targetProfileId).SendAsync("ReceiveNotification", new
            {
                type = "FriendRequest",
                senderName = "Test User",
                message = "Sent you a friend request!"
            });

            return Ok("Notification sent to Hub!");
        }
    }
}
