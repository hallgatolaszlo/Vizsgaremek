using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Context.ModelConfigurations
{
    public class FriendConfig
    {
        public class FriendEntityTypeConfiguration : IEntityTypeConfiguration<Friend>
        {
            public void Configure(EntityTypeBuilder<Friend> builder)
            {
                builder
                    .Property(p => p.Status)
                    .HasConversion<int>();

                builder
                    .HasOne(f => f.User1Profile)
                    .WithMany(p => p.FriendAsUser1)
                    .HasForeignKey(f => f.User1ProfileId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder
                    .HasOne(f => f.User2Profile)
                    .WithMany(p => p.FriendAsUser2)
                    .HasForeignKey(f => f.User2ProfileId)
                    .OnDelete(DeleteBehavior.Restrict);
            }
        }
    }
}
