using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMSmainbackend.Models
{
    public class Employee
    {
        public int Id { get; set; }

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

        [Column(TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; }

        [MaxLength(30)]
        public string Status { get; set; } = "Active";

        public decimal PerformanceScore { get; set; } = 0;

        // Department relationship
        public int DepartmentId { get; set; }

        public Department? Department { get; set; }

        // Login account relationship
        public int? UserId { get; set; }

        public User? User { get; set; }

        // Navigation
        public ICollection<Attendance> Attendances { get; set; }
            = new List<Attendance>();

        public ICollection<LeaveRequest> LeaveRequests { get; set; }
            = new List<LeaveRequest>();

        public ICollection<Payroll> Payrolls { get; set; }
            = new List<Payroll>();

        public ICollection<Performance> Performances { get; set; }
            = new List<Performance>();
    }
}