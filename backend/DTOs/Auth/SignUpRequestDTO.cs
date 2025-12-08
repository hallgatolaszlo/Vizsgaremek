using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth
{
    public class SignUpRequestDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
