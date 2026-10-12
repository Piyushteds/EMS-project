using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMSmainbackend.Models
{
    public class Payroll
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal BasicSalary { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Allowances { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Deductions { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal NetSalary { get; set; }

        [MaxLength(30)]
        public string PaymentStatus { get; set; } = "Pending";

        public DateTime? PaidDate { get; set; } = DateTime.UtcNow;

        // Navigation
        public Employee? Employee { get; set; }
    }
}