using EMSmainbackend.DTOs.Department;

namespace EMSmainbackend.Interfaces
{
    public interface IDepartmentService
    {
        Task<List<DepartmentResponseDto>> GetAllAsync();

        Task<DepartmentResponseDto?> GetByIdAsync(int id);

        Task<DepartmentResponseDto> CreateAsync(
            DepartmentCreateDto dto);

        Task<DepartmentResponseDto?> UpdateAsync(
            int id,
            DepartmentUpdateDto dto);

        Task<bool> DeleteAsync(int id);
    }
}