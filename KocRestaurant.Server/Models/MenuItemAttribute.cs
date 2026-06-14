using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KocRestaurant.Server.Models
{
    public class MenuItemAttribute
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid MenuItemId { get; set; }

        [ForeignKey("MenuItemId")]
        [JsonIgnore]
        public virtual MenuItem? MenuItem { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // e.g. "Porsiyon", "İçindekiler"

        [Required]
        [MaxLength(500)]
        public string Value { get; set; } = string.Empty; // e.g. "200gr", "Domates, Marul, Soğan"
    }
}
