using EMSmainbackend.DTOs.Performance;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Models;
using EMSmainbackend.Repositories;

namespace EMSmainbackend.Services
{
    public class PerformanceService : IPerformanceService
    {
        private readonly IPerformanceRepository _repository;
        private readonly IEmployeeRepository _employeeRepository;

        public PerformanceService(
            IPerformanceRepository repository,
            IEmployeeRepository employeeRepository)
        {
            _repository = repository;
            _employeeRepository = employeeRepository;
        }


        // ==========================================
        // GET ALL PERFORMANCE RECORDS
        // ==========================================

        public async Task<List<PerformanceResponseDto>> GetAllAsync()
        {
            var performances =
                await _repository.GetAllAsync();

            return performances
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // GET PERFORMANCE BY ID
        // ==========================================

        public async Task<PerformanceResponseDto?> GetByIdAsync(int id)
        {
            var performance =
                await _repository.GetByIdAsync(id);

            if (performance == null)
            {
                return null;
            }

            return MapToResponseDto(performance);
        }


        // ==========================================
        // GET PERFORMANCE BY EMPLOYEE
        // ==========================================

        public async Task<List<PerformanceResponseDto>>
            GetByEmployeeIdAsync(int employeeId)
        {
            var employeeExists =
                await _repository
                    .EmployeeExistsAsync(employeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }

            var performances =
                await _repository
                    .GetByEmployeeIdAsync(employeeId);

            return performances
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // CREATE PERFORMANCE
        // ==========================================

        public async Task<PerformanceResponseDto> CreateAsync(
            PerformanceCreateDto dto)
        {
            // Check employee
            var employeeExists =
                await _repository
                    .EmployeeExistsAsync(dto.EmployeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }


            // Validate score
            if (dto.Score < 0 || dto.Score > 100)
            {
                throw new ArgumentException(
                    "Performance score must be between 0 and 100."
                );
            }


            // Validate goals
            if (dto.GoalsCompleted < 0)
            {
                throw new ArgumentException(
                    "Goals completed cannot be negative."
                );
            }


            // Validate reviewer
            if (dto.ReviewedByUserId.HasValue)
            {
                var reviewer =
                    await _repository
                        .GetUserByIdAsync(
                            dto.ReviewedByUserId.Value);

                if (reviewer == null)
                {
                    throw new ArgumentException(
                        "The selected reviewer does not exist."
                    );
                }
            }


            // Create Performance Model
            var performance = new Performance
            {
                EmployeeId =
                    dto.EmployeeId,

                Score =
                    dto.Score,

                ReviewPeriod =
                    dto.ReviewPeriod.Trim(),

                GoalsCompleted =
                    dto.GoalsCompleted,

                Comments =
                    dto.Comments.Trim(),

                ReviewedByUserId =
                    dto.ReviewedByUserId,

                ReviewDate =
                    DateTime.UtcNow
            };


            // Save performance
            await _repository.AddAsync(
                performance);


            // Get saved record
            var savedPerformance =
                await _repository
                    .GetByIdAsync(performance.Id);

            if (savedPerformance == null)
            {
                throw new InvalidOperationException(
                    "Performance record could not be retrieved after creation."
                );
            }


            // Update current employee score
            await UpdateEmployeeScoreAsync(
                dto.EmployeeId,
                dto.Score);


            return MapToResponseDto(
                savedPerformance);
        }


        // ==========================================
        // UPDATE PERFORMANCE
        // ==========================================

        public async Task<PerformanceResponseDto?> UpdateAsync(
            int id,
            PerformanceCreateDto dto)
        {
            var performance =
                await _repository
                    .GetByIdAsync(id);

            if (performance == null)
            {
                return null;
            }


            // Check employee
            var employeeExists =
                await _repository
                    .EmployeeExistsAsync(dto.EmployeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }


            // Validate score
            if (dto.Score < 0 || dto.Score > 100)
            {
                throw new ArgumentException(
                    "Performance score must be between 0 and 100."
                );
            }


            // Validate goals
            if (dto.GoalsCompleted < 0)
            {
                throw new ArgumentException(
                    "Goals completed cannot be negative."
                );
            }


            // Validate reviewer
            if (dto.ReviewedByUserId.HasValue)
            {
                var reviewer =
                    await _repository
                        .GetUserByIdAsync(
                            dto.ReviewedByUserId.Value);

                if (reviewer == null)
                {
                    throw new ArgumentException(
                        "The selected reviewer does not exist."
                    );
                }
            }


            // Update fields
            performance.EmployeeId =
                dto.EmployeeId;

            performance.Score =
                dto.Score;

            performance.ReviewPeriod =
                dto.ReviewPeriod.Trim();

            performance.GoalsCompleted =
                dto.GoalsCompleted;

            performance.Comments =
                dto.Comments.Trim();

            performance.ReviewedByUserId =
                dto.ReviewedByUserId;


            await _repository.UpdateAsync(
                performance);


            // Update current employee score
            await UpdateEmployeeScoreAsync(
                dto.EmployeeId,
                dto.Score);


            var updatedPerformance =
                await _repository
                    .GetByIdAsync(id);

            if (updatedPerformance == null)
            {
                return null;
            }

            return MapToResponseDto(
                updatedPerformance);
        }


        // ==========================================
        // DELETE PERFORMANCE
        // ==========================================

        public async Task<bool> DeleteAsync(int id)
        {
            var performance =
                await _repository
                    .GetByIdAsync(id);

            if (performance == null)
            {
                return false;
            }


            await _repository
                .DeleteAsync(performance);

            return true;
        }


        // ==========================================
        // UPDATE EMPLOYEE CURRENT SCORE
        // ==========================================

        private async Task UpdateEmployeeScoreAsync(
            int employeeId,
            decimal score)
        {
            // NOTE:
            // Repository currently does not expose Employee update functionality.
            
            // We will connect this part properly through EmployeeRepository/Service without directly accessing DbContext from this Service.
        }


        // ==========================================
        // MODEL → RESPONSE DTO
        // ==========================================

        private static PerformanceResponseDto
            MapToResponseDto(Performance performance)
        {
            return new PerformanceResponseDto
            {
                Id =
                    performance.Id,

                EmployeeId =
                    performance.EmployeeId,

                EmployeeName =
                    performance.Employee?.Name
                    ?? string.Empty,

                Score =
                    performance.Score,

                ReviewPeriod =
                    performance.ReviewPeriod,

                GoalsCompleted =
                    performance.GoalsCompleted,

                Comments =
                    performance.Comments,

                ReviewedByUserId =
                    performance.ReviewedByUserId,

                ReviewDate =
                    performance.ReviewDate
            };
        }
    }
}