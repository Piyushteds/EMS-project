import httpClient from "./httpClient";

export const payrollService = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    httpClient.get(
      `/Payroll?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getById: (id) =>
    httpClient.get(`/Payroll/${id}`),

  getByEmployee: (employeeId) =>
    httpClient.get(`/Payroll/employee/${employeeId}`),

  create: (payload) =>
    httpClient.post("/Payroll", payload),

  update: (id, payload) =>
    httpClient.put(`/Payroll/${id}`, payload),

  remove: (id) =>
    httpClient.delete(`/Payroll/${id}`)
};