using backend.Models.Enums;

namespace backend.DTOs.Calendar
{
    public class AccessibleCalendarDTO
    {
        public Guid CalendarId { get; set; }
        public Role Role { get; set; }
    }
}
