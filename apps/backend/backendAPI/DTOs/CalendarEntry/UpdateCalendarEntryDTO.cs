using backend.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.CalendarEntry
{
    public class UpdateCalendarEntryDTO
    {
        public EntryCategory EntryCategory { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public DateTime? NotificationTime { get; set; }
        public int Color { get; set; }
        public bool? IsCompleted { get; set; }
        public Guid CalendarId { get; set; }
        public Guid CreatedBy { get; set; }
    }
}
