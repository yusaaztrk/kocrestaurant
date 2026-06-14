using System;
using System.ComponentModel.DataAnnotations;

namespace KocRestaurant.Server.Models
{
    public class Settings
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(150)]
        public string RestaurantName { get; set; } = "Koç Restaurant";

        [MaxLength(300)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(150)]
        public string WorkingHours { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string LogoUrl { get; set; } = string.Empty;

        [MaxLength(300)]
        public string FacebookUrl { get; set; } = string.Empty;

        [MaxLength(300)]
        public string InstagramUrl { get; set; } = string.Empty;

        [MaxLength(200)]
        public string AboutTitle { get; set; } = "Koç Restaurant Hikayesi";

        [MaxLength(2000)]
        public string AboutText { get; set; } = string.Empty;

        [MaxLength(4000)]
        public string AboutImages { get; set; } = string.Empty;
    }
}
