using System;
using backend.Models.Enums;
using backend.Models;


namespace backend.DTOs.SharedCalendar
{
    public class GetAllSharedCalendarDto
    {
        public required string ProfileUsername { get; set; }
        public required string CalendarName { get; set; }
        public Role Role { get; set; }
    }
}
