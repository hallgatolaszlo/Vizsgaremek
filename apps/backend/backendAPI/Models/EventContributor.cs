using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [PrimaryKey(nameof(ProfileId), nameof(EventId))]
    public class EventContributor
    {
        public Guid ProfileId { get; set; }
        public Profile? Profile { get; set; }
        public Guid EventId { get; set; }
        public Event? Event { get; set; }

    }
}
