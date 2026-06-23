import { axiosClient } from "./axiosClient";

export const recommendationsApi = {
  create: (data) => axiosClient.post("/Recommendations", data),
  getAll: (params) => axiosClient.get("/Recommendations", { params }),
  review: (id, data) => axiosClient.put(`/Recommendations/${id}/review`, data),
  delete: (id) => axiosClient.delete(`/Recommendations/${id}`),
};
