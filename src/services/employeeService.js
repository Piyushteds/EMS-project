import httpClient from "./httpClient";
export const employeesService = {
  getAll: () => httpClient.get("/Employee"),
  getById: (id) => httpClient.get(`/Employee/${id}`),
  create: (payload) => httpClient.post("/Employee", payload),
  update: (id, payload) => httpClient.put(`/Employee/${id}`, payload),
  remove: (id) => httpClient.delete(`/Employee/${id}`)
};
