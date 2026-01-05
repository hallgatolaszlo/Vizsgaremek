using System.ComponentModel.DataAnnotations;
using backend.Models.Enums;

namespace backend.Models
{
    public class Event
    {
        public Guid Id { get; set; }
        [Required]
        public EventCategory EventCategory { get; set; } = 0;
        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;
        [StringLength(1024)]
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Range(1, 24)]
        public int Color { get; set; } = 1;
        public string? Location { get; set; }
        public bool IsAllDay { get; set; } = false;
        public DateTime? NotificationTime { get; set; }
        public Guid CalendarId { get; set; }
        public Calendar? Calendar { get; set; }
        public Guid CreatedBy { get; set; }
        public Profile? Profile { get; set; }

        public ICollection<EventContributor>? EventContributors { get; set; }

    }

}
