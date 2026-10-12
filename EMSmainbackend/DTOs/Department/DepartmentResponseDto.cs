namespace EMSmainbackend.DTOs.Department
{
    public class DepartmentResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public int EmployeeCount { get; set; }
    }
}