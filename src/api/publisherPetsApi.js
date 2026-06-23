import { axiosClient } from "./axiosClient";

export const publisherPetsApi = {
  getMyPets: () => axiosClient.get("/PublisherPets/my-pets"),
  getRequests: () => axiosClient.get("/PublisherPets/requests"),
  getHistory: () => axiosClient.get("/PublisherPets/history"),

  create: (data) => axiosClient.post("/PublisherPets", data),

  uploadImage: (petId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("isPrimary", "true");

    return axiosClient.post(`/PublisherPets/${petId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  approveRequest: (requestId, data) =>
    axiosClient.put(`/PublisherPets/requests/${requestId}/approve`, data),

  rejectRequest: (requestId, data) =>
    axiosClient.put(`/PublisherPets/requests/${requestId}/reject`, data),
};
