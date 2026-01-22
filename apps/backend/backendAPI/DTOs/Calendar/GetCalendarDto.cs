namespace backend.DTOs.Calendar
{
    public class GetCalendarDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public int Color { get; set; }
    }
}
