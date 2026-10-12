using EMSmainbackend.Data;
using EMSmainbackend.Helpers;
using EMSmainbackend.Interfaces;
using EMSmainbackend.Repositories;
using EMSmainbackend.Services;
using EMSmainbackend.Middleware;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

using System.Text;

var builder = WebApplication.CreateBuilder(args);


// ==========================================
// DATABASE
// ==========================================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


// ==========================================
// CONTROLLERS
// ==========================================

builder.Services.AddControllers();


// ==========================================
// DEPENDENCY INJECTION - REPOSITORIES
// ==========================================

builder.Services.AddScoped<
    IEmployeeRepository,
    EmployeeRepository
>();

builder.Services.AddScoped<
    IDepartmentRepository,
    DepartmentRepository
>();

builder.Services.AddScoped<
    IAttendanceRepository,
    AttendanceRepository
>();

builder.Services.AddScoped<
    ILeaveRepository,
    LeaveRepository
>();

builder.Services.AddScoped<
    IPayrollRepository,
    PayrollRepository
>();

builder.Services.AddScoped<
    IPerformanceRepository,
    PerformanceRepository
>();


// ==========================================
// DEPENDENCY INJECTION - SERVICES
// ==========================================

builder.Services.AddScoped<
    IAuthService,
    AuthService
>();

builder.Services.AddScoped<
    IEmployeeService,
    EmployeeService
>();

builder.Services.AddScoped<
    IDepartmentService,
    DepartmentService
>();

builder.Services.AddScoped<
    IAttendanceService,
    AttendanceService
>();

builder.Services.AddScoped<
    ILeaveService,
    LeaveService
>();

builder.Services.AddScoped<
    IPayrollService,
    PayrollService
>();

builder.Services.AddScoped<
    IPerformanceService,
    PerformanceService
>();

builder.Services.AddScoped<
    IReportService,
    ReportService
>();

builder.Services.AddScoped<
    INotificationService,
    NotificationService
>();


// ==========================================
// DEPENDENCY INJECTION - HELPERS
// ==========================================

builder.Services.AddScoped<JwtHelper>();


// ==========================================
// JWT AUTHENTICATION
// ==========================================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT Key is missing from appsettings.json."
    );
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ValidateIssuer = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidateAudience = true,

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };
    });


// ==========================================
// AUTHORIZATION
// ==========================================

builder.Services.AddAuthorization();


// ==========================================
// CORS
// ==========================================

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "FrontendPolicy",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});


// ==========================================
// SWAGGER
// ==========================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "EMS Backend API",
            Version = "v1",
            Description =
                "Employee Management System API"
        }
    );


    // ======================================
    // JWT BEARER AUTHENTICATION
    // ======================================

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",

            Type = SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            In = ParameterLocation.Header,

            Description =
                "Enter your JWT token."
        }
    );


    // ======================================
    // SWAGGER JWT REQUIREMENT
    // ======================================

    options.AddSecurityRequirement(
        document =>
            new OpenApiSecurityRequirement
            {
                [
                    new OpenApiSecuritySchemeReference(
                        "Bearer",
                        document
                    )
                ] = []
            }
    );
});


// ==========================================
// BUILD APPLICATION
// ==========================================

var app = builder.Build();


// ==========================================
// SWAGGER MIDDLEWARE
// ==========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}


// ==========================================
// MIDDLEWARE PIPELINE
// ==========================================

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("FrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();