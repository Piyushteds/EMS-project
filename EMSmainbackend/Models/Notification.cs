using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        [MaxLength(30)]
        public string Type { get; set; } = "Info";

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User? User { get; set; }
    }
}