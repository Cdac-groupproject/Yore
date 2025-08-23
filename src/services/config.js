import axios from "axios";

export const BASE_URL = "http://localhost:8080";

export const myAxios = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

myAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
