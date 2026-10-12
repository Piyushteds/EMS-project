using EMSmainbackend.DTOs.Auth;

namespace EMSmainbackend.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto dto);

        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    }
}