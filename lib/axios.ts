import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

/**
 * Axios Instance Configuration
 * Pre-configured with interceptors for request/response handling
 */

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Add auth tokens, transform requests, etc.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Auth token injection will be added in future phases
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle errors globally, transform responses, etc.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Global error handling will be added in future phases
    // - 401: Redirect to login
    // - 403: Show forbidden message
    // - 500: Show server error
    return Promise.reject(error);
  }
);

export { api };
