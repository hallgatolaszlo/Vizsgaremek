using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class SharedCalendarConfig
    {
        public class SharedCalendarEntityTypeConfiguration : IEntityTypeConfiguration<SharedCalendar>
        {
            public void Configure(EntityTypeBuilder<SharedCalendar> builder)
            {
                builder
                    .Property(p => p.Role)
                    .HasConversion<int>();
            }
        }
    }
}
