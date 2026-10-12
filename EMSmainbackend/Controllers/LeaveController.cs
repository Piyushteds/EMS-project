using EMSmainbackend.DTOs.Leave;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveService _leaveService;

        public LeaveController(ILeaveService leaveService)
        {
            _leaveService = leaveService;
        }


        // ==========================================
        // GET ALL LEAVE REQUESTS
        // GET: api/Leave
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<List<LeaveResponseDto>>> GetAll()
        {
            var leaves = await _leaveService.GetAllAsync();

            return Ok(leaves);
        }


        // ==========================================
        // GET LEAVE BY ID
        // GET: api/Leave/1
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<LeaveResponseDto>> GetById(
            int id)
        {
            try
            {
                var leave = await _leaveService.GetByIdAsync(id);

                return Ok(leave);
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
        // GET LEAVES BY EMPLOYEE
        // GET: api/Leave/employee/1
        // ==========================================

        [HttpGet("employee/{employeeId:int}")]
        public async Task<ActionResult<List<LeaveResponseDto>>> GetByEmployeeId(
            int employeeId)
        {
            var leaves =
                await _leaveService.GetByEmployeeIdAsync(employeeId);

            return Ok(leaves);
        }


        // ==========================================
        // CREATE LEAVE REQUEST
        // POST: api/Leave
        // ==========================================

        [HttpPost]
        public async Task<ActionResult<LeaveResponseDto>> Create(
            LeaveCreateDto dto)
        {
            try
            {
                var leave =
                    await _leaveService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = leave.Id },
                    leave
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
        // UPDATE LEAVE STATUS
        // PUT: api/Leave/1/status
        // ==========================================

        [HttpPut("{id:int}/status")]
        
        public async Task<ActionResult<LeaveResponseDto>> UpdateStatus(
            int id,
            [FromBody] string status)
        {
            try
            {
                var userIdClaim =
                    User.FindFirstValue(
                        ClaimTypes.NameIdentifier
                    );

                if (!int.TryParse(userIdClaim, out int approvedByUserId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user identity."
                    });
                }

                var leave =
                    await _leaveService.UpdateStatusAsync(
                        id,
                        status,
                        approvedByUserId
                    );

                return Ok(leave);
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
        // DELETE LEAVE
        // DELETE: api/Leave/1
        // ==========================================

        [HttpDelete("{id:int}")]
     
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _leaveService.DeleteAsync(id);

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