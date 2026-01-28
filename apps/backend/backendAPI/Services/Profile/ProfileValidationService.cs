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
            return await ValidateCommonProfileRulesAsync(profileDTO.Username, profileDTO.BirthDate, profileDTO.UserId );
        }

        public async Task<ServiceResponse<Models.Profile>> ValidateProfileUpdateAsync(UpdateProfileDTO profileDTO)
        {
            if (await ValidateUniqueUsername(profileDTO.Username, profileDTO.Id))
            {
                return new ServiceResponse<Models.Profile> { Success = false, Message = "Username already exists" };
            }

            var profile = await commonValidation.EntityExists<Models.Profile>(profileDTO.Id);
            if (!profile.Success)
            {
                return new ServiceResponse<Models.Profile> { Success = false, Message = profile.Message };
            }

            var validationResponse = await ValidateCommonProfileRulesAsync(profileDTO.Username, profileDTO.BirthDate);

            return new ServiceResponse<Models.Profile> { Success = validationResponse.Success, Message = validationResponse.Message, Data = profile.Data };
        }

        private async Task<ServiceResponse<bool>> ValidateCommonProfileRulesAsync(string name, DateOnly? birthDate = null, Guid? userId = null)
        {
            var response = new ServiceResponse<bool>() { Success = true };

            //database logic
            if (userId.HasValue)
            {
                var validationResponse = await commonValidation.EntityExists<User>(userId.Value);
                if (!validationResponse.Success)
                {
                    response.Success = false;
                    response.Message = validationResponse.Message;
                    return response;
                }
            }
            

            //logic
            if (!commonValidation.ValidateText(name, 3, 64).Success) 
            {
                response.Success = false;
                response.Message = "Name must be 3-64 long";
                return response;
            };

            if (birthDate.HasValue)
            {
                if(birthDate.Value > DateOnly.FromDateTime(DateTime.UtcNow))
                {
                    response.Success = false;
                    response.Message = "Are you from the future?";
                    return response;
                }
            }

            return response;
        }

        public async Task<bool> ValidateUniqueUsername(string name, Guid? id = null)
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
