import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:5051/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  config.headers["X-API-KEY"] = "ADOPCION_API_2026";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});