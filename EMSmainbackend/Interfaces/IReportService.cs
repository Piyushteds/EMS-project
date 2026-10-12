using EMSmainbackend.DTOs.Report;

namespace EMSmainbackend.Interfaces
{
    public interface IReportService
    {
        Task<ReportResponseDto> GetSummaryAsync();
    }
}