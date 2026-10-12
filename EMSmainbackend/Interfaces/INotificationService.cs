using EMSmainbackend.DTOs.Notification;

namespace EMSmainbackend.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationResponseDto>> GetByUserIdAsync(
            int userId);

        Task<bool> MarkAsReadAsync(int id);
    }
}