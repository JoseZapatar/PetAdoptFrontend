import { axiosClient } from "./axiosClient";

export const adminSpeciesApi = {
  getAll: () => axiosClient.get("/AdminSpecies"),
  create: (data) => axiosClient.post("/AdminSpecies", data),
  update: (id, data) => axiosClient.put(`/AdminSpecies/${id}`, data),
  delete: (id) => axiosClient.delete(`/AdminSpecies/${id}`),
};
