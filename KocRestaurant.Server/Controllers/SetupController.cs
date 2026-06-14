using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KocRestaurant.Server.Data;
using KocRestaurant.Server.Models;

namespace KocRestaurant.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SetupController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SetupController(AppDbContext context)
        {
            _context = context;
        }

        public class CreateAdminDto
        {
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                {
                    return BadRequest(new { message = "Kullanıcı adı, e-posta ve şifre zorunludur." });
                }

                // Lock this endpoint if there is ALREADY any user in the database
                var hasAnyUser = await _context.Users.AnyAsync();
                if (hasAnyUser)
                {
                    return BadRequest(new { message = "Sistemde zaten kayıtlı yönetici hesabı bulunmaktadır. Bu işlem engellenmiştir." });
                }

                var adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Username = dto.Username.Trim(),
                    Email = dto.Email.Trim().ToLower(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, 12),
                    Role = "Admin"
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Yönetici hesabı başarıyla oluşturuldu. Şimdi bu bilgilerle giriş yapabilirsiniz." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = $"Veritabanı veya sunucu hatası: {ex.Message} {(ex.InnerException != null ? "-> " + ex.InnerException.Message : "")}" 
                });
            }
        }
    }
}
