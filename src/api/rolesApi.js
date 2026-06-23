import { axiosClient } from "./axiosClient";

export const rolesApi = {
  getAll: () => axiosClient.get("/Catalogs/roles"),
  getById: (id) => axiosClient.get(`/Catalogs/roles/${id}`),
  create: (data) => axiosClient.post("/Catalogs/roles", data),
  update: (id, data) => axiosClient.put(`/Catalogs/roles/${id}`, data),
  delete: (id) => axiosClient.delete(`/Catalogs/roles/${id}`),
};
