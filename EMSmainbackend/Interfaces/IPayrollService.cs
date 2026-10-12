using EMSmainbackend.DTOs.Payroll;

namespace EMSmainbackend.Interfaces
{
    public interface IPayrollService
    {
        Task<List<PayrollResponseDto>> GetAllAsync();

        Task<PayrollPagedResponseDto> GetPagedAsync(
            int pageNumber,
            int pageSize);

        Task<PayrollResponseDto?> GetByIdAsync(int id);

        Task<List<PayrollResponseDto>> GetByEmployeeIdAsync(
            int employeeId);

        Task<PayrollResponseDto> CreateAsync(
            PayrollCreateDto dto);

        Task<PayrollResponseDto?> UpdateAsync(
            int id,
            PayrollCreateDto dto);

        Task<bool> DeleteAsync(int id);
    }
}