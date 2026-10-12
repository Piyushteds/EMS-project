namespace EMSmainbackend.DTOs.Employee
{
    public class EmployeeResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Position { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public DateTime JoinDate { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public decimal Salary { get; set; }

        public string Status { get; set; } = string.Empty;

        public decimal PerformanceScore { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; } = string.Empty;

        public int? UserId { get; set; }
    }
}