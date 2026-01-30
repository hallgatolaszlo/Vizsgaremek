using backend.Models.Enums;

namespace backend.DTOs.SharedCalendar
{
    public class CreateSharedCalendarDTO
    {
        public List<SharedCalendarAccount> Accounts { get; set; } = [];
        public Guid CalendarId { get; set; }
    }

    public class SharedCalendarAccount
    {
        public required string ProfileId { get; set; } 
        public Role Role { get; set; } 
    }
}
