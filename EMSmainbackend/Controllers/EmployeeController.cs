using EMSmainbackend.DTOs.Employee;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(
            IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }


        // ==========================================
        // GET ALL EMPLOYEES
        // GET: api/Employee
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<List<EmployeeResponseDto>>> GetAll()
        {
            var employees =
                await _employeeService.GetAllAsync();

            return Ok(employees);
        }


        // ==========================================
        // GET EMPLOYEE BY ID
        // GET: api/Employee/1
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<EmployeeResponseDto>> GetById(
            int id)
        {
            try
            {
                var employee =
                    await _employeeService.GetByIdAsync(id);

                return Ok(employee);
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
        // CREATE EMPLOYEE
        // POST: api/Employee
        // ==========================================

        [HttpPost]
      
        public async Task<ActionResult<EmployeeResponseDto>> Create(
            EmployeeCreateDto dto)
        {
            try
            {
                var employee =
                    await _employeeService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = employee.Id },
                    employee
                );
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
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
        // UPDATE EMPLOYEE
        // PUT: api/Employee/1
        // ==========================================

        [HttpPut("{id:int}")]
     
        public async Task<ActionResult<EmployeeResponseDto>> Update(
            int id,
            EmployeeUpdateDto dto)
        {
            try
            {
                var employee =
                    await _employeeService.UpdateAsync(
                        id,
                        dto
                    );

                return Ok(employee);
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
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }


        // ==========================================
        // DELETE EMPLOYEE
        // DELETE: api/Employee/1
        // ==========================================

        [HttpDelete("{id:int}")]
  
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _employeeService.DeleteAsync(id);

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