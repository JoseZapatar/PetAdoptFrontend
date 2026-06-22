import { axiosClient } from "./axiosClient";

export const petImagesApi = {
  getByPet: (petId) => axiosClient.get(`/PetImages/pet/${petId}`),

  upload: (petId, file, isPrimary = false) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("isPrimary", isPrimary);

    return axiosClient.post(`/PetImages/pet/${petId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  setPrimary: (imageId) =>
    axiosClient.put(`/PetImages/${imageId}/set-primary`),

  delete: (imageId) => axiosClient.delete(`/PetImages/${imageId}`),
};