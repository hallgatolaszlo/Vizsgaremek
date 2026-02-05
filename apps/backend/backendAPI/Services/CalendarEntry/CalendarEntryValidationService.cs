using System.Globalization;
using backend.Common;
using backend.Context;
using backend.DTOs;
using backend.DTOs.CalendarEntry;
using backend.Models;
using backend.Models.Enums;
using backend.Services;
using backend.Services.Calendar;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.CalendarEntry
{
    public class CalendarEntryValidationService(ICommonValidationService commonValidation, ICalendarValidationService calendarValidation) : ICalendarEntryValidationService
    {
        public async Task<ServiceResponse<bool>> ValidateCalendarEntryCreationAsync(CreateCalendarEntryDTO calendarEntryDTO, Guid createdBy)
        {
            return await ValidateCommonCalendarEntryRulesAsync(calendarEntryDTO.CalendarId, calendarEntryDTO.EntryCategory, calendarEntryDTO.StartDate, calendarEntryDTO.EndDate, createdBy);
        }
        public async Task<ServiceResponse<Models.CalendarEntry>> ValidateAndGetCalendarEntryForUpdateAsync(UpdateCalendarEntryDTO calendarEntryDTO, Guid createdBy)
        {
            var calendarEntry = await commonValidation.EntityExists<Models.CalendarEntry>(calendarEntryDTO.Id);
            if (!calendarEntry.Success)
            {
                return new ServiceResponse<Models.CalendarEntry> { Success = false, Message = "Entry not found" };
            }

            var validationResult = await ValidateCommonCalendarEntryRulesAsync(calendarEntryDTO.CalendarId, calendarEntryDTO.EntryCategory, calendarEntryDTO.StartDate, calendarEntryDTO.EndDate, createdBy);

            return new ServiceResponse<Models.CalendarEntry> { Success = validationResult.Success, Message = validationResult.Message, Data = calendarEntry.Data };
        }

        private async Task<ServiceResponse<bool>> ValidateCommonCalendarEntryRulesAsync(Guid calendarId, EntryCategory category, DateTime startDate, DateTime endDate, Guid createdBy, bool? isCompleted = null)
        {
            var response = new ServiceResponse<bool>();

            var validUser = await calendarValidation.ValidateCalendarRoleAsync(createdBy, calendarId);
            if (!validUser.Success)
            {
                response.Success = false;
                response.Message = validUser.Message;
                return response;
            }

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
