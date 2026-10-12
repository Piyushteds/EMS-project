import httpClient from "./httpClient";
export const notificationsService = {
  getAll: () => httpClient.get("/Notification"),
  markAsRead: (id) => httpClient.put(`/Notification/${id}/read`)
};
