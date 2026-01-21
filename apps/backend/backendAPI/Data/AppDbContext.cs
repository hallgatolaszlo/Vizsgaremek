using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace backend.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Calendar> Calendars { get; set; }
        public DbSet<SharedCalendar> SharedCalendars { get; set; }
        public DbSet<CalendarEntry> CalendarEntries { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<EventContributor> EventContributors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
