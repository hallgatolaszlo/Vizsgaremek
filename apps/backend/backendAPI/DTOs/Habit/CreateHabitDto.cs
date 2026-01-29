using backend.Models.Enums;

namespace backend.DTOs.Habit
{
    public class CreateHabitDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public HabitCategory Habitcategory { get; set; }
        public Unit Unit { get; set; }
        public float? Goal { get; set; }
        public int? Days { get; set; }
        public int Color { get; set; }
    }
}
