using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KocRestaurant.Server.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "Admin";

        [MaxLength(255)]
        [JsonIgnore]
        public string RefreshToken { get; set; } = string.Empty;

        [JsonIgnore]
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
