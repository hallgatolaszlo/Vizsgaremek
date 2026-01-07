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
        public DbSet<Event> Events { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<EventContributor> EventContributors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            //default values and enum convertions
            /* commented out for testing model configs
            modelBuilder.Entity<Profile>()
                .Property(p => p.IsPrivate)
                .HasDefaultValue(true);

            modelBuilder.Entity<Calendar>()
                .Property(p => p.Color)
                .HasDefaultValue(1);

            modelBuilder.Entity<SharedCalendar>()
                .Property(p=>p.Role)
                .HasConversion<int>();

            modelBuilder.Entity<Event>()
                .Property(p=>p.EventCategory)
                .HasConversion<int>();

            modelBuilder.Entity<Event>()
                .Property(p => p.Color)
                .HasDefaultValue(1);

            modelBuilder.Entity<Event>()
                .Property(p => p.IsAllDay)
                .HasDefaultValue(false);

            modelBuilder.Entity<Event>()
                .HasIndex(e=>e.StartDate);

            modelBuilder.Entity<TaskItem>()
                .HasIndex(t => t.StartDate);

            modelBuilder.Entity<HabitLog>()
                .HasIndex(hl => hl.Date);

            modelBuilder.Entity<Habit>()
                .Property(p=>p.HabitCategory)
                .HasConversion<int>();

            modelBuilder.Entity<Habit>()
                .Property(p=>p.Unit)
                .HasConversion<int>();
            
            modelBuilder.Entity<Habit>()
                .Property(p=>p.Color)
                .HasConversion<int>()
                .HasDefaultValue(1);

            modelBuilder.Entity<Friend>()
                .Property(p=>p.Status)
                .HasConversion<int>();


            //relations
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Profile)
                .WithMany(p => p.Events)
                .HasForeignKey(e => e.CreatedBy);

            modelBuilder.Entity<Friend>()
                .HasOne(f => f.User1Profile)
                .WithMany(p=>p.FriendAsUser1)
                .HasForeignKey(f=>f.User1ProfileId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Friend>()
                .HasOne(f => f.User2Profile)
                .WithMany(p=>p.FriendAsUser2)
                .HasForeignKey(f=>f.User2ProfileId)
                .OnDelete(DeleteBehavior.Restrict);*/
        }
    }
}
