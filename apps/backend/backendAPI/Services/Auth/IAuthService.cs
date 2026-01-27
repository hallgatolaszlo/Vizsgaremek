using backend.DTOs;
using backend.DTOs.Auth;
using backend.Models;

namespace backend.Services.Auth
{
    public interface IAuthService
    {
        Task<ServiceResponse<Guid>> SignUpAsync(SignUpRequestDTO request);
        Task<TokenResponseDTO?> SignInAsync(SignInRequestDTO request);
        Task<TokenResponseDTO?> RefreshTokensAsync(TokenResponseDTO request);
    }
}
