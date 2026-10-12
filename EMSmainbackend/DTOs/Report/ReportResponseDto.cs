namespace EMSmainbackend.DTOs.Report
{
    public class ReportResponseDto
    {
        public int TotalEmployees { get; set; }

        public int TotalDepartments { get; set; }

        public int PresentToday { get; set; }

        public int PendingLeaves { get; set; }

        public decimal TotalPayroll { get; set; }

        public decimal AveragePerformance { get; set; }
    }
}