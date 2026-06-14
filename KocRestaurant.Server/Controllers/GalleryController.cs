using System;
using System.Collections.Generic;
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
    public class GalleryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GalleryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GalleryItem>>> GetGalleryItems()
        {
            return await _context.GalleryItems
                .OrderBy(g => g.DisplayOrder)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GalleryItem>> GetGalleryItem(Guid id)
        {
            var item = await _context.GalleryItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = "Galeri öğesi bulunamadı." });
            }
            return item;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GalleryItem>> CreateGalleryItem([FromBody] GalleryItem item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.GalleryItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGalleryItem), new { id = item.Id }, item);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteGalleryItem(Guid id)
        {
            var item = await _context.GalleryItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = "Galeri öğesi bulunamadı." });
            }

            _context.GalleryItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Galeri öğesi başarıyla silindi." });
        }
    }
}
