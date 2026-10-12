using EMSmainbackend.Models;

namespace EMSmainbackend.Repositories
{
    public interface IDepartmentRepository
    {
        Task<List<Department>> GetAllAsync();

        Task<Department?> GetByIdAsync(int id);

        Task AddAsync(Department department);

        Task UpdateAsync(Department department);

        Task DeleteAsync(Department department);

        Task<bool> NameExistsAsync(string name, int? departmentId = null);
    }
}