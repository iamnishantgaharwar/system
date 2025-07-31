import axios, { type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Now we will right the config which we will attach to the request before sending it


// Now we will right refresh logic for the api which we receive 401 error code

axiosInstance.interceptors.response.use(
  (response) => response,

  // Now we will right the refresh logic
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        await axiosInstance.post(`api/auth/refresh-token`);
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
