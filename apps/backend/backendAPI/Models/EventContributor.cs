using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [PrimaryKey(nameof(ProfileId), nameof(CalendarEntryId))]
    public class EventContributor
    {
        public Guid ProfileId { get; set; }
        public Profile? Profile { get; set; }
        public Guid CalendarEntryId { get; set; }
        public CalendarEntry? CalendarEntry { get; set; }
        public Status Status { get; set; } = 0;
    }
}
