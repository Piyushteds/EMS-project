using EMSmainbackend.Data;
using EMSmainbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Repositories
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly AppDbContext _context;

        public AttendanceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Attendance>> GetAllAsync()
        {
            return await _context.Attendances
                .Include(a => a.Employee)
                .AsNoTracking()
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        public async Task<Attendance?> GetByIdAsync(int id)
        {
            return await _context.Attendances
                .Include(a => a.Employee)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Attendance>> GetByEmployeeIdAsync(
            int employeeId)
        {
            return await _context.Attendances
                .Include(a => a.Employee)
                .Where(a => a.EmployeeId == employeeId)
                .AsNoTracking()
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        public async Task AddAsync(Attendance attendance)
        {
            await _context.Attendances.AddAsync(attendance);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Attendance attendance)
        {
            _context.Attendances.Update(attendance);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Attendance attendance)
        {
            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmployeeExistsAsync(int employeeId)
        {
            return await _context.Employees
                .AnyAsync(e => e.Id == employeeId);
        }
    }
}