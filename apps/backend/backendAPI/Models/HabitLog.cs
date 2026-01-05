using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class HabitLog
    {
        public Guid Id { get; set; }
        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public float? Value { get; set; }
        public bool? IsCompleted { get; set; }
        public Guid HabitId { get; set; }
        public Habit? Habit { get; set; }
    }
}
