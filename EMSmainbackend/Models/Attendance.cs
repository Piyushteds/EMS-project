using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.Models
{
    public class Attendance
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public DateTime Date { get; set; }

        public TimeSpan? CheckIn { get; set; }

        public TimeSpan? CheckOut { get; set; }

        [MaxLength(30)]
        public string Status { get; set; } = "Present";

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;

        // Navigation
        public Employee? Employee { get; set; }
    }
}