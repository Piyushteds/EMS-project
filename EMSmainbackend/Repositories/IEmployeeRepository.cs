using EMSmainbackend.Models;

namespace EMSmainbackend.Repositories
{
    public interface IEmployeeRepository
    {
        Task<List<Employee>> GetAllAsync();

        Task<Employee?> GetByIdAsync(int id);

        Task<Employee?> GetByEmailAsync(string email);

        Task<Employee?> GetByUserIdAsync(int userId);

        Task AddAsync(Employee employee);

        Task UpdateAsync(Employee employee);

        Task UpdatePerformanceScoreAsync(int employeeId, decimal score);

        Task DeleteAsync(Employee employee);

        Task<bool> DepartmentExistsAsync(int departmentId);

        Task<bool> EmailExistsAsync(string email, int? employeeId = null);
    }
}