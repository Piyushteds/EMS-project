using EMSmainbackend.Models;

namespace EMSmainbackend.Repositories
{
    public interface ILeaveRepository
    {
        Task<List<LeaveRequest>> GetAllAsync();

        Task<LeaveRequest?> GetByIdAsync(int id);

        Task<List<LeaveRequest>> GetByEmployeeIdAsync(int employeeId);

        Task AddAsync(LeaveRequest leaveRequest);

        Task UpdateAsync(LeaveRequest leaveRequest);

        Task DeleteAsync(LeaveRequest leaveRequest);

        Task<bool> EmployeeExistsAsync(int employeeId);
    }
}