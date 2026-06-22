import { axiosClient } from "./axiosClient";

export const adoptionRequestsApi = {
  create: (data) => axiosClient.post("/AdoptionRequests", data),

  getMyRequests: (adopterId) =>
    axiosClient.get(`/AdoptionRequests/my-requests/${adopterId}`),

  getAll: () => axiosClient.get("/Views/adoption-request-details"),

  approve: (id, data) =>
    axiosClient.put(`/AdoptionRequests/${id}/approve`, data),

  reject: (id, data) =>
    axiosClient.put(`/AdoptionRequests/${id}/reject`, data),
};