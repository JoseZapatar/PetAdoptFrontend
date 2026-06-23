import { axiosClient } from "./axiosClient";

export const adoptionRequestsApi = {
  getAll: (params) => axiosClient.get("/AdoptionRequests", { params }),

  getById: (id) => axiosClient.get(`/AdoptionRequests/${id}`),

  create: (data) => axiosClient.post("/AdoptionRequests", data),

  getMyRequests: (adopterId) =>
    axiosClient.get(`/AdoptionRequests/my-requests/${adopterId}`),

  getMyHistory: (adopterId) =>
    axiosClient.get(`/AdoptionRequests/my-history/${adopterId}`),

  approve: (id, data) =>
    axiosClient.put(`/AdoptionRequests/${id}/approve`, data),

  reject: (id, data) =>
    axiosClient.put(`/AdoptionRequests/${id}/reject`, data),
};
