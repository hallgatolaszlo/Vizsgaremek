using backend.Context;
using backend.DTOs;
using backend.DTOs.Profile;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Profile
{
    public class ProfileValidationService(AppDbContext context, ICommonValidationService commonValidation) : IProfileValidationService
    {
        public async Task<ServiceResponse<bool>> ValidateProfileCreationAsync(Models.Profile profileDTO)
        {
            if (await ValidateUniqueUsername(profileDTO.Username))
            {
                return new ServiceResponse<bool> { Success = false, Message = "Username already exists" };
            }

            return await ValidateCommonProfileRulesAsync(profileDTO.Username, profileDTO.UserId, profileDTO.BirthDate);
        }

        public async Task<ServiceResponse<bool>> ValidateProfileUpdateAsync(UpdateProfileDTO profileDTO)
        {
            if (await ValidateUniqueUsername(profileDTO.Username, profileDTO.Id))
            {
                return new ServiceResponse<bool> { Success = false, Message = "Username already exists" };
            }
            return await ValidateCommonProfileRulesAsync(profileDTO.Username, profileDTO.userId, profileDTO.BirthDate);
        }

        private async Task<ServiceResponse<bool>> ValidateCommonProfileRulesAsync(string name, Guid userId, DateOnly? birthDate)
        {
            var response = new ServiceResponse<bool>();

            //database logic
            var validationResponse = await commonValidation.EntityExists<User>(userId);
            if (!validationResponse.Success)
            {
                response.Success = false;
                response.Message = validationResponse.Message;
            }

            //logic
            if (name.Length > 64 || name.Length < 3)
            {
                response.Success = false;
                response.Message = "Name must be 3-64 long";
                return response;
            }

            if (birthDate.HasValue && (birthDate.Value > DateOnly.FromDateTime(DateTime.UtcNow).AddYears(-13)))
            {
                response.Success = false;
                response.Message = "You must be at least 13 years old";
            }

            return response;
        }

        private async Task<bool> ValidateUniqueUsername(string name, Guid? id = null)
        {
            var query = context.Profiles.Where(p => p.Username == name);

            if (id.HasValue)
            {
                query = query.Where(p => p.Id != id);
            }

            return await query.AnyAsync();
        }
    }
}
