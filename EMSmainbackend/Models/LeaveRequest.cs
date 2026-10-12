using System.ComponentModel.DataAnnotations;

namespace EMSmainbackend.Models
{
    public class LeaveRequest
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        [Required]
        [MaxLength(50)]
        public string LeaveType { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(30)]
        public string Status { get; set; } = "Pending";

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public int? ApprovedByUserId { get; set; }

        // Navigation
        public Employee? Employee { get; set; }

        public User? ApprovedByUser { get; set; }
    }
}