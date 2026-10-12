using EMSmainbackend.DTOs.Report;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }


        // ==========================================
        // GET DASHBOARD SUMMARY
        // GET: api/Report/summary
        // ==========================================

        [HttpGet("summary")]
        public async Task<ActionResult<ReportResponseDto>> GetSummary()
        {
            var summary =
                await _reportService.GetSummaryAsync();

            return Ok(summary);
        }
    }
}