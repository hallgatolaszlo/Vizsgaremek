using backend.DTOs;
using backend.DTOs.Auth;

namespace backend.Services.Registration
{
    public interface IUserRegistration
    {
        Task<ServiceResponse<bool>> RegisterUserWithProfileAndCalendarAsync(SignUpRequestDTO request);
    }
}
