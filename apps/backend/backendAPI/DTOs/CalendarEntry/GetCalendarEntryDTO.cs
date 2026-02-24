using backend.Models.Enums;

namespace backend.DTOs.CalendarEntry
{
    public class GetCalendarEntryDTO
    {
        public Guid Id { get; set; }
        public EntryCategory EntryCategory { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Location { get; set; }
        public DateTime? NotificationTime { get; set; }
        public int Color { get; set; }
        public bool? IsCompleted { get; set; }
        public bool? IsAllDay { get; set; }
        public Guid CalendarId { get; set; }
        public required string CalendarName { get; set; }
        public Guid CreatedBy { get; set; }
        public required string CreatedByName { get; set; }
    }
}
