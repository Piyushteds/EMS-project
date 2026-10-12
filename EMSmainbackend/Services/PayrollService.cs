using EMSmainbackend.DTOs.Payroll;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Models;
using EMSmainbackend.Repositories;

namespace EMSmainbackend.Services
{
    public class PayrollService : IPayrollService
    {
        private readonly IPayrollRepository _payrollRepository;

        public PayrollService(
            IPayrollRepository payrollRepository)
        {
            _payrollRepository = payrollRepository;
        }

        // ==========================================
        // GET ALL PAYROLL
        // GET: api/Payroll
        // ==========================================

        public async Task<List<PayrollResponseDto>> GetAllAsync()
        {
            var payrolls =
                await _payrollRepository.GetAllAsync();

            return payrolls
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // GET PAGINATED PAYROLL
        // GET: api/Payroll?pageNumber=1&pageSize=10
        // ==========================================

        public async Task<PayrollPagedResponseDto> GetPagedAsync(
            int pageNumber,
            int pageSize)
        {
            // ------------------------------------------
            // Validate Page Number
            // ------------------------------------------

            if (pageNumber < 1)
            {
                pageNumber = 1;
            }


            // ------------------------------------------
            // Validate Page Size
            // ------------------------------------------

            if (pageSize < 1)
            {
                pageSize = 10;
            }

            // Prevent unnecessarily large requests
            if (pageSize > 100)
            {
                pageSize = 100;
            }


            // ------------------------------------------
            // Get Paginated Data
            // ------------------------------------------

            var result =
                await _payrollRepository.GetPagedAsync(
                    pageNumber,
                    pageSize);


            // ------------------------------------------
            // Calculate Total Pages
            // ------------------------------------------

            var totalPages =
                result.TotalCount == 0
                    ? 0
                    : (int)Math.Ceiling(
                        result.TotalCount /
                        (double)pageSize);


            // ------------------------------------------
            // Convert Payroll Models
            // To Response DTOs
            // ------------------------------------------

            var items = result.Items
                .Select(MapToResponseDto)
                .ToList();


            // ------------------------------------------
            // Return Paginated Response
            // ------------------------------------------

            return new PayrollPagedResponseDto
            {
                Items = items,

                PageNumber = pageNumber,

                PageSize = pageSize,

                TotalCount = result.TotalCount,

                TotalPages = totalPages
            };
        }


        // ==========================================
        // GET PAYROLL BY ID
        // GET: api/Payroll/1
        // ==========================================

        public async Task<PayrollResponseDto?> GetByIdAsync(int id)
        {
            var payroll =
                await _payrollRepository.GetByIdAsync(id);

            if (payroll == null)
            {
                return null;
            }

            return MapToResponseDto(payroll);
        }


        // ==========================================
        // GET PAYROLL BY EMPLOYEE
        // GET: api/Payroll/employee/1
        // ==========================================

        public async Task<List<PayrollResponseDto>> GetByEmployeeIdAsync(
            int employeeId)
        {
            var employeeExists =
                await _payrollRepository
                    .EmployeeExistsAsync(employeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }

            var payrolls =
                await _payrollRepository
                    .GetByEmployeeIdAsync(employeeId);

            return payrolls
                .Select(MapToResponseDto)
                .ToList();
        }


        // ==========================================
        // CREATE PAYROLL
        // POST: api/Payroll
        // ==========================================

        public async Task<PayrollResponseDto> CreateAsync(
            PayrollCreateDto dto)
        {
            // ------------------------------------------
            // Check Employee
            // ------------------------------------------

            var employeeExists =
                await _payrollRepository
                    .EmployeeExistsAsync(dto.EmployeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }


            // ------------------------------------------
            // Validate Salary
            // ------------------------------------------

            if (dto.BasicSalary < 0)
            {
                throw new ArgumentException(
                    "Basic salary cannot be negative."
                );
            }

            if (dto.Allowances < 0)
            {
                throw new ArgumentException(
                    "Allowances cannot be negative."
                );
            }

            if (dto.Deductions < 0)
            {
                throw new ArgumentException(
                    "Deductions cannot be negative."
                );
            }


            // ------------------------------------------
            // Calculate Net Salary
            // ------------------------------------------

            var netSalary =
                dto.BasicSalary
                + dto.Allowances
                - dto.Deductions;


            if (netSalary < 0)
            {
                throw new ArgumentException(
                    "Net salary cannot be negative."
                );
            }


            // ------------------------------------------
            // Validate Payment Status
            // ------------------------------------------

            var paymentStatus =
                ValidatePaymentStatus(dto.PaymentStatus);


            // ------------------------------------------
            // Create Payroll Model
            // ------------------------------------------

            var payroll = new Payroll
            {
                EmployeeId = dto.EmployeeId,

                Month = dto.Month,

                Year = dto.Year,

                BasicSalary = dto.BasicSalary,

                Allowances = dto.Allowances,

                Deductions = dto.Deductions,

                NetSalary = netSalary,

                PaymentStatus = paymentStatus,

                PaidDate =
                    paymentStatus == "Paid"
                        ? DateTime.UtcNow
                        : null
            };


            // ------------------------------------------
            // Save Payroll
            // ------------------------------------------

            await _payrollRepository.AddAsync(
                payroll);


            // ------------------------------------------
            // Get Saved Payroll
            // ------------------------------------------

            var savedPayroll =
                await _payrollRepository
                    .GetByIdAsync(payroll.Id);

            if (savedPayroll == null)
            {
                throw new InvalidOperationException(
                    "Payroll could not be retrieved after creation."
                );
            }

            return MapToResponseDto(savedPayroll);
        }


        // ==========================================
        // UPDATE PAYROLL
        // PUT: api/Payroll/1
        // ==========================================

        public async Task<PayrollResponseDto?> UpdateAsync(
            int id,
            PayrollCreateDto dto)
        {
            // ------------------------------------------
            // Get Existing Payroll
            // ------------------------------------------

            var payroll =
                await _payrollRepository
                    .GetByIdAsync(id);

            if (payroll == null)
            {
                return null;
            }


            // ------------------------------------------
            // Check Employee
            // ------------------------------------------

            var employeeExists =
                await _payrollRepository
                    .EmployeeExistsAsync(dto.EmployeeId);

            if (!employeeExists)
            {
                throw new ArgumentException(
                    "The selected employee does not exist."
                );
            }


            // ------------------------------------------
            // Validate Salary
            // ------------------------------------------

            if (dto.BasicSalary < 0)
            {
                throw new ArgumentException(
                    "Basic salary cannot be negative."
                );
            }

            if (dto.Allowances < 0)
            {
                throw new ArgumentException(
                    "Allowances cannot be negative."
                );
            }

            if (dto.Deductions < 0)
            {
                throw new ArgumentException(
                    "Deductions cannot be negative."
                );
            }


            // ------------------------------------------
            // Recalculate Net Salary
            // ------------------------------------------

            var netSalary =
                dto.BasicSalary
                + dto.Allowances
                - dto.Deductions;


            if (netSalary < 0)
            {
                throw new ArgumentException(
                    "Net salary cannot be negative."
                );
            }


            // ------------------------------------------
            // Validate Payment Status
            // ------------------------------------------

            var paymentStatus =
                ValidatePaymentStatus(dto.PaymentStatus);


            // ------------------------------------------
            // Update Payroll
            // ------------------------------------------

            payroll.EmployeeId =
                dto.EmployeeId;

            payroll.Month =
                dto.Month;

            payroll.Year =
                dto.Year;

            payroll.BasicSalary =
                dto.BasicSalary;

            payroll.Allowances =
                dto.Allowances;

            payroll.Deductions =
                dto.Deductions;

            payroll.NetSalary =
                netSalary;

            payroll.PaymentStatus =
                paymentStatus;


            // ------------------------------------------
            // Paid Date Logic
            // ------------------------------------------

            if (paymentStatus == "Paid")
            {
                // Only set date if it was previously pending
                if (payroll.PaidDate == null)
                {
                    payroll.PaidDate =
                        DateTime.UtcNow;
                }
            }
            else
            {
                // Pending means payment has not been made
                payroll.PaidDate = null;
            }


            // ------------------------------------------
            // Save Updated Payroll
            // ------------------------------------------

            await _payrollRepository.UpdateAsync(
                payroll);


            // ------------------------------------------
            // Get Updated Payroll
            // ------------------------------------------

            var updatedPayroll =
                await _payrollRepository
                    .GetByIdAsync(id);

            if (updatedPayroll == null)
            {
                return null;
            }

            return MapToResponseDto(updatedPayroll);
        }


        // ==========================================
        // DELETE PAYROLL
        // DELETE: api/Payroll/1
        // ==========================================

        public async Task<bool> DeleteAsync(int id)
        {
            var payroll =
                await _payrollRepository
                    .GetByIdAsync(id);

            if (payroll == null)
            {
                return false;
            }

            await _payrollRepository
                .DeleteAsync(payroll);

            return true;
        }


        // ==========================================
        // VALIDATE PAYMENT STATUS
        // ==========================================

        private static string ValidatePaymentStatus(
            string? status)
        {
            // Default status
            if (string.IsNullOrWhiteSpace(status))
            {
                return "Pending";
            }

            status =
                status.Trim();

            // Allow only Pending or Paid
            if (status != "Pending" &&
                status != "Paid")
            {
                throw new ArgumentException(
                    "Payment status must be either 'Pending' or 'Paid'."
                );
            }

            return status;
        }


        // ==========================================
        // MODEL → RESPONSE DTO
        // ==========================================

        private static PayrollResponseDto MapToResponseDto(
            Payroll payroll)
        {
            return new PayrollResponseDto
            {
                Id =
                    payroll.Id,

                EmployeeId =
                    payroll.EmployeeId,

                EmployeeName =
                    payroll.Employee?.Name
                    ?? string.Empty,

                Month =
                    payroll.Month,

                Year =
                    payroll.Year,

                BasicSalary =
                    payroll.BasicSalary,

                Allowances =
                    payroll.Allowances,

                Deductions =
                    payroll.Deductions,

                NetSalary =
                    payroll.NetSalary,

                PaymentStatus =
                    payroll.PaymentStatus,

                PaidDate =
                    payroll.PaidDate
            };
        }
    }
}