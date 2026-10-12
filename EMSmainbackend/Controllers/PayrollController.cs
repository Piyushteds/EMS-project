using EMSmainbackend.DTOs.Payroll;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _payrollService;

        public PayrollController(IPayrollService payrollService)
        {
            _payrollService = payrollService;
        }


        // ==========================================
        // GET PAGINATED PAYROLL RECORDS
        // GET: api/Payroll?pageNumber=1&pageSize=10
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<PayrollPagedResponseDto>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var result =
                await _payrollService.GetPagedAsync(
                    pageNumber,
                    pageSize);

            return Ok(result);
        }


        // ==========================================
        // GET PAYROLL BY ID
        // GET: api/Payroll/1
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PayrollResponseDto>> GetById(
            int id)
        {
            try
            {
                var payroll =
                    await _payrollService.GetByIdAsync(id);

                return Ok(payroll);
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
        // GET PAYROLL BY EMPLOYEE
        // GET: api/Payroll/employee/1
        // ==========================================

        [HttpGet("employee/{employeeId:int}")]
        public async Task<ActionResult<List<PayrollResponseDto>>> GetByEmployeeId(
            int employeeId)
        {
            var payrolls =
                await _payrollService.GetByEmployeeIdAsync(
                    employeeId
                );

            return Ok(payrolls);
        }


        // ==========================================
        // CREATE PAYROLL
        // POST: api/Payroll
        // ==========================================

        [HttpPost]
        public async Task<ActionResult<PayrollResponseDto>> Create(
            PayrollCreateDto dto)
        {
            try
            {
                var payroll =
                    await _payrollService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = payroll.Id },
                    payroll
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
        // UPDATE PAYROLL
        // PUT: api/Payroll/1
        // ==========================================

        [HttpPut("{id:int}")]
        public async Task<ActionResult<PayrollResponseDto>> Update(
            int id,
            PayrollCreateDto dto)
        {
            try
            {
                var payroll =
                    await _payrollService.UpdateAsync(
                        id,
                        dto
                    );

                return Ok(payroll);
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
        // DELETE PAYROLL
        // DELETE: api/Payroll/1
        // ==========================================

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _payrollService.DeleteAsync(id);

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