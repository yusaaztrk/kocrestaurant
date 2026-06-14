using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KocRestaurant.Server.Data;
using KocRestaurant.Server.Models;

namespace KocRestaurant.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Settings>> GetSettings()
        {
            var settings = await _context.Settings.FirstOrDefaultAsync();
            if (settings == null)
            {
                // Fallback in case seed didn't run or table is empty
                settings = new Settings
                {
                    RestaurantName = "KOÇ RESTAURANT",
                    Address = "Etiler, Nispetiye Cad. No: 12, İstanbul",
                    Phone = "+90 (212) 555 01 01",
                    Email = "rezervasyon@kocrestaurant.com",
                    WorkingHours = "12:00 - 00:00"
                };
                _context.Settings.Add(settings);
                await _context.SaveChangesAsync();
            }
            return settings;
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSettings([FromBody] Settings settings)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _context.Settings.FirstOrDefaultAsync();
            if (existing == null)
            {
                _context.Settings.Add(settings);
            }
            else
            {
                existing.RestaurantName = settings.RestaurantName;
                existing.Address = settings.Address;
                existing.Phone = settings.Phone;
                existing.Email = settings.Email;
                existing.WorkingHours = settings.WorkingHours;
                existing.LogoUrl = settings.LogoUrl;
                existing.FacebookUrl = settings.FacebookUrl;
                existing.InstagramUrl = settings.InstagramUrl;
                existing.AboutTitle = settings.AboutTitle;
                existing.AboutText = settings.AboutText;
                existing.AboutImages = settings.AboutImages;
            }

            await _context.SaveChangesAsync();
            return Ok(existing ?? settings);
        }
    }
}
