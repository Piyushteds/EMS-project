
using EMSmainbackend.DTOs.Employee;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Models;
using EMSmainbackend.Repositories;

namespace EMSmainbackend.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(
            IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        // ==========================================
        // GET ALL EMPLOYEES
        // ==========================================

        public async Task<List<EmployeeResponseDto>> GetAllAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();

            return employees
                .Select(MapToResponseDto)
                .ToList();
        }

        // ==========================================
        // GET EMPLOYEE BY ID
        // ==========================================

        public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
        {
            var employee =
                await _employeeRepository.GetByIdAsync(id);

            return employee == null
                ? null
                : MapToResponseDto(employee);
        }

        // ==========================================
        // CREATE EMPLOYEE
        // ==========================================

        public async Task<EmployeeResponseDto> CreateAsync(
            EmployeeCreateDto dto)
        {
            // Validate required text fields.
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException(
                    "Employee name is required."
                );
            }

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new ArgumentException(
                    "Employee email is required."
                );
            }

            // Validate salary.
            if (dto.Salary < 0 ||
                dto.Salary > 9999999999999999.99m)
            {
                throw new ArgumentException(
                    "Salary must be a non-negative amount within the supported range."
                );
            }

            // Validate performance score.
            if (dto.PerformanceScore < 0 ||
                dto.PerformanceScore > 100)
            {
                throw new ArgumentException(
                    "Performance score must be between 0 and 100."
                );
            }

            // Validate department ID.
            if (dto.DepartmentId <= 0)
            {
                throw new ArgumentException(
                    "Please select a valid department."
                );
            }

            // Normalize email before checking duplicates.
            var email = dto.Email.Trim().ToLowerInvariant();

            // Check department.
            var departmentExists =
                await _employeeRepository
                    .DepartmentExistsAsync(dto.DepartmentId);

            if (!departmentExists)
            {
                throw new ArgumentException(
                    "The selected department does not exist."
                );
            }

            // Check duplicate email.
            var emailExists =
                await _employeeRepository
                    .EmailExistsAsync(email);

            if (emailExists)
            {
                throw new ArgumentException(
                    "An employee with this email already exists."
                );
            }

            // Create Employee Model.
            var employee = new Employee
            {
                Name = dto.Name.Trim(),
                Email = email,
                Phone = dto.Phone?.Trim() ?? string.Empty,
                Position = dto.Position?.Trim() ?? string.Empty,
                Address = dto.Address?.Trim() ?? string.Empty,
                JoinDate = dto.JoinDate,
                DateOfBirth = dto.DateOfBirth,
                Salary = dto.Salary,
                PerformanceScore = dto.PerformanceScore,
                DepartmentId = dto.DepartmentId,
                UserId = dto.UserId,
                Status = "Active"
            };

            // Save to database.
            await _employeeRepository.AddAsync(employee);

            // Get saved employee with Department.
            var savedEmployee =
                await _employeeRepository.GetByIdAsync(employee.Id);

            if (savedEmployee == null)
            {
                throw new InvalidOperationException(
                    "Employee could not be retrieved after creation."
                );
            }

            return MapToResponseDto(savedEmployee);
        }

        // ==========================================
        // UPDATE EMPLOYEE
        // ==========================================

        public async Task<EmployeeResponseDto?> UpdateAsync(
            int id,
            EmployeeUpdateDto dto)
        {
            var employee =
                await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
            {
                return null;
            }

            // Validate required text fields.
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException(
                    "Employee name is required."
                );
            }

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new ArgumentException(
                    "Employee email is required."
                );
            }

            // Validate salary.
            if (dto.Salary < 0 ||
                dto.Salary > 9999999999999999.99m)
            {
                throw new ArgumentException(
                    "Salary must be a non-negative amount within the supported range."
                );
            }

            // Validate performance score.
            if (dto.PerformanceScore < 0 ||
                dto.PerformanceScore > 100)
            {
                throw new ArgumentException(
                    "Performance score must be between 0 and 100."
                );
            }

            // Validate department.
            if (dto.DepartmentId <= 0)
            {
                throw new ArgumentException(
                    "Please select a valid department."
                );
            }

            // Validate status.
            var validStatuses = new[]
            {
                "Active",
                "On Leave",
                "Inactive"
            };

            if (string.IsNullOrWhiteSpace(dto.Status) ||
                !validStatuses.Contains(
                    dto.Status.Trim(),
                    StringComparer.OrdinalIgnoreCase))
            {
                throw new ArgumentException(
                    "Status must be Active, On Leave or Inactive."
                );
            }

            // Normalize email.
            var email = dto.Email.Trim().ToLowerInvariant();

            // Check department.
            var departmentExists =
                await _employeeRepository
                    .DepartmentExistsAsync(dto.DepartmentId);

            if (!departmentExists)
            {
                throw new ArgumentException(
                    "The selected department does not exist."
                );
            }

            // Check duplicate email, excluding current employee.
            var emailExists =
                await _employeeRepository
                    .EmailExistsAsync(email, id);

            if (emailExists)
            {
                throw new ArgumentException(
                    "Another employee is already using this email."
                );
            }

            // Update employee fields.
            employee.Name = dto.Name.Trim();
            employee.Email = email;
            employee.Phone = dto.Phone?.Trim() ?? string.Empty;
            employee.Position = dto.Position?.Trim() ?? string.Empty;
            employee.Address = dto.Address?.Trim() ?? string.Empty;
            employee.JoinDate = dto.JoinDate;
            employee.DateOfBirth = dto.DateOfBirth;
            employee.Salary = dto.Salary;
            employee.Status = dto.Status.Trim();
            employee.PerformanceScore = dto.PerformanceScore;
            employee.DepartmentId = dto.DepartmentId;
            employee.UserId = dto.UserId;

            // Save changes.
            await _employeeRepository.UpdateAsync(employee);

            // Return updated employee.
            var updatedEmployee =
                await _employeeRepository.GetByIdAsync(id);

            if (updatedEmployee == null)
            {
                return null;
            }

            return MapToResponseDto(updatedEmployee);
        }

        // ==========================================
        // DELETE EMPLOYEE
        // ==========================================

        public async Task<bool> DeleteAsync(int id)
        {
            var employee =
                await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
            {
                return false;
            }

            await _employeeRepository.DeleteAsync(employee);

            return true;
        }

        // ==========================================
        // MODEL TO RESPONSE DTO
        // ==========================================

        private static EmployeeResponseDto MapToResponseDto(
            Employee employee)
        {
            return new EmployeeResponseDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Phone = employee.Phone,
                Position = employee.Position,
                Address = employee.Address,
                JoinDate = employee.JoinDate,
                DateOfBirth = employee.DateOfBirth,
                Salary = employee.Salary,
                Status = employee.Status,
                PerformanceScore = employee.PerformanceScore,
                DepartmentId = employee.DepartmentId,
                DepartmentName =
                    employee.Department?.Name ?? string.Empty,
                UserId = employee.UserId
            };
        }
    }
}