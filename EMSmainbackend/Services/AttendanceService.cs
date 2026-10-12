using EMSmainbackend.DTOs.Attendance;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Models;
using EMSmainbackend.Repositories;

namespace EMSmainbackend.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;

        public AttendanceService(
            IAttendanceRepository attendanceRepository)
        {
            _attendanceRepository = attendanceRepository;
        }


        // ==========================================
        // GET ALL ATTENDANCE
        // ==========================================

        public async Task<List<AttendanceResponseDto>> GetAllAsync()
        {
            var attendances =
                await _attendanceRepository.GetAllAsync();

            return attendances
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // GET ATTENDANCE BY ID
        // ==========================================

        public async Task<AttendanceResponseDto?> GetByIdAsync(int id)
        {
            var attendance =
                await _attendanceRepository.GetByIdAsync(id);

            if (attendance == null)
            {
                return null;
            }

            return MapToResponseDto(attendance);
        }


        // ==========================================
        // GET ATTENDANCE BY EMPLOYEE
        // ==========================================

        public async Task<List<AttendanceResponseDto>> GetByEmployeeIdAsync(
            int employeeId)
        {
            var employeeExists =
                await _attendanceRepository
                    .EmployeeExistsAsync(employeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }

            var attendances =
                await _attendanceRepository
                    .GetByEmployeeIdAsync(employeeId);

            return attendances
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // CREATE ATTENDANCE
        // ==========================================

        public async Task<AttendanceResponseDto> CreateAsync(
            AttendanceCreateDto dto)
        {
            // Check employee
            var employeeExists =
                await _attendanceRepository
                    .EmployeeExistsAsync(dto.EmployeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }


            // Validate date
            if (dto.Date.Date > DateTime.UtcNow.Date)
            {
                throw new ArgumentException(
                    "Attendance cannot be marked for a future date."
                );
            }


            // Validate check-in / check-out
            if (dto.CheckIn.HasValue &&
                dto.CheckOut.HasValue &&
                dto.CheckOut <= dto.CheckIn)
            {
                throw new ArgumentException(
                    "Check-out time must be after check-in time."
                );
            }


            // Create Model
            var attendance = new Attendance
            {
                EmployeeId = dto.EmployeeId,

                Date = dto.Date.Date,

                CheckIn = dto.CheckIn,

                CheckOut = dto.CheckOut,

                Status = dto.Status.Trim(),

                Notes = dto.Notes.Trim()
            };


            await _attendanceRepository.AddAsync(
                attendance);


            // Get saved record
            var savedAttendance =
                await _attendanceRepository
                    .GetByIdAsync(attendance.Id);

            if (savedAttendance == null)
            {
                throw new InvalidOperationException(
                    "Attendance could not be retrieved after creation."
                );
            }

            return MapToResponseDto(savedAttendance);
        }


        // ==========================================
        // UPDATE ATTENDANCE
        // ==========================================

        public async Task<AttendanceResponseDto?> UpdateAsync(
            int id,
            AttendanceCreateDto dto)
        {
            var attendance =
                await _attendanceRepository.GetByIdAsync(id);

            if (attendance == null)
            {
                return null;
            }


            // Check employee
            var employeeExists =
                await _attendanceRepository
                    .EmployeeExistsAsync(dto.EmployeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }


            // Validate date
            if (dto.Date.Date > DateTime.UtcNow.Date)
            {
                throw new ArgumentException(
                    "Attendance cannot be marked for a future date."
                );
            }


            // Validate times
            if (dto.CheckIn.HasValue &&
                dto.CheckOut.HasValue &&
                dto.CheckOut <= dto.CheckIn)
            {
                throw new ArgumentException(
                    "Check-out time must be after check-in time."
                );
            }


            attendance.EmployeeId = dto.EmployeeId;

            attendance.Date = dto.Date.Date;

            attendance.CheckIn = dto.CheckIn;

            attendance.CheckOut = dto.CheckOut;

            attendance.Status = dto.Status.Trim();

            attendance.Notes = dto.Notes.Trim();


            await _attendanceRepository.UpdateAsync(
                attendance);


            var updatedAttendance =
                await _attendanceRepository
                    .GetByIdAsync(id);

            if (updatedAttendance == null)
            {
                return null;
            }

            return MapToResponseDto(updatedAttendance);
        }


        // ==========================================
        // DELETE ATTENDANCE
        // ==========================================

        public async Task<bool> DeleteAsync(int id)
        {
            var attendance =
                await _attendanceRepository.GetByIdAsync(id);

            if (attendance == null)
            {
                return false;
            }

            await _attendanceRepository.DeleteAsync(
                attendance);

            return true;
        }


        // ==========================================
        // MODEL → RESPONSE DTO
        // ==========================================

        private static AttendanceResponseDto MapToResponseDto(
            Attendance attendance)
        {
            return new AttendanceResponseDto
            {
                Id = attendance.Id,

                EmployeeId = attendance.EmployeeId,

                EmployeeName =
                    attendance.Employee?.Name
                    ?? string.Empty,

                Date = attendance.Date,

                CheckIn = attendance.CheckIn,

                CheckOut = attendance.CheckOut,

                Status = attendance.Status,

                Notes = attendance.Notes
            };
        }
    }
}