namespace backend.DTOs.Calendar
{
    public class UpdateCalendarDTO
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public int Color { get; set; }
    }
}
