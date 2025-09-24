using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpGet("refresh")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken()
        {
            var result = await authService.RefreshTokensAsync();
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
                return Unauthorized("Invalid refresh token");

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(1),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("accessToken", result.AccessToken, cookieOptions);

            cookieOptions.Expires = DateTime.UtcNow.AddDays(7);

            Response.Cookies.Append("refreshToken", result.RefreshToken, cookieOptions);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("verify")]
        public ActionResult<string> Test()
        {
            return "You are authorized";
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDto request)
        {
            var user = await _authService.RegisterAsync(request);

            if (user == null)
            {
                return BadRequest("Username or email already exists.");
            }

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginDto request)
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return BadRequest("Invalid username/email or password.");
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(1),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("accessToken", result.AccessToken, cookieOptions);

            cookieOptions.Expires = DateTime.UtcNow.AddDays(7);

            Response.Cookies.Append("refreshToken", result.RefreshToken, cookieOptions);

            return Ok("Login Successful");
        }

        [HttpPost("logout")]
        public ActionResult Logout()
        {
            Response.Cookies.Delete("accessToken");
            return Ok("Logout Successful");
        }
    }
}
