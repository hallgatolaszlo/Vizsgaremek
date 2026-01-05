using System.ComponentModel.DataAnnotations;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [PrimaryKey(nameof(User1ProfileId), nameof(User2ProfileId))]
    public class Friend
    {
        public Guid User1ProfileId { get; set; }
        public Profile? User1Profile { get; set; }
        public Guid User2ProfileId { get; set; }
        public Profile? User2Profile { get; set; }
        [Required]
        public Status Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
