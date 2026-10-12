import httpClient from "./httpClient";
export const leaveService = {
  getAll: () => httpClient.get("/Leave"),
  getById: (id) => httpClient.get(`/Leave/${id}`),
  getByEmployee: (employeeId) => httpClient.get(`/Leave/employee/${employeeId}`),
  create: (payload) => httpClient.post("/Leave", payload),
  // Backend parameter is [FromBody] string; send a JSON string value.
  updateStatus: (id, status) => httpClient.put(`/Leave/${id}/status`, JSON.stringify(status)),
  remove: (id) => httpClient.delete(`/Leave/${id}`)
};
