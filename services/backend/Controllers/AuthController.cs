using backend.Common;
using backend.DTOs;
using backend.DTOs.Auth;
using backend.Models;
using backend.Services;
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
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("sign-up")]
        public async Task<ActionResult<string>> SignUp(SignUpRequestDTO request)
        {
            // Call the service to sign up
            string? error = await authService.SignUpAsync(request);

            // Validate response
            if (error is not null)
            {
                return BadRequest(error);
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

            // Set tokens in cookies
            SetTokenCookies(response);

            return Ok();
        }

        [HttpGet("refresh")]
        public async Task<ActionResult<TokenResponseDTO>> RefreshTokens()
        {
            // Retrieve tokens from cookies
            var accessToken = Request.Cookies["accessToken"];
            var refreshToken = Request.Cookies["refreshToken"];

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

            // Set new tokens in cookies
            SetTokenCookies(response);

            return Ok();
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

        // Temporary protected endpoint for testing
        [HttpGet("protected")]
        [Authorize]
        public IActionResult Protected()
        {
            return Ok("You have accessed a protected endpoint.");
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
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };

            // Append cookies to the response
            Response.Cookies.Append("accessToken", tokens.AccessToken, tokenOptions);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken, tokenOptions);
        }
    }
}