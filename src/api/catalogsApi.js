// src/api/catalogsApi.js
import { axiosClient } from "./axiosClient";

export const catalogsApi = {
  species: () => axiosClient.get("/Catalogs/species"),
  sizes: () => axiosClient.get("/Catalogs/sizes"),
  breeds: () => axiosClient.get("/Catalogs/breeds"),
  breedsBySpecies: (speciesId) =>
    axiosClient.get(`/Catalogs/breeds/by-species/${speciesId}`),
  petStatuses: () => axiosClient.get("/Catalogs/pet-statuses"),
  requestStatuses: () => axiosClient.get("/Catalogs/request-statuses"),
  roles: () => axiosClient.get("/Catalogs/roles"),
};