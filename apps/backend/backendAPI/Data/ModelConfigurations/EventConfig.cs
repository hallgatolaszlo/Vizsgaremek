using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class EventConfig
    {
        public class EventEntityTypeConfiguration : IEntityTypeConfiguration<Event>
        {
            public void Configure(EntityTypeBuilder<Event> builder)
            {
                builder
                    .Property(p => p.EventCategory)
                    .HasConversion<int>();

                builder
                    .Property(p => p.Color)
                    .HasDefaultValue(1);



                builder
                    .Property(p => p.IsAllDay)
                    .HasDefaultValue(false);

                builder
                    .HasIndex(e => e.StartDate);

                builder
                    .HasOne(e => e.Profile)
                    .WithMany(p => p.Events)
                    .HasForeignKey(e => e.CreatedBy);

            }
        }
    }
}
