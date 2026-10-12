using EMSmainbackend.Data;
using EMSmainbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Repositories
{
    public class LeaveRepository : ILeaveRepository
    {
        private readonly AppDbContext _context;

        public LeaveRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<LeaveRequest>> GetAllAsync()
        {
            return await _context.LeaveRequests
                .Include(l => l.Employee)
                .Include(l => l.ApprovedByUser)
                .AsNoTracking()
                .OrderByDescending(l => l.AppliedAt)
                .ToListAsync();
        }

        public async Task<LeaveRequest?> GetByIdAsync(int id)
        {
            return await _context.LeaveRequests
                .Include(l => l.Employee)
                .Include(l => l.ApprovedByUser)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<List<LeaveRequest>> GetByEmployeeIdAsync(
            int employeeId)
        {
            return await _context.LeaveRequests
                .Include(l => l.Employee)
                .Where(l => l.EmployeeId == employeeId)
                .AsNoTracking()
                .OrderByDescending(l => l.AppliedAt)
                .ToListAsync();
        }

        public async Task AddAsync(LeaveRequest leaveRequest)
        {
            await _context.LeaveRequests.AddAsync(leaveRequest);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(LeaveRequest leaveRequest)
        {
            _context.LeaveRequests.Update(leaveRequest);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(LeaveRequest leaveRequest)
        {
            _context.LeaveRequests.Remove(leaveRequest);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmployeeExistsAsync(int employeeId)
        {
            return await _context.Employees
                .AnyAsync(e => e.Id == employeeId);
        }
    }
}