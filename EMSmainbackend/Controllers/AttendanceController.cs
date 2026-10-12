using EMSmainbackend.DTOs.Attendance;
using EMSmainbackend.DTOs.Auth;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(
            IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }


        // ==========================================
        // GET ALL ATTENDANCE
        // GET: api/Attendance
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<List<AttendanceResponseDto>>> GetAll()
        {
            var attendance =
                await _attendanceService.GetAllAsync();

            return Ok(attendance);
        }


        // ==========================================
        // GET ATTENDANCE BY ID
        // GET: api/Attendance/1
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<AttendanceResponseDto>> GetById(
            int id)
        {
            try
            {
                var attendance =
                    await _attendanceService.GetByIdAsync(id);

                return Ok(attendance);
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
        // GET ATTENDANCE BY EMPLOYEE
        // GET: api/Attendance/employee/1
        // ==========================================

        [HttpGet("employee/{employeeId:int}")]
        public async Task<ActionResult<List<AttendanceResponseDto>>> GetByEmployeeId(
            int employeeId)
        {
            var attendance =
                await _attendanceService.GetByEmployeeIdAsync(
                    employeeId
                );

            return Ok(attendance);
        }


        // ==========================================
        // CREATE ATTENDANCE
        // POST: api/Attendance
        // ==========================================

        [HttpPost]
        
        public async Task<ActionResult<AttendanceResponseDto>> Create(
            AttendanceCreateDto dto)
        {
            try
            {
                var attendance =
                    await _attendanceService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = attendance.Id },
                    attendance
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
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }


        // ==========================================
        // UPDATE ATTENDANCE
        // PUT: api/Attendance/1
        // ==========================================

        [HttpPut("{id:int}")]
      
        public async Task<ActionResult<AttendanceResponseDto>> Update(
            int id,
            AttendanceCreateDto dto)
        {
            try
            {
                var attendance =
                    await _attendanceService.UpdateAsync(
                        id,
                        dto
                    );

                return Ok(attendance);
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
        // DELETE ATTENDANCE
        // DELETE: api/Attendance/1
        // ==========================================

        [HttpDelete("{id:int}")]
     
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _attendanceService.DeleteAsync(id);

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