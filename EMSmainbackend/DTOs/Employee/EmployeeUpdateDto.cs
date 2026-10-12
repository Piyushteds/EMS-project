using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.DTOs.Employee
{
    public class EmployeeUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Position { get; set; } = string.Empty;

        [MaxLength(250)]
        public string Address { get; set; } = string.Empty;

        public DateTime JoinDate { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public decimal Salary { get; set; }

        [MaxLength(30)]
        public string Status { get; set; } = "Active";

        [Range(
          typeof(decimal),
          "0",
          "100",
           ErrorMessage = "Performance score must be between 0 and 100."
        )]
        public decimal PerformanceScore { get; set; }

        public int DepartmentId { get; set; }

        public int? UserId { get; set; }
    }
}