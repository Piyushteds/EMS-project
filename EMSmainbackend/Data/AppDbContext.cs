using EMSmainbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // ==============================
        // TABLES
        // ==============================

        public DbSet<User> Users { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Department> Departments { get; set; }

        public DbSet<Attendance> Attendances { get; set; }

        public DbSet<LeaveRequest> LeaveRequests { get; set; }

        public DbSet<Payroll> Payrolls { get; set; }

        public DbSet<Performance> Performances { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }


        // ==============================
        // RELATIONSHIPS
        // ==============================

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // ==========================================
            // USER → EMPLOYEE
            // One User can have zero or one Employee
            // ==========================================

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.User)
                .WithOne(u => u.Employee)
                .HasForeignKey<Employee>(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);


            // ==========================================
            // DEPARTMENT → EMPLOYEES
            // One Department → Many Employees
            // ==========================================

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);


            // ==========================================
            // EMPLOYEE → ATTENDANCE
            // One Employee → Many Attendance Records
            // ==========================================

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Employee)
                .WithMany(e => e.Attendances)
                .HasForeignKey(a => a.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================================
            // EMPLOYEE → LEAVE REQUEST
            // One Employee → Many Leave Requests
            // ==========================================

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(l => l.Employee)
                .WithMany(e => e.LeaveRequests)
                .HasForeignKey(l => l.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================================
            // LEAVE → APPROVED BY USER
            // One User → Many Leave Requests
            // ==========================================

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(l => l.ApprovedByUser)
                .WithMany()
                .HasForeignKey(l => l.ApprovedByUserId)
                .OnDelete(DeleteBehavior.SetNull);


            // ==========================================
            // EMPLOYEE → PAYROLL
            // One Employee → Many Payroll Records
            // ==========================================

            modelBuilder.Entity<Payroll>()
                .HasOne(p => p.Employee)
                .WithMany(e => e.Payrolls)
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================================
            // EMPLOYEE → PERFORMANCE
            // One Employee → Many Performance Records
            // ==========================================

            modelBuilder.Entity<Performance>()
                .HasOne(p => p.Employee)
                .WithMany(e => e.Performances)
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================================
            // PERFORMANCE → REVIEWED BY USER
            // One User → Many Performance Reviews
            // ==========================================

            modelBuilder.Entity<Performance>()
                .HasOne(p => p.ReviewedByUser)
                .WithMany()
                .HasForeignKey(p => p.ReviewedByUserId)
                .OnDelete(DeleteBehavior.SetNull);


            // ==========================================
            // USER → REFRESH TOKENS
            // One User → Many Refresh Tokens
            // ==========================================

            modelBuilder.Entity<RefreshToken>()
                .HasOne(r => r.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // ==========================================
            // USER → NOTIFICATIONS
            // One User → Many Notifications
            // ==========================================

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.SetNull);


            // ==========================================
            // UNIQUE EMAIL
            // ==========================================

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();


            // ==========================================
            // UNIQUE EMPLOYEE USER LINK
            // ==========================================

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.UserId)
                .IsUnique()
                .HasFilter("[UserId] IS NOT NULL");


            // ==========================================
            // DECIMAL PRECISION
            // ==========================================

            modelBuilder.Entity<Employee>()
                .Property(e => e.Salary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Employee>()
                .Property(e => e.PerformanceScore)
                .HasPrecision(5, 2);

            modelBuilder.Entity<Payroll>()
                .Property(p => p.BasicSalary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Payroll>()
                .Property(p => p.Allowances)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Payroll>()
                .Property(p => p.Deductions)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Payroll>()
                .Property(p => p.NetSalary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Performance>()
                .Property(p => p.Score)
                .HasPrecision(5, 2);
        }
    }
}