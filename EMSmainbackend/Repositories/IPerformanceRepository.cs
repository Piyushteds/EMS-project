using EMSmainbackend.Models;

namespace EMSmainbackend.Repositories
{
    public interface IPerformanceRepository
    {
        Task<List<Performance>> GetAllAsync();

        Task<Performance?> GetByIdAsync(int id);

        Task<List<Performance>> GetByEmployeeIdAsync(int employeeId);

        Task AddAsync(Performance performance);

        Task UpdateAsync(Performance performance);

        Task DeleteAsync(Performance performance);

        Task<bool> EmployeeExistsAsync(int employeeId);

        Task<User?> GetUserByIdAsync(int userId);
    }
}