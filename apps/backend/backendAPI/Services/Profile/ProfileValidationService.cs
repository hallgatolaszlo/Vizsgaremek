using backend.Context;
using backend.DTOs;
using backend.DTOs.Profile;

namespace backend.Services.Profile
{
    public class ProfileValidationService(AppDbContext context, ICommonValidationService commonValidation) : IProfileValidationService
    {
        public Task<ServiceResponse<bool>> ValidateProfileCreationAsync(CreateProfileDTO profileDTO)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResponse<bool>> ValidateProfileUpdateAsync(UpdateProfileDTO profileDTO)
        {
            throw new NotImplementedException();
        }
    }
}
