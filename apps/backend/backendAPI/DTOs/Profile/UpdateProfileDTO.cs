using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Profile
{
    public class UpdateProfileDTO
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public string? Avatar { get; set; }
        public bool IsPrivate { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? BirthDate { get; set; }

        public Guid userId { get; set; }
    }
}
