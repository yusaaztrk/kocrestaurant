using System;
using System.ComponentModel.DataAnnotations;

namespace KocRestaurant.Server.Models
{
    public class GalleryItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(1000)]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Caption { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = "General"; // e.g. "Food", "Interior", "Events"

        public int DisplayOrder { get; set; } = 0;
    }
}
