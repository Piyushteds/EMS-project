import axios from "axios";
import { API_BASE_URL } from "../config/env";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ems-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ems-token");
      localStorage.removeItem("ems-user");
    }
    const message = error.response?.data?.message || error.response?.data?.title || error.message || "Request failed.";
    return Promise.reject(new Error(message));
  }
);

export default httpClient;
