using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class CalendarEntryConfig
    {
        public class CalendarEntryEntityTypeConfiguration : IEntityTypeConfiguration<CalendarEntry>
        {
            public void Configure(EntityTypeBuilder<CalendarEntry> builder)
            {
                builder
                    .Property(p => p.EntryCategory)
                    .HasConversion<int>();

                builder
                    .HasIndex(e => e.StartDate);

                builder
                    .HasOne(e => e.Profile)
                    .WithMany(p => p.CalendarEntries)
                    .HasForeignKey(e => e.CreatedBy);

            }
        }
    }
}
