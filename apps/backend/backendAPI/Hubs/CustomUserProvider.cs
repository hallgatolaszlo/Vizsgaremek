using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class CustomUserProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            // This looks at the claims of the user currently connecting to the Hub
            return connection.User?.FindFirst("ProfileId")?.Value;
        }
    }
}
