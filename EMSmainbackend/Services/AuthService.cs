using Microsoft.EntityFrameworkCore;
using EMSmainbackend.Data;
using EMSmainbackend.DTOs.Auth;
using EMSmainbackend.Helpers;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Models;
using EMSmainbackend.Repositories;

namespace EMSmainbackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(
            IEmployeeRepository employeeRepository,
            AppDbContext context,
            JwtHelper jwtHelper)
        {
            _employeeRepository = employeeRepository;
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDto> RegisterAsync(
            RegisterDto dto)
        {
            var email = dto.Email.Trim().ToLower();

            var existingUser = await _context.Users
               .FirstOrDefaultAsync(u => u.Email == email);

            if (existingUser != null)
            {
                throw new InvalidOperationException(
                    "A user with this email already exists."
                );
            }

            var existingEmployee =
                await _employeeRepository.GetByEmailAsync(email);

            if (existingEmployee != null)
            {
                throw new InvalidOperationException(
                    "An employee with this email already exists."
                );
            }

            var user = new User
            {
                FullName = dto.FullName.Trim(),
                Email = email,
                PasswordHash = PasswordHelper.HashPassword(
                    dto.Password
                ),
                Role = string.IsNullOrWhiteSpace(dto.Role)
                    ? "Employee"
                    : dto.Role.Trim(),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            var tokenResult = _jwtHelper.GenerateToken(user);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = tokenResult.Token,
                ExpiresAt = tokenResult.ExpiresAt
            };
        }

        public async Task<AuthResponseDto> LoginAsync(
            LoginDto dto)
        {
            var email = dto.Email.Trim().ToLower();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                throw new UnauthorizedAccessException(
                    "Invalid email or password."
                );
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException(
                    "Your account is inactive."
                );
            }

            var passwordValid =
                PasswordHelper.VerifyPassword(
                    dto.Password,
                    user.PasswordHash
                );

            if (!passwordValid)
            {
                throw new UnauthorizedAccessException(
                    "Invalid email or password."
                );
            }

            var tokenResult =
                _jwtHelper.GenerateToken(user);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = tokenResult.Token,
                ExpiresAt = tokenResult.ExpiresAt
            };
        }
    }
}