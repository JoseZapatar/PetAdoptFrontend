// src/api/viewsApi.js
import { axiosClient } from "./axiosClient";

export const viewsApi = {
  availablePets: (params = {}) =>
    axiosClient.get("/Views/available-pets", { params }),

  adoptionRequestDetails: (params = {}) =>
    axiosClient.get("/Views/adoption-request-details", { params }),

  adoptersProfiles: (params = {}) =>
    axiosClient.get("/Views/adopters-profiles", { params }),

  executiveReport: () =>
    axiosClient.get("/Views/executive-adoption-report"),

  petReviewSummary: (params = {}) =>
    axiosClient.get("/Views/pet-review-summary", { params }),
};