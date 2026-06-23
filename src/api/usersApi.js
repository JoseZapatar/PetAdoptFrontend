import { axiosClient } from "./axiosClient";

export const usersApi = {
  getAll: (params = {}) => axiosClient.get("/Users", { params }),
  getById: (id) => axiosClient.get(`/Users/${id}`),
  create: (data) => axiosClient.post("/Users", data),
  update: (id, data) => axiosClient.put(`/Users/${id}`, data),
  changePassword: (id, data) => axiosClient.put(`/Users/${id}/password`, data),
  delete: (id) => axiosClient.delete(`/Users/${id}`),
};
