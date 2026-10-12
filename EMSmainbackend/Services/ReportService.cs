using EMSmainbackend.Data;
using EMSmainbackend.DTOs.Report;
using EMSmainbackend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ReportResponseDto> GetSummaryAsync()
        {
            var today = DateTime.UtcNow.Date;

            var totalEmployees = await _context.Employees
                .CountAsync();

            var totalDepartments = await _context.Departments
                .CountAsync();

            var presentToday = await _context.Attendances
                .CountAsync(a =>
                    a.Date.Date == today &&
                    a.Status == "Present"
                );

            var pendingLeaves = await _context.LeaveRequests
                .CountAsync(l =>
                    l.Status == "Pending"
                );

            var totalPayroll = await _context.Payrolls
                .SumAsync(p => (decimal?)p.NetSalary) ?? 0;

            var averagePerformance = await _context.Performances
                .AverageAsync(p => (decimal?)p.Score) ?? 0;

            return new ReportResponseDto
            {
                TotalEmployees = totalEmployees,
                TotalDepartments = totalDepartments,
                PresentToday = presentToday,
                PendingLeaves = pendingLeaves,
                TotalPayroll = totalPayroll,
                AveragePerformance = averagePerformance
            };
        }
    }
}