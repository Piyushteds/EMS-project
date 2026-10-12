using EMSmainbackend.Data;
using EMSmainbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;

        public EmployeeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Employee>> GetAllAsync()
        {
            return await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.User)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Employee?> GetByEmailAsync(string email)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == email);
        }

        public async Task<Employee?> GetByUserIdAsync(int userId)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.UserId == userId);
        }

        public async Task AddAsync(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePerformanceScoreAsync( int employeeId,decimal score)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == employeeId);

            if (employee == null)
            {
                return;
            }

            employee.PerformanceScore = score;

            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Employee employee)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DepartmentExistsAsync(int departmentId)
        {
            return await _context.Departments
                .AnyAsync(d => d.Id == departmentId);
        }

        public async Task<bool> EmailExistsAsync(
            string email,
            int? employeeId = null)
        {
            return await _context.Employees
                .AnyAsync(e =>
                    e.Email == email &&
                    (!employeeId.HasValue || e.Id != employeeId.Value));
        }
    }
}