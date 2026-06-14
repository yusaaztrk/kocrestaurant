using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using KocRestaurant.Server.Data;
using KocRestaurant.Server.Models;

namespace KocRestaurant.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [EnableRateLimiting("contactPolicy")]
        public async Task<IActionResult> SubmitMessage([FromBody] ContactMessage message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Sanitization: Escape HTML tags to protect against XSS injection
            message.FullName = System.Net.WebUtility.HtmlEncode(message.FullName.Trim());
            message.Email = message.Email.Trim().ToLower();
            message.Subject = System.Net.WebUtility.HtmlEncode(message.Subject.Trim());
            message.Message = System.Net.WebUtility.HtmlEncode(message.Message.Trim());
            message.CreatedAt = DateTime.UtcNow;
            message.IsRead = false;

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Mesajınız başarıyla iletildi. Teşekkür ederiz." });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
        {
            return await _context.ContactMessages
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        [HttpPut("{id}/read")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null)
            {
                return NotFound(new { message = "Mesaj bulunamadı." });
            }

            message.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null)
            {
                return NotFound(new { message = "Mesaj bulunamadı." });
            }

            _context.ContactMessages.Remove(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Mesaj başarıyla silindi." });
        }
    }
}
