using System.ComponentModel.DataAnnotations;
using backend.Models.Enums;

namespace backend.Models
{
    public class CalendarEntry
    {
        public Guid Id { get; set; }
        [Required]
        public EntryCategory EntryCategory { get; set; } = 0;
        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;
        [StringLength(1024)]
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public DateTime? NotificationTime { get; set; }
        [Range(1, 12)]
        public int Color { get; set; } = 1;
        public bool? IsCompleted { get; set; }
        public bool isAllDay { get; set; } = true;
        public Guid CalendarId { get; set; }
        public Calendar? Calendar { get; set; }
        public Guid CreatedBy { get; set; }
        public Profile? Profile { get; set; }
    }
}
