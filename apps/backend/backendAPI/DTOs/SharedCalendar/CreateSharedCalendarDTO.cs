using backend.Models.Enums;

namespace backend.DTOs.SharedCalendar
{
    public class CreateSharedCalendarDTO
    {
        public Guid CalendarId { get; set; }
        public Role Role { get; set; }
    }
}
