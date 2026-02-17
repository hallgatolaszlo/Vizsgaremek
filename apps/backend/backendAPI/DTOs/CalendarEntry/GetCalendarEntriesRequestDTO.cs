namespace backend.DTOs.CalendarEntry
{
    public class GetCalendarEntriesRequestDTO
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<string> Ids { get; set; } = [];
    }
}
