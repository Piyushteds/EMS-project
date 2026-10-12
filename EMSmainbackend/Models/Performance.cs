using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.Models
{
    public class Performance
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        [Range(0, 100)]
        public decimal Score { get; set; }

        [Required]
        [MaxLength(50)]
        public string ReviewPeriod { get; set; } = string.Empty;

        public int GoalsCompleted { get; set; }

        [MaxLength(1000)]
        public string Comments { get; set; } = string.Empty;

        public int? ReviewedByUserId { get; set; }

        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;

        // Navigation
        public Employee? Employee { get; set; }

        public User? ReviewedByUser { get; set; }
    }
}