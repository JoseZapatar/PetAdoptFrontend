import { axiosClient } from "./axiosClient";

export const adoptersApi = {
  getByUser: (userId) => axiosClient.get(`/Adopters/by-user/${userId}`),
};