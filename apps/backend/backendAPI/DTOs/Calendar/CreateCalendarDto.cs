using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Calendar
{
    public class CreateCalendarDto
    {
        public string Name { get; set; }
        public int Color { get; set; }
        public Guid ProfileId { get; set; }
    }
}
