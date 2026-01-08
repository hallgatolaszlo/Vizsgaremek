using backend.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace backend.Context.ModelConfigurations
{
    public class CalendarConfig
    {
        public class CalendarEntityTypeConfiguration : IEntityTypeConfiguration<Calendar>
        {
            public void Configure(EntityTypeBuilder<Calendar> builder)
            {
                builder
                    .Property(x => x.Color)
                    .HasDefaultValue(1);
            }
        }
    }
}
