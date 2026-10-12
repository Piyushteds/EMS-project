namespace EMSmainbackend.DTOs.Performance
{
    public class PerformanceResponseDto
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public string EmployeeName { get; set; } = string.Empty;

        public decimal Score { get; set; }

        public string ReviewPeriod { get; set; } = string.Empty;

        public int GoalsCompleted { get; set; }

        public string Comments { get; set; } = string.Empty;

        public int? ReviewedByUserId { get; set; }

        public DateTime ReviewDate { get; set; }
    }
}