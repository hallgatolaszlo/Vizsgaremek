using backend.Models.Enums;

namespace backend.DTOs.Friend
{
    public class UpdateFriendStatus
    {
        public Guid ProfileId { get; set; }
        public Status Status { get; set; }
    }
}
