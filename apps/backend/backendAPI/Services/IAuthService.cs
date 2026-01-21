using backend.DTOs;
using backend.DTOs.Auth;
using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<ServiceResponse<bool>> SignUpAsync(SignUpRequestDTO request);
        Task<TokenResponseDTO?> SignInAsync(SignInRequestDTO request);
        Task<TokenResponseDTO?> RefreshTokensAsync(TokenResponseDTO request);
    }
}
