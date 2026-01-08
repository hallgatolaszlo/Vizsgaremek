using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class ProfileConfig
    {
        public class ProfileEntityTypeConfiguration : IEntityTypeConfiguration<Profile>
        {
            public void Configure(EntityTypeBuilder<Profile> builder)
            {
                builder
                    .Property(p => p.IsPrivate)
                    .HasDefaultValue(true);
            }
        }
    }
}
