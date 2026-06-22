import { axiosClient } from "./axiosClient";

export const reviewsApi = {
  getAll: () => axiosClient.get("/Reviews"),

  getByPet: (petId) => axiosClient.get(`/Reviews/pet/${petId}`),

  create: (data) => axiosClient.post("/Reviews", data),

  update: (id, data) => axiosClient.put(`/Reviews/${id}`, data),

  delete: (id) => axiosClient.delete(`/Reviews/${id}`),
};