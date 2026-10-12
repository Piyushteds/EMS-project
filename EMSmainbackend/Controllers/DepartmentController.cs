using EMSmainbackend.DTOs.Department;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(
            IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }


        // ==========================================
        // GET ALL DEPARTMENTS
        // GET: api/Department
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<List<DepartmentResponseDto>>> GetAll()
        {
            var departments =
                await _departmentService.GetAllAsync();

            return Ok(departments);
        }


        // ==========================================
        // GET DEPARTMENT BY ID
        // GET: api/Department/1
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<DepartmentResponseDto>> GetById(
            int id)
        {
            try
            {
                var department =
                    await _departmentService.GetByIdAsync(id);

                return Ok(department);
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
        // CREATE DEPARTMENT
        // POST: api/Department
        // ==========================================

        [HttpPost]
        
        public async Task<ActionResult<DepartmentResponseDto>> Create(
            DepartmentCreateDto dto)
        {
            try
            {
                var department =
                    await _departmentService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = department.Id },
                    department
                );
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
        // UPDATE DEPARTMENT
        // PUT: api/Department/1
        // ==========================================

        [HttpPut("{id:int}")]
        public async Task<ActionResult<DepartmentResponseDto>> Update(
            int id,
            DepartmentUpdateDto dto)
        {
            try
            {
                var department =
                    await _departmentService.UpdateAsync(
                        id,
                        dto
                    );

                return Ok(department);
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
        // DELETE DEPARTMENT
        // DELETE: api/Department/1
        // ==========================================

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _departmentService.DeleteAsync(id);

                return NoContent();
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
    }
}