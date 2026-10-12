using EMSmainbackend.DTOs.Attendance;

namespace EMSmainbackend.Interfaces
{
    public interface IAttendanceService
    {
        Task<List<AttendanceResponseDto>> GetAllAsync();

        Task<AttendanceResponseDto?> GetByIdAsync(int id);

        Task<List<AttendanceResponseDto>> GetByEmployeeIdAsync(
            int employeeId);

        Task<AttendanceResponseDto> CreateAsync(
            AttendanceCreateDto dto);

        Task<AttendanceResponseDto?> UpdateAsync(
            int id,
            AttendanceCreateDto dto);

        Task<bool> DeleteAsync(int id);
    }
}