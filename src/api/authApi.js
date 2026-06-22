import { axiosClient } from "./axiosClient";

export const authApi = {
  login: (data) => axiosClient.post("/Auth/login", data),
  register: (data) => axiosClient.post("/Auth/register", data),
  me: () => axiosClient.get("/Auth/me"),
};