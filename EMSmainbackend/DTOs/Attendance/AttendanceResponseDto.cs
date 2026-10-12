namespace EMSmainbackend.DTOs.Attendance
{
    public class AttendanceResponseDto
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public string EmployeeName { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        public TimeSpan? CheckIn { get; set; }

        public TimeSpan? CheckOut { get; set; }

        public string Status { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;
    }
}