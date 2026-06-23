import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  config.headers["X-API-KEY"] = import.meta.env.VITE_API_KEY;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});