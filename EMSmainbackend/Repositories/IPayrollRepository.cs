using EMSmainbackend.Models;

namespace EMSmainbackend.Repositories
{
    public interface IPayrollRepository
    {
        Task<List<Payroll>> GetAllAsync();

        Task<Payroll?> GetByIdAsync(int id);

        Task<List<Payroll>> GetByEmployeeIdAsync(int employeeId);

        Task AddAsync(Payroll payroll);

        Task UpdateAsync(Payroll payroll);

        Task DeleteAsync(Payroll payroll);

        Task<bool> EmployeeExistsAsync(int employeeId);

        Task<(List<Payroll> Items, int TotalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize);
    }
}