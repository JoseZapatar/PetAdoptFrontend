import { axiosClient } from "../api/axiosClient";

function getApiOrigin() {
  const baseURL = axiosClient.defaults.baseURL || "";

  if (baseURL.endsWith("/api")) {
    return baseURL.slice(0, -4);
  }

  return baseURL.replace(/\/api\/?$/, "");
}

function normalizeUrl(url) {
  if (!url) return null;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/api/")) {
    return `${getApiOrigin()}${url}`;
  }

  if (url.startsWith("/")) {
    return url;
  }

  return url;
}

export function getPetImageUrl(petOrImageId) {
  if (!petOrImageId) return "/placeholder-pet.jpg";

  if (typeof petOrImageId === "number" || typeof petOrImageId === "string") {
    return `${axiosClient.defaults.baseURL}/PetImages/${petOrImageId}/file`;
  }

  const directUrl =
    petOrImageId.primaryImageUrl ||
    petOrImageId.imageUrl ||
    petOrImageId.photoUrl ||
    petOrImageId.pictureUrl;

  const normalizedUrl = normalizeUrl(directUrl);
  if (normalizedUrl) return normalizedUrl;

  const imageFromArray =
    Array.isArray(petOrImageId.petImages) && petOrImageId.petImages.length > 0
      ? petOrImageId.petImages.find((image) => image.isPrimary) || petOrImageId.petImages[0]
      : null;

  const imageId =
    petOrImageId.primaryImageId ??
    petOrImageId.imageId ??
    petOrImageId.petImageId ??
    imageFromArray?.id ??
    imageFromArray?.imageId;

  if (!imageId) return "/placeholder-pet.jpg";

  return `${axiosClient.defaults.baseURL}/PetImages/${imageId}/file`;
}
