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
    public class HeroSlidesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HeroSlidesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HeroSlide>>> GetSlides()
        {
            return await _context.HeroSlides
                .OrderBy(s => s.DisplayOrder)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<HeroSlide>> CreateSlide([FromBody] HeroSlide slide)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (slide.Id == Guid.Empty)
            {
                slide.Id = Guid.NewGuid();
            }

            _context.HeroSlides.Add(slide);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSlides), new { id = slide.Id }, slide);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSlide(Guid id, [FromBody] HeroSlide slide)
        {
            if (id != slide.Id)
            {
                return BadRequest(new { message = "ID eşleşmiyor." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(slide).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.HeroSlides.AnyAsync(s => s.Id == id))
                {
                    return NotFound(new { message = "Slide bulunamadı." });
                }
                throw;
            }

            return Ok(slide);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSlide(Guid id)
        {
            var slide = await _context.HeroSlides.FindAsync(id);
            if (slide == null)
            {
                return NotFound(new { message = "Slide bulunamadı." });
            }

            _context.HeroSlides.Remove(slide);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Slide başarıyla silindi." });
        }
    }
}
