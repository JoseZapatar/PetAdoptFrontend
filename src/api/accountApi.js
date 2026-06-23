import { axiosClient } from "./axiosClient";

export const accountApi = {
  getProfile: () => axiosClient.get("/Account/profile"),
  updateProfile: (data) => axiosClient.put("/Account/profile", data),
  changePassword: (data) => axiosClient.put("/Account/password", data),
  switchRole: (data) => axiosClient.put("/Account/switch-role", data),
};
