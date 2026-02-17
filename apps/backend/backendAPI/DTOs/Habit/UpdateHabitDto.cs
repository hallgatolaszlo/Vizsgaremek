using backend.Models.Enums;

namespace backend.DTOs.Habit
{
    public class UpdateHabitDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public HabitCategory HabitCategory { get; set; }
        public Unit Unit { get; set; }
        public float? Goal { get; set; }
        public int Color { get; set; }
        public int? Days { get; set; }
    }
}
