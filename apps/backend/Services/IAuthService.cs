using backend.DTOs.Auth;
using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<string?> SignUpAsync(SignUpRequestDTO request);
        Task<TokenResponseDTO?> SignInAsync(SignInRequestDTO request);
        Task<TokenResponseDTO?> RefreshTokensAsync(TokenResponseDTO request);
    }
}
