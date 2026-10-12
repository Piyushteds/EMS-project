
using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.DTOs.Employee
{
    public class EmployeeCreateDto
    {
        [Required(ErrorMessage = "Employee name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email address.")]
        [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "Phone cannot exceed 20 characters.")]
        public string Phone { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Position cannot exceed 100 characters.")]
        public string Position { get; set; } = string.Empty;

        [StringLength(250, ErrorMessage = "Address cannot exceed 250 characters.")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Join date is required.")]
        public DateTime JoinDate { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [Range(
            typeof(decimal),
            "0",
            "9999999999999999.99",
            ErrorMessage = "Salary must be a non-negative amount within the supported range."
        )]
        public decimal Salary { get; set; }

        [Range(
            typeof(decimal),
            "0",
            "100",
            ErrorMessage = "Performance score must be between 0 and 100."
        )]
        public decimal PerformanceScore { get; set; } = 0;

        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid department.")]
        public int DepartmentId { get; set; }

        public int? UserId { get; set; }
    }
}