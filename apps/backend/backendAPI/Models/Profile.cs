using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [Index(nameof(Username), IsUnique = true)]
    public class Profile
    {
        public Guid Id { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Avatar { get; set; } = string.Empty;
        [Required]
        public bool IsPrivate { get; set; } = true;
        [StringLength(128)]
        public string? FirstName { get; set; }
        [StringLength(128)]
        public string? LastName { get; set; }
        public DateOnly? BirthDate { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public ICollection<Habit>? Habits { get; set; }
        public ICollection<Calendar>? Calendars { get; set; }
        public ICollection<SharedCalendar>? SharedCalendars { get; set; }
        public ICollection<Event>? Events { get; set; }
        public ICollection<TaskItem>? TaskItems { get; set; }
        public ICollection<EventContributor>? EventContributors { get; set; }
        public ICollection<Friend>? FriendAsUser1 { get; set; }
        public ICollection<Friend>? FriendAsUser2 { get; set; }
    }
}
