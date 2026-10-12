using EMSmainbackend.DTOs.Performance;

namespace EMSmainbackend.Interfaces
{
    public interface IPerformanceService
    {
        Task<List<PerformanceResponseDto>> GetAllAsync();

        Task<PerformanceResponseDto?> GetByIdAsync(int id);

        Task<List<PerformanceResponseDto>> GetByEmployeeIdAsync(
            int employeeId);

        Task<PerformanceResponseDto> CreateAsync(
            PerformanceCreateDto dto);

        Task<PerformanceResponseDto?> UpdateAsync(
            int id,
            PerformanceCreateDto dto);

        Task<bool> DeleteAsync(int id);
    }
}