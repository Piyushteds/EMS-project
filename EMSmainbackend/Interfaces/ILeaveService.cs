using EMSmainbackend.DTOs.Leave;

namespace EMSmainbackend.Interfaces
{
    public interface ILeaveService
    {
        Task<List<LeaveResponseDto>> GetAllAsync();

        Task<LeaveResponseDto?> GetByIdAsync(int id);

        Task<List<LeaveResponseDto>> GetByEmployeeIdAsync(
            int employeeId);

        Task<LeaveResponseDto> CreateAsync(
            LeaveCreateDto dto);

        Task<LeaveResponseDto?> UpdateStatusAsync(
            int id,
            string status,
            int? approvedByUserId);

        Task<bool> DeleteAsync(int id);
    }
}