import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

// Compatibility layer for old code using api.get/post/put/patch/delete
export const api = {
  get: <T>(url: string, options?: { params?: Record<string, any>; query?: Record<string, any>; headers?: Record<string, string> }) =>
    apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: Record<string, unknown>, options?: { params?: Record<string, any>; query?: Record<string, any>; headers?: Record<string, string> }) =>
    apiClient<T>(url, { ...options, method: "POST", body }),
  put: <T>(url: string, body?: Record<string, unknown>, options?: { params?: Record<string, any>; query?: Record<string, any>; headers?: Record<string, string> }) =>
    apiClient<T>(url, { ...options, method: "PUT", body }),
  patch: <T>(url: string, body?: Record<string, unknown>, options?: { params?: Record<string, any>; query?: Record<string, any>; headers?: Record<string, string> }) =>
    apiClient<T>(url, { ...options, method: "PATCH", body }),
  delete: <T>(url: string, options?: { params?: Record<string, any>; query?: Record<string, any>; headers?: Record<string, string> }) =>
    apiClient<T>(url, { ...options, method: "DELETE" }),
};

export default apiClient;
