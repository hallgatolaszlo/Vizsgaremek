using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Calendar
    {
        public Guid Id { get; set; }
        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;
        [Range(1, 24)]
        public int Color { get; set; } = 1;
        public Guid ProfileId { get; set; }
        public Profile? Profile { get; set; }
        public ICollection<Event>? Events { get; set; }
        public ICollection<TaskItem>? TaskItems { get; set; }
        public ICollection<SharedCalendar>? SharedCalendars { get; set; }
    }
}
