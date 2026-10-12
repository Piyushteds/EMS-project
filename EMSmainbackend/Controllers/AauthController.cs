using EMSmainbackend.DTOs.Auth;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AauthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AauthController(IAuthService authService)
        {
            _authService = authService;
        }


        // ==========================================
        // REGISTER
        // POST: api/auth/register
        // ==========================================

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(
            RegisterDto dto)
        {
            try
            {
                var result = await _authService.RegisterAsync(dto);

                return Ok(result);
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
        // LOGIN
        // POST: api/auth/login
        // ==========================================

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(
            LoginDto dto)
        {
            try
            {
                var result =
                    await _authService.LoginAsync(dto);

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new
                {
                    message = ex.Message
                });
            }
        }
    }
}