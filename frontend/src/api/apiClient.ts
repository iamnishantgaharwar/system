import type { LoginRequestType } from "../components/Auth/schema/auth";
import type { IApiResponse, IProfileData } from "../store/thunk/types/authTypes";
import { axiosInstance } from "./axiosInstance";

export const apiClient = {
    userlogin: (data: LoginRequestType) => axiosInstance.post<IApiResponse>("api/auth/login", data),
    me: () => axiosInstance.get<IApiResponse<IProfileData>>("api/auth/me"),
    logout: () => axiosInstance.post<IApiResponse>("api/auth/logout"),
  };