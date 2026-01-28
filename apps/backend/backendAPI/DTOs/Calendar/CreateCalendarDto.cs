using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Calendar
{
    public class CreateCalendarDTO
    {
        public required string Name { get; set; }
        public int Color { get; set; }
    }
}
