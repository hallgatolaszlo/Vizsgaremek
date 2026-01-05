using System.ComponentModel.DataAnnotations;
using backend.Models.Enums;

namespace backend.Models
{
    public class Habit
    {
        public Guid Id { get; set; }
        [Required]
        [StringLength(64, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;
        [StringLength(1024)]
        public string? Description { get; set; }
        [Required]
        public HabitCategory HabitCategory { get; set; } = 0;
        [Required]
        public Unit Unit { get; set; } = 0;
        public float? Goal { get; set; }
        [Range(1, 24)]
        public int Color { get; set; } = 1;
        //which dayS, that's why you need bitmask, but egyelőre marad int
        public int? Days { get; set; }
        public Guid ProfileId { get; set; }
        public Profile? Profile { get; set; }
    }
}
