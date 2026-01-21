using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class EventContributorConfig
    {
        public class EventContributorEntityTypeConfiguration : IEntityTypeConfiguration<EventContributor>
        {
            public void Configure(EntityTypeBuilder<EventContributor> builder)
            {
                builder
                    .Property(p => p.Status)
                    .HasConversion<int>();
            }
        }
    }
}
