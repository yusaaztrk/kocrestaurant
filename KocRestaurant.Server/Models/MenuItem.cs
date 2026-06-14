using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KocRestaurant.Server.Models
{
    public class MenuItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(1000)]
        public string ImageUrl { get; set; } = string.Empty;

        public bool IsDailySpecial { get; set; } = false;

        public bool IsAvailable { get; set; } = true;

        public bool IsPopular { get; set; } = false;

        public int DisplayOrder { get; set; } = 0;

        public virtual ICollection<MenuItemAttribute> Attributes { get; set; } = new List<MenuItemAttribute>();
    }
}
