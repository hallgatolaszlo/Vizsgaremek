using backend.Models.Enums;

namespace backend.DTOs.Friend
{
    public class GetFriendsDTO
    {
        public Guid ProfileId { get; set; }
        public required string Username { get; set; }
        public Status Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
