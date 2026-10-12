using EMSmainbackend.Data;
using EMSmainbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Repositories
{
    public class PayrollRepository : IPayrollRepository
    {
        private readonly AppDbContext _context;

        public PayrollRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Payroll>> GetAllAsync()
        {
            return await _context.Payrolls
                .Include(p => p.Employee)
                .AsNoTracking()
                .OrderByDescending(p => p.Year)
                .ThenByDescending(p => p.Month)
                .ToListAsync();
        }

        public async Task<Payroll?> GetByIdAsync(int id)
        {
            return await _context.Payrolls
                .Include(p => p.Employee)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Payroll>> GetByEmployeeIdAsync(
            int employeeId)
        {
            return await _context.Payrolls
                .Include(p => p.Employee)
                .Where(p => p.EmployeeId == employeeId)
                .AsNoTracking()
                .OrderByDescending(p => p.Year)
                .ThenByDescending(p => p.Month)
                .ToListAsync();
        }

        public async Task<(List<Payroll> Items, int TotalCount)> GetPagedAsync(
            int pageNumber,
            int pageSize)
        {
            var query = _context.Payrolls
                .Include(p => p.Employee)
                .AsNoTracking()
                .OrderByDescending(p => p.Year)
                .ThenByDescending(p => p.Month)
                .ThenByDescending(p => p.Id);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task AddAsync(Payroll payroll)
        {
            await _context.Payrolls.AddAsync(payroll);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Payroll payroll)
        {
            _context.Payrolls.Update(payroll);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Payroll payroll)
        {
            _context.Payrolls.Remove(payroll);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmployeeExistsAsync(int employeeId)
        {
            return await _context.Employees
                .AnyAsync(e => e.Id == employeeId);
        }
    }
}