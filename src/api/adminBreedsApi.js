import { axiosClient } from "./axiosClient";

export const adminBreedsApi = {
  getAll: () => axiosClient.get("/AdminBreeds"),
  create: (data) => axiosClient.post("/AdminBreeds", data),
  update: (id, data) => axiosClient.put(`/AdminBreeds/${id}`, data),
  delete: (id) => axiosClient.delete(`/AdminBreeds/${id}`),
};
