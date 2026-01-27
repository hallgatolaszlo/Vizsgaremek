using backend.DTOs;
using backend.DTOs.CalendarEntry;
using backend.Models;
using backend.Models.Enums;
using backend.Services;

namespace backend.Services.CalendarEntry
{
    public class CalendarEntryValidationService(ICommonValidationService commonValidation) : ICalendarEntryValidationService
    {
        public async Task<ServiceResponse<bool>> ValidateCalendarEntryCreateAsync(CreateCalendarEntryDTO calendarEntryDTO)
        {
            return await ValidateCommonCalendarEntryRulesAsync(calendarEntryDTO.CalendarId, calendarEntryDTO.EntryCategory, calendarEntryDTO.StartDate, calendarEntryDTO.EndDate);
        }
        public async Task<ServiceResponse<Models.CalendarEntry>> ValidateCalendarEntryUpdateAsync(UpdateCalendarEntryDTO calendarEntryDTO)
        {
            var calendarEntry = await commonValidation.EntityExists<Models.CalendarEntry>(calendarEntryDTO.Id);
            if (!calendarEntry.Success)
            {
                return new ServiceResponse<Models.CalendarEntry> { Success = false, Message = "Entry not found" };
            }

            var validationResponse = await ValidateCommonCalendarEntryRulesAsync(calendarEntryDTO.CalendarId, calendarEntryDTO.EntryCategory, calendarEntryDTO.StartDate, calendarEntryDTO.EndDate);

            return new ServiceResponse<Models.CalendarEntry> { Success = validationResponse.Success, Message = validationResponse.Message, Data = calendarEntry.Data }
        }

        private async Task<ServiceResponse<bool>> ValidateCommonCalendarEntryRulesAsync(Guid calendarId, EntryCategory category, DateTime startDate, DateTime endDate, bool? isCompleted = null)
        {
            var response = new ServiceResponse<bool>();

            var calendarValidationResponse = await commonValidation.EntityExists<Models.Calendar>(calendarId);
            if (!calendarValidationResponse.Success)
            {
                response.Success = false;
                response.Message = calendarValidationResponse.Message;
                return response;
            }

            //logic
            if(!category.Equals(EntryCategory.Task) && isCompleted!=null)
            {
                response.Success=false;
                response.Message="Only task can be completed";
                return response;
            }

            if (startDate < DateTime.UtcNow || endDate < DateTime.UtcNow)
            {
                response.Success = false;
                response.Message = "Date cannot be in the past";
                return response;
            }

            if (startDate > endDate)
            {
                response.Success=false;
                response.Message="End date cannot be sooner than start date";
                return response;
            }

            response.Success = true;
            return response;
        }
    }
}
