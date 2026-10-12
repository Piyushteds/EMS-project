using EMSmainbackend.Data;
using EMSmainbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Repositories
{
    public class PerformanceRepository : IPerformanceRepository
    {
        private readonly AppDbContext _context;

        public PerformanceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Performance>> GetAllAsync()
        {
            return await _context.Performances
                .Include(p => p.Employee)
                .Include(p => p.ReviewedByUser)
                .AsNoTracking()
                .OrderByDescending(p => p.ReviewDate)
                .ToListAsync();
        }

        public async Task<Performance?> GetByIdAsync(int id)
        {
            return await _context.Performances
                .Include(p => p.Employee)
                .Include(p => p.ReviewedByUser)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Performance>> GetByEmployeeIdAsync(
            int employeeId)
        {
            return await _context.Performances
                .Include(p => p.Employee)
                .Where(p => p.EmployeeId == employeeId)
                .AsNoTracking()
                .OrderByDescending(p => p.ReviewDate)
                .ToListAsync();
        }

        public async Task AddAsync(Performance performance)
        {
            await _context.Performances.AddAsync(performance);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Performance performance)
        {
            _context.Performances.Update(performance);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Performance performance)
        {
            _context.Performances.Remove(performance);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmployeeExistsAsync(int employeeId)
        {
            return await _context.Employees
                .AnyAsync(e => e.Id == employeeId);
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}