using backend.Common;
using backend.DTOs;
using backend.DTOs.Auth;
using backend.Models;
using backend.Services.Auth;
using backend.Services.Registration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, IUserRegistration userRegistration) : ControllerBase
    {
        [HttpPost("sign-up")]
        public async Task<ActionResult<string>> SignUp(SignUpRequestDTO request)
        {
            // Call the service to sign up
            ServiceResponse<bool> error = await userRegistration.RegisterUserWithProfileAndCalendarAsync(request);

            // Validate response
            if (error.Success == false)
            {
                return BadRequest(error.Message);
            }
            return Ok();
        }

        [HttpPost("sign-in")]
        public async Task<ActionResult<TokenResponseDTO>> SignIn(SignInRequestDTO request)
        {
            // Call the service to sign in
            TokenResponseDTO? response = await authService.SignInAsync(request);

            // Validate response
            if (response is null)
            {
                return BadRequest(AuthErrors.InvalidCredentials);
            }

            // Set tokens in cookies (for web)
            SetTokenCookies(response);

            // Return tokens in response body (for native apps)
            return Ok(response);
        }

        [HttpGet("refresh")]
        public async Task<ActionResult<TokenResponseDTO>> RefreshTokens()
        {
            // Try to get tokens from cookies first (web)
            var accessToken = Request.Cookies["accessToken"];
            var refreshToken = Request.Cookies["refreshToken"];

            // If not in cookies, try Authorization header and X-Refresh-Token header (native)
            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (authHeader != null && authHeader.StartsWith("Bearer "))
                {
                    accessToken = authHeader.Substring("Bearer ".Length).Trim();
                }
                refreshToken = Request.Headers["X-Refresh-Token"].FirstOrDefault();
            }

            // Validate presence of tokens
            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized();
            }

            // Create request DTO
            TokenResponseDTO request = new TokenResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            // Call the service to refresh tokens
            TokenResponseDTO? response = await authService.RefreshTokensAsync(request);

            // Validate response
            if (response is null || response.AccessToken is null || response.RefreshToken is null)
            {
                return Unauthorized();
            }

            // Set new tokens in cookies (for web)
            SetTokenCookies(response);

            // Return tokens in response body (for native apps)
            return Ok(response);
        }

        [HttpGet("sign-out")]
        new public IActionResult SignOut()
        {
            // Delete the authentication cookies
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

            return Ok();
        }

        // Endpoint to verify authentication
        [HttpGet("verify")]
        [Authorize]
        public IActionResult AuthOnly()
        {
            return Ok();
        }

        // Helper method to set tokens in cookies
        private void SetTokenCookies(TokenResponseDTO tokens)
        {
            // Set cookie options
            var tokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Set to true in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            // Append cookies to the response
            Response.Cookies.Append("accessToken", tokens.AccessToken, tokenOptions);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken, tokenOptions);
        }
    }
}