using EMSmainbackend.Models;

namespace EMSmainbackend.Repositories
{
    public interface IAttendanceRepository
    {
        Task<List<Attendance>> GetAllAsync();

        Task<Attendance?> GetByIdAsync(int id);

        Task<List<Attendance>> GetByEmployeeIdAsync(int employeeId);

        Task AddAsync(Attendance attendance);

        Task UpdateAsync(Attendance attendance);

        Task DeleteAsync(Attendance attendance);

        Task<bool> EmployeeExistsAsync(int employeeId);
    }
}