using EMSmainbackend.DTOs.Employee;

namespace EMSmainbackend.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeResponseDto>> GetAllAsync();

        Task<EmployeeResponseDto?> GetByIdAsync(int id);

        Task<EmployeeResponseDto> CreateAsync(EmployeeCreateDto dto);

        Task<EmployeeResponseDto?> UpdateAsync(
            int id,
            EmployeeUpdateDto dto);

        Task<bool> DeleteAsync(int id);
    }
}