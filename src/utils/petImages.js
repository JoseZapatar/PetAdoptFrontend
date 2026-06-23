import { axiosClient } from "../api/axiosClient";

export function getPetImageUrl(primaryImageId) {
  if (!primaryImageId) return "/placeholder-pet.jpg";

  return `${axiosClient.defaults.baseURL}/PetImages/${primaryImageId}/file`;
}
