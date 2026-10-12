using EMSmainbackend.Data;
using EMSmainbackend.DTOs.Notification;
using EMSmainbackend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EMSmainbackend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationResponseDto>> GetByUserIdAsync(
            int userId)
        {
            var notifications = await _context.Notifications
                .AsNoTracking()
                .Where(n => n.UserId == userId || n.UserId == null)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return notifications.Select(n => new NotificationResponseDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id);

            if (notification == null)
            {
                return false;
            }

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}