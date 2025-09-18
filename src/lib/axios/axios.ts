import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshFunction: (() => Promise<void>) | null = null;

export const setupAxiosInterceptors = (refresh: () => Promise<void>) => {
  refreshFunction = refresh;

  // Request interceptor to add token
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token') || Cookies.get('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && refreshFunction) {
        try {
          await refreshFunction();
          // Retry the original request
          return apiClient(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
