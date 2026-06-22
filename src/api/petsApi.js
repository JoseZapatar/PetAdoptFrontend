import { axiosClient } from "./axiosClient";

export const petsApi = {
  getAll: () => axiosClient.get("/Pets"),
  getById: (id) => axiosClient.get(`/Pets/${id}`),
  create: (data) => axiosClient.post("/Pets", data),
  update: (id, data) => axiosClient.put(`/Pets/${id}`, data),
  delete: (id) => axiosClient.delete(`/Pets/${id}`),
};