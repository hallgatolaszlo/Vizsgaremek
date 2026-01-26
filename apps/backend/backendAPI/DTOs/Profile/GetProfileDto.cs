using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Profile
{
    public class GetProfileDTO
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Avatar { get; set; }
        public bool IsPrivate { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? BirthDate { get; set; }
    }
}
