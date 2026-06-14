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
    public class MenuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenuController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems()
        {
            return await _context.MenuItems
                .Include(m => m.Category)
                .Include(m => m.Attributes)
                .OrderBy(m => m.DisplayOrder)
                .ToListAsync();
        }

        [HttpGet("specials")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetDailySpecials()
        {
            return await _context.MenuItems
                .Include(m => m.Category)
                .Include(m => m.Attributes)
                .Where(m => m.IsDailySpecial)
                .OrderBy(m => m.DisplayOrder)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItem>> GetMenuItem(Guid id)
        {
            var menuItem = await _context.MenuItems
                .Include(m => m.Category)
                .Include(m => m.Attributes)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (menuItem == null)
            {
                return NotFound(new { message = "Yemek bulunamadı." });
            }

            return menuItem;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<MenuItem>> CreateMenuItem([FromBody] MenuItem menuItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verify Category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == menuItem.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Belirtilen kategori mevcut değil." });
            }

            // Check for duplicate name
            var nameExists = await _context.MenuItems
                .AnyAsync(m => m.Name.ToLower() == menuItem.Name.Trim().ToLower());
            if (nameExists)
            {
                return BadRequest(new { message = "Bu isimde bir yemek zaten menüde kayıtlı." });
            }

            // Initialize IDs just in case they aren't set
            menuItem.Id = Guid.NewGuid();
            foreach (var attribute in menuItem.Attributes)
            {
                attribute.Id = Guid.NewGuid();
                attribute.MenuItemId = menuItem.Id;
            }

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            // Reload item to return the full category details
            var created = await _context.MenuItems
                .Include(m => m.Category)
                .Include(m => m.Attributes)
                .FirstAsync(m => m.Id == menuItem.Id);

            return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMenuItem(Guid id, [FromBody] MenuItem menuItem)
        {
            if (id != menuItem.Id)
            {
                return BadRequest(new { message = "Kimlik uyuşmazlığı." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _context.MenuItems
                .FirstOrDefaultAsync(m => m.Id == id);

            if (existing == null)
            {
                return NotFound(new { message = "Yemek bulunamadı." });
            }

            // Verify Category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == menuItem.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Belirtilen kategori mevcut değil." });
            }

            // Check for duplicate name (excluding the current item)
            var nameExists = await _context.MenuItems
                .AnyAsync(m => m.Id != id && m.Name.ToLower() == menuItem.Name.Trim().ToLower());
            if (nameExists)
            {
                return BadRequest(new { message = "Bu isimde bir yemek zaten menüde kayıtlı." });
            }

            // Update fields
            existing.CategoryId = menuItem.CategoryId;
            existing.Name = menuItem.Name;
            existing.Description = menuItem.Description;
            existing.Price = menuItem.Price;
            existing.ImageUrl = menuItem.ImageUrl;
            existing.IsDailySpecial = menuItem.IsDailySpecial;
            existing.IsPopular = menuItem.IsPopular;
            existing.IsAvailable = menuItem.IsAvailable;
            existing.DisplayOrder = menuItem.DisplayOrder;

            // Delete old attributes using ExecuteDeleteAsync
            await _context.MenuItemAttributes
                .Where(a => a.MenuItemId == id)
                .ExecuteDeleteAsync();
            
            // Insert new attributes
            if (menuItem.Attributes != null && menuItem.Attributes.Any())
            {
                var newAttrs = menuItem.Attributes.Select(a => new MenuItemAttribute
                {
                    Id = Guid.NewGuid(),
                    MenuItemId = id,
                    Name = a.Name,
                    Value = a.Value
                }).ToList();
                _context.MenuItemAttributes.AddRange(newAttrs);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenuItemExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            // Reload and return updated item
            var updated = await _context.MenuItems
                .Include(m => m.Category)
                .Include(m => m.Attributes)
                .FirstAsync(m => m.Id == id);

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMenuItem(Guid id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound(new { message = "Yemek bulunamadı." });
            }

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Yemek başarıyla silindi." });
        }

        public class ReorderDto
        {
            public Guid Id { get; set; }
            public int DisplayOrder { get; set; }
        }

        [HttpPut("reorder")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReorderMenuItems([FromBody] List<ReorderDto> items)
        {
            if (items == null || !items.Any())
            {
                return BadRequest(new { message = "Sıralama verisi bulunamadı." });
            }

            var ids = items.Select(i => i.Id).ToList();
            var menuItems = await _context.MenuItems.Where(m => ids.Contains(m.Id)).ToListAsync();

            foreach (var itemDto in items)
            {
                var menuItem = menuItems.FirstOrDefault(m => m.Id == itemDto.Id);
                if (menuItem != null)
                {
                    menuItem.DisplayOrder = itemDto.DisplayOrder;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Menü sıralaması güncellendi." });
        }

        private bool MenuItemExists(Guid id)
        {
            return _context.MenuItems.Any(e => e.Id == id);
        }
    }
}
