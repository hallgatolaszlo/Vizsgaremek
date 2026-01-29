using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class HabitConfig
    {
        public class HabitEntityTypeConfiguration : IEntityTypeConfiguration<Habit>
        {
            public void Configure(EntityTypeBuilder<Habit> builder)
            {
                builder
                    .Property(p => p.HabitCategory)
                    .HasConversion<int>();

                builder
                    .Property(p => p.Unit)
                    .HasConversion<int>();
            }
        }
    }
}
