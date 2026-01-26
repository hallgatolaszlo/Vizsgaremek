using System.ComponentModel.DataAnnotations;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class User : IEntityWithId
    {
        public Guid Id { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public DateTime CreatedAt { get; set; }

        public User()
        {
            Id = Guid.NewGuid();
            Email = string.Empty;
            PasswordHash = string.Empty;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
