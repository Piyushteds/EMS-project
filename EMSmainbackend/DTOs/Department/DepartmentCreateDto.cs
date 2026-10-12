using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.DTOs.Department
{
    public class DepartmentCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}