using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3)]
        [MaxLength(20)]
        public string Username { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        [MinLength(6)]
        [MaxLength(20)]
        public string Password { get; set; } = string.Empty;
    }
}
