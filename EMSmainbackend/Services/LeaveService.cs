using EMSmainbackend.DTOs.Leave;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Models;
using EMSmainbackend.Repositories;

namespace EMSmainbackend.Services
{
    public class LeaveService : ILeaveService
    {
        private readonly ILeaveRepository _leaveRepository;

        public LeaveService(
            ILeaveRepository leaveRepository)
        {
            _leaveRepository = leaveRepository;
        }


        // ==========================================
        // GET ALL LEAVE REQUESTS
        // ==========================================

        public async Task<List<LeaveResponseDto>> GetAllAsync()
        {
            var leaves =
                await _leaveRepository.GetAllAsync();

            return leaves
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // GET LEAVE BY ID
        // ==========================================

        public async Task<LeaveResponseDto?> GetByIdAsync(int id)
        {
            var leave =
                await _leaveRepository.GetByIdAsync(id);

            if (leave == null)
            {
                return null;
            }

            return MapToResponseDto(leave);
        }


        // ==========================================
        // GET LEAVES BY EMPLOYEE
        // ==========================================

        public async Task<List<LeaveResponseDto>> GetByEmployeeIdAsync(
            int employeeId)
        {
            var employeeExists =
                await _leaveRepository
                    .EmployeeExistsAsync(employeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }

            var leaves =
                await _leaveRepository
                    .GetByEmployeeIdAsync(employeeId);

            return leaves
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // CREATE LEAVE REQUEST
        // ==========================================

        public async Task<LeaveResponseDto> CreateAsync(
            LeaveCreateDto dto)
        {
            // Check employee
            var employeeExists =
                await _leaveRepository
                    .EmployeeExistsAsync(dto.EmployeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }


            // Validate dates
            if (dto.EndDate.Date < dto.StartDate.Date)
            {
                throw new ArgumentException(
                    "End date cannot be before start date."
                );
            }


            // Validate leave type
            if (string.IsNullOrWhiteSpace(dto.LeaveType))
            {
                throw new ArgumentException(
                    "Leave type is required."
                );
            }


            // Create leave model
            var leaveRequest = new LeaveRequest
            {
                EmployeeId = dto.EmployeeId,

                LeaveType = dto.LeaveType.Trim(),

                StartDate = dto.StartDate.Date,

                EndDate = dto.EndDate.Date,

                Reason = dto.Reason.Trim(),

                Status = "Pending",

                AppliedAt = DateTime.UtcNow
            };


            await _leaveRepository.AddAsync(
                leaveRequest);


            // Get saved record
            var savedLeave =
                await _leaveRepository
                    .GetByIdAsync(leaveRequest.Id);

            if (savedLeave == null)
            {
                throw new InvalidOperationException(
                    "Leave request could not be retrieved after creation."
                );
            }

            return MapToResponseDto(savedLeave);
        }


        // ==========================================
        // UPDATE LEAVE STATUS
        // ==========================================

        public async Task<LeaveResponseDto?> UpdateStatusAsync(
            int id,
            string status,
            int? approvedByUserId)
        {
            var leave =
                await _leaveRepository.GetByIdAsync(id);

            if (leave == null)
            {
                return null;
            }


            // Normalize status
            status = status.Trim();


            // Only these statuses are allowed
            var allowedStatuses = new[]
            {
                "Pending",
                "Approved",
                "Rejected"
            };


            if (!allowedStatuses.Contains(
                    status,
                    StringComparer.OrdinalIgnoreCase))
            {
                throw new ArgumentException(
                    "Invalid leave status. Use Pending, Approved, or Rejected."
                );
            }


            // If approving/rejecting,
            // approver ID is required.
            if (
                (status.Equals(
                    "Approved",
                    StringComparison.OrdinalIgnoreCase)
                 ||
                 status.Equals(
                    "Rejected",
                    StringComparison.OrdinalIgnoreCase))
                &&
                !approvedByUserId.HasValue
            )
            {
                throw new ArgumentException(
                    "Approver user ID is required."
                );
            }


            // Update status
            leave.Status =
                status.Equals(
                    "Approved",
                    StringComparison.OrdinalIgnoreCase)
                    ? "Approved"
                    :
                status.Equals(
                    "Rejected",
                    StringComparison.OrdinalIgnoreCase)
                    ? "Rejected"
                    :
                    "Pending";


            leave.ApprovedByUserId =
                approvedByUserId;


            await _leaveRepository.UpdateAsync(
                leave);


            var updatedLeave =
                await _leaveRepository.GetByIdAsync(id);

            if (updatedLeave == null)
            {
                return null;
            }

            return MapToResponseDto(updatedLeave);
        }


        // ==========================================
        // DELETE LEAVE
        // ==========================================

        public async Task<bool> DeleteAsync(int id)
        {
            var leave =
                await _leaveRepository.GetByIdAsync(id);

            if (leave == null)
            {
                return false;
            }


            await _leaveRepository.DeleteAsync(
                leave);

            return true;
        }


        // ==========================================
        // MODEL → RESPONSE DTO
        // ==========================================

        private static LeaveResponseDto MapToResponseDto(
            LeaveRequest leave)
        {
            return new LeaveResponseDto
            {
                Id = leave.Id,

                EmployeeId = leave.EmployeeId,

                EmployeeName =
                    leave.Employee?.Name
                    ?? string.Empty,

                LeaveType = leave.LeaveType,

                StartDate = leave.StartDate,

                EndDate = leave.EndDate,

                Reason = leave.Reason,

                Status = leave.Status,

                AppliedAt = leave.AppliedAt,

                ApprovedByUserId =
                    leave.ApprovedByUserId
            };
        }
    }
}