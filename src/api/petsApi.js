import { axiosClient } from "./axiosClient";

export const petsApi = {
  getAll: (params) => axiosClient.get("/Pets", { params }),
  getById: (id) => axiosClient.get(`/Pets/${id}`),
  create: (data) => axiosClient.post("/Pets", data),
  update: (id, data) => axiosClient.put(`/Pets/${id}`, data),
  delete: (id) => axiosClient.delete(`/Pets/${id}`),
};
