import { axiosClient } from "./axiosClient";

export const publisherCatalogsApi = {
  getSpecies: () => axiosClient.get("/Catalogs/species"),
  getBreeds: () => axiosClient.get("/Catalogs/breeds"),
  getSizes: () => axiosClient.get("/Catalogs/sizes"),
};
