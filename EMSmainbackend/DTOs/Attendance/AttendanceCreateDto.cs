using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.DTOs.Attendance
{
    public class AttendanceCreateDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public TimeSpan? CheckIn { get; set; }

        public TimeSpan? CheckOut { get; set; }

        [MaxLength(30)]
        public string Status { get; set; } = "Present";

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}