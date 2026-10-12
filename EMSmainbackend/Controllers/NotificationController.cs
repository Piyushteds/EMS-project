using EMSmainbackend.DTOs.Notification;
using EMSmainbackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EMSmainbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(
            INotificationService notificationService)
        {
            _notificationService = notificationService;
        }


        // ==========================================
        // GET MY NOTIFICATIONS
        // GET: api/Notification
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<List<NotificationResponseDto>>> GetMyNotifications()
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user identity."
                });
            }

            var notifications =
                await _notificationService.GetByUserIdAsync(
                    userId
                );

            return Ok(notifications);
        }


        // ==========================================
        // MARK NOTIFICATION AS READ
        // PUT: api/Notification/1/read
        // ==========================================

        [HttpPut("{id:int}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var result =
                await _notificationService.MarkAsReadAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Notification not found."
                });
            }

            return Ok(new
            {
                message = "Notification marked as read."
            });
        }
    }
}