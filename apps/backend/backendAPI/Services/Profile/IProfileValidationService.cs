using backend.DTOs;
using backend.DTOs.Profile;

namespace backend.Services.Profile
{
    public interface IProfileValidationService
    {
        Task<ServiceResponse<bool>> ValidateProfileCreationAsync(CreateProfileDTO profileDTO);
        Task<ServiceResponse<bool>> ValidateProfileUpdateAsync(UpdateProfileDTO profileDTO);
    }
}
