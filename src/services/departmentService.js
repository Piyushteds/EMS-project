import httpClient from "./httpClient";
export const departmentsService = {
  getAll: () => httpClient.get("/Department"),
  getById: (id) => httpClient.get(`/Department/${id}`),
  create: (payload) => httpClient.post("/Department", payload),
  update: (id, payload) => httpClient.put(`/Department/${id}`, payload),
  remove: (id) => httpClient.delete(`/Department/${id}`)
};
