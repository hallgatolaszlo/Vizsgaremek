using System.ComponentModel.DataAnnotations;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [PrimaryKey(nameof(ProfileId), nameof(CalendarId))]
    public class SharedCalendar
    {
        public Guid ProfileId { get; set; }
        public Profile? Profile { get; set; }
        public Guid CalendarId { get; set; }
        public Calendar? Calendar { get; set; }
        [Required]
        public Role Role { get; set; } = 0;
    }
}
