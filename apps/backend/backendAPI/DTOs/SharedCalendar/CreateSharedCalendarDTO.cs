using backend.Models.Enums;

namespace backend.DTOs.SharedCalendar
{
    public class CreateSharedCalendarDTO
    {
        public List<string> ProfileIds { get; set; } = [];
        public Guid CalendarId { get; set; }
        public Role Role { get; set; }
    }
}
