using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Profile
{
    public class GetProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public bool IsPrivate { get; set; } = true;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? BirthDate { get; set; }
    }
}
