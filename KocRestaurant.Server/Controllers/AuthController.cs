using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using KocRestaurant.Server.Data;
using KocRestaurant.Server.Models;

namespace KocRestaurant.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public class LoginDto
        {
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        [EnableRateLimiting("loginPolicy")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Kullanıcı adı, e-posta ve şifre zorunludur." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => 
                u.Username.ToLower() == dto.Username.ToLower() && 
                u.Email.ToLower() == dto.Email.ToLower());
                
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                stopwatch.Stop();
                var elapsedMs = stopwatch.ElapsedMilliseconds;
                if (elapsedMs < 200)
                {
                    await Task.Delay((int)(200 - elapsedMs));
                }
                return Unauthorized(new { message = "Geçersiz giriş bilgileri." });
            }

            var token = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken();

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var refreshExpiryDays = jwtSettings.GetValue<int>("RefreshTokenExpiryDays");

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshExpiryDays);
            await _context.SaveChangesAsync();

            SetRefreshTokenCookie(refreshToken, refreshExpiryDays);

            stopwatch.Stop();
            var totalElapsedMs = stopwatch.ElapsedMilliseconds;
            if (totalElapsedMs < 200)
            {
                await Task.Delay((int)(200 - totalElapsedMs));
            }

            return Ok(new
            {
                token,
                username = user.Username,
                role = user.Role
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return BadRequest(new { message = "Yenileme belirteci bulunamadı." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Unauthorized(new { message = "Oturum süreniz dolmuş veya geçersiz. Lütfen tekrar giriş yapın." });
            }

            var newAccessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var refreshExpiryDays = jwtSettings.GetValue<int>("RefreshTokenExpiryDays");

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshExpiryDays);
            await _context.SaveChangesAsync();

            SetRefreshTokenCookie(newRefreshToken, refreshExpiryDays);

            return Ok(new
            {
                token = newAccessToken,
                username = user.Username,
                role = user.Role
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
                if (user != null)
                {
                    user.RefreshToken = string.Empty;
                    user.RefreshTokenExpiryTime = null;
                    await _context.SaveChangesAsync();
                }
            }

            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax
            });

            return Ok(new { message = "Başarıyla çıkış yapıldı." });
        }

        private string GenerateAccessToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secret = jwtSettings.GetValue<string>("Secret");
            var issuer = jwtSettings.GetValue<string>("Issuer");
            var audience = jwtSettings.GetValue<string>("Audience");
            var expiryMinutes = jwtSettings.GetValue<int>("ExpiryMinutes");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private void SetRefreshTokenCookie(string refreshToken, int expiryDays)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps, // Dynamically match connection security
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(expiryDays),
                Path = "/" // Accessible on entire domain
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
