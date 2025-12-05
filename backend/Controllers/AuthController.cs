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
            string? error = await authService.SignUpAsync(request);

            if (error is not null)
            {
                return BadRequest(error);
            }

            return Ok();
        }

        [HttpPost("sign-in")]
        public async Task<ActionResult<TokenResponseDTO>> SignIn(SignInRequestDTO request)
        {
            TokenResponseDTO? response = await authService.SignInAsync(request);

            if (response is null)
            {
                return BadRequest("Invalid credentials");
            }

            SetTokenCookies(response);

            return Ok(response);
        }

        [HttpGet("refresh")]
        public async Task<ActionResult<TokenResponseDTO>> RefreshTokens()
        {
            var accessToken = Request.Cookies["accessToken"];
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized();
            }

            TokenResponseDTO request = new TokenResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            TokenResponseDTO? response = await authService.RefreshTokensAsync(request);
            if (response is null || response.AccessToken is null || response.RefreshToken is null)
            {
                return Unauthorized();
            }

            SetTokenCookies(response);

            return Ok(response);
        }

        [HttpGet("sign-out")]
        new public IActionResult SignOut()
        {
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }

        [HttpGet("verify")]
        [Authorize]
        public IActionResult AuthOnly()
        {
            return Ok();
        }

        [HttpGet("protected")]
        [Authorize]
        public IActionResult Protected()
        {
            return Ok("You have accessed a protected endpoint.");
        }

        private void SetTokenCookies(TokenResponseDTO tokens)
        {
            var tokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Set to true in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("accessToken", tokens.AccessToken, tokenOptions);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken, tokenOptions);
        }
    }
}