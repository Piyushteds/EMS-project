import httpClient from "./httpClient";
export const attendanceService = {
  getAll: () => httpClient.get("/Attendance"),
  getById: (id) => httpClient.get(`/Attendance/${id}`),
  getByEmployee: (employeeId) => httpClient.get(`/Attendance/employee/${employeeId}`),
  create: (payload) => httpClient.post("/Attendance", payload),
  update: (id, payload) => httpClient.put(`/Attendance/${id}`, payload),
  remove: (id) => httpClient.delete(`/Attendance/${id}`)
};
