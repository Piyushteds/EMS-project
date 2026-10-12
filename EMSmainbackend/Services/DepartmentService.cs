using EMSmainbackend.DTOs.Department;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Models;
using EMSmainbackend.Repositories;

namespace EMSmainbackend.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(
            IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }


        // ==========================================
        // GET ALL DEPARTMENTS
        // ==========================================

        public async Task<List<DepartmentResponseDto>> GetAllAsync()
        {
            var departments =
                await _departmentRepository.GetAllAsync();

            return departments
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // GET DEPARTMENT BY ID
        // ==========================================

        public async Task<DepartmentResponseDto?> GetByIdAsync(int id)
        {
            var department =
                await _departmentRepository.GetByIdAsync(id);

            if (department == null)
            {
                return null;
            }

            return MapToResponseDto(department);
        }


        // ==========================================
        // CREATE DEPARTMENT
        // ==========================================

        public async Task<DepartmentResponseDto> CreateAsync(
            DepartmentCreateDto dto)
        {
            // Check duplicate department name
            var nameExists =
                await _departmentRepository
                    .NameExistsAsync(dto.Name);

            if (nameExists)
            {
                throw new ArgumentException(
                    "A department with this name already exists."
                );
            }


            // Create Department Model
            var department = new Department
            {
                Name = dto.Name.Trim(),

                Description = dto.Description.Trim(),

                IsActive = true,

                CreatedAt = DateTime.UtcNow
            };


            // Save
            await _departmentRepository.AddAsync(department);


            // Get saved department
            var savedDepartment =
                await _departmentRepository.GetByIdAsync(
                    department.Id);

            if (savedDepartment == null)
            {
                throw new InvalidOperationException(
                    "Department could not be retrieved after creation."
                );
            }

            return MapToResponseDto(savedDepartment);
        }


        // ==========================================
        // UPDATE DEPARTMENT
        // ==========================================

        public async Task<DepartmentResponseDto?> UpdateAsync(
            int id,
            DepartmentUpdateDto dto)
        {
            var department =
                await _departmentRepository.GetByIdAsync(id);

            if (department == null)
            {
                return null;
            }


            // Check duplicate name
            var nameExists =
                await _departmentRepository
                    .NameExistsAsync(dto.Name, id);

            if (nameExists)
            {
                throw new ArgumentException(
                    "Another department already uses this name."
                );
            }


            // Update
            department.Name = dto.Name.Trim();

            department.Description =
                dto.Description.Trim();

            department.IsActive = dto.IsActive;


            await _departmentRepository.UpdateAsync(
                department);


            // Get updated department
            var updatedDepartment =
                await _departmentRepository.GetByIdAsync(id);

            if (updatedDepartment == null)
            {
                return null;
            }

            return MapToResponseDto(updatedDepartment);
        }


        // ==========================================
        // DELETE DEPARTMENT
        // ==========================================

        public async Task<bool> DeleteAsync(int id)
        {
            var department =
                await _departmentRepository.GetByIdAsync(id);

            if (department == null)
            {
                return false;
            }


            // Do not delete department
            // if employees are assigned to it.
            if (department.Employees.Any())
            {
                throw new InvalidOperationException(
                    "Department cannot be deleted because employees are assigned to it."
                );
            }


            await _departmentRepository.DeleteAsync(
                department);

            return true;
        }


        // ==========================================
        // MODEL → RESPONSE DTO
        // ==========================================

        private static DepartmentResponseDto MapToResponseDto(
            Department department)
        {
            return new DepartmentResponseDto
            {
                Id = department.Id,

                Name = department.Name,

                Description = department.Description,

                IsActive = department.IsActive,

                CreatedAt = department.CreatedAt,

                EmployeeCount =
                    department.Employees?.Count ?? 0
            };
        }
    }
}