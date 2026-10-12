import httpClient from "./httpClient";
export const performanceService = {
  getAll: () => httpClient.get("/Performance"),
  getById: (id) => httpClient.get(`/Performance/${id}`),
  getByEmployee: (employeeId) => httpClient.get(`/Performance/employee/${employeeId}`),
  create: (payload) => httpClient.post("/Performance", payload),
  update: (id, payload) => httpClient.put(`/Performance/${id}`, payload),
  remove: (id) => httpClient.delete(`/Performance/${id}`)
};
