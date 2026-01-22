using backend.Models.Enums;

namespace backend.DTOs.Calendar
{
    public class CreateSharedCalendarDto
    {
        public Guid ProfileId { get; set; }
        public Guid CalendarId { get; set; }
        public Role Role { get; set; }
    }
}
