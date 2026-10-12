using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.DTOs.Leave
{
    public class LeaveCreateDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        [MaxLength(50)]
        public string LeaveType { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}