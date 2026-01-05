using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }
        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;
        [StringLength(255)]
        public string? Details { get; set; }
        [Required]
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        [Required]
        public bool IsCompleted { get; set; } = false;
        [Required]
        public bool HasDeadline { get; set; } = false;
        [Required]
        [Range(1, 24)]
        public int Color { get; set; } = 1;

        public Guid CreatedBy { get; set; }
        public Profile? Profile { get; set; }
        public DateTime? NotificationTime { get; set; }
        public Guid CalendarId { get; set; }
        public Calendar? Calendar { get; set; }
    }
}
