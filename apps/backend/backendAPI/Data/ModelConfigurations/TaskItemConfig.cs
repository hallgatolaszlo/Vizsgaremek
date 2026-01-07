using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class TaskItemConfig
    {
        public class TaskItemEntityTypeConfiguration : IEntityTypeConfiguration<TaskItem>
        {
            public void Configure(EntityTypeBuilder<TaskItem> builder)
            {
                builder
                    .HasIndex(t => t.StartDate);
            }
        }
    }
}
