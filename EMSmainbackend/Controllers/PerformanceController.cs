using EMSmainbackend.DTOs.Performance;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PerformanceController : ControllerBase
    {
        private readonly IPerformanceService _performanceService;

        public PerformanceController(
            IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }


        // ==========================================
        // GET ALL PERFORMANCE RECORDS
        // GET: api/Performance
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<List<PerformanceResponseDto>>> GetAll()
        {
            var performances =
                await _performanceService.GetAllAsync();

            return Ok(performances);
        }


        // ==========================================
        // GET PERFORMANCE BY ID
        // GET: api/Performance/1
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PerformanceResponseDto>> GetById(
            int id)
        {
            try
            {
                var performance =
                    await _performanceService.GetByIdAsync(id);

                return Ok(performance);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }


        // ==========================================
        // GET PERFORMANCE BY EMPLOYEE
        // GET: api/Performance/employee/1
        // ==========================================

        [HttpGet("employee/{employeeId:int}")]
        public async Task<ActionResult<List<PerformanceResponseDto>>> GetByEmployeeId(
            int employeeId)
        {
            var performances =
                await _performanceService.GetByEmployeeIdAsync(
                    employeeId
                );

            return Ok(performances);
        }


        // ==========================================
        // CREATE PERFORMANCE
        // POST: api/Performance
        // ==========================================

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PerformanceResponseDto>> Create(
            PerformanceCreateDto dto)
        {
            try
            {
                var performance =
                    await _performanceService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = performance.Id },
                    performance
                );
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        // ==========================================
        // UPDATE PERFORMANCE
        // PUT: api/Performance/1
        // ==========================================

        [HttpPut("{id:int}")]
        
        public async Task<ActionResult<PerformanceResponseDto>> Update(
            int id,
            PerformanceCreateDto dto)
        {
            try
            {
                var performance =
                    await _performanceService.UpdateAsync(
                        id,
                        dto
                    );

                return Ok(performance);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        // ==========================================
        // DELETE PERFORMANCE
        // DELETE: api/Performance/1
        // ==========================================

        [HttpDelete("{id:int}")]
     
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _performanceService.DeleteAsync(id);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }
    }
}