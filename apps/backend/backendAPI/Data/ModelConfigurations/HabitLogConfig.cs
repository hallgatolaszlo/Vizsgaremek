using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class HabitLogConfig
    {
        public class HabitLogEntityTypeConfiguration : IEntityTypeConfiguration<HabitLog>
        {
            public void Configure(EntityTypeBuilder<HabitLog> builder)
            {
                builder
                    .HasIndex(hl => hl.Date);
            }
        }
    }
}
