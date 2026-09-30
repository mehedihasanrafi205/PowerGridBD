import { type FetchOptions, ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

// Generic response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Type-safe API wrapper
const makeRequest = <T = unknown>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
  options?: FetchOptions<"json">,
) => {
  return apiClient<ApiResponse<T>>(url, {
    method,
    body,
    ...options,
  } as FetchOptions<"json">);
};

export const api = {
  get: <T = unknown>(url: string, options?: FetchOptions<"json">) =>
    makeRequest<T>(url, "GET", undefined, options),
  post: <T = unknown>(
    url: string,
    body?: Record<string, unknown>,
    options?: FetchOptions<"json">,
  ) => makeRequest<T>(url, "POST", body, options),
  put: <T = unknown>(
    url: string,
    body?: Record<string, unknown>,
    options?: FetchOptions<"json">,
  ) => makeRequest<T>(url, "PUT", body, options),
  patch: <T = unknown>(
    url: string,
    body?: Record<string, unknown>,
    options?: FetchOptions<"json">,
  ) => makeRequest<T>(url, "PATCH", body, options),
  delete: <T = unknown>(url: string, options?: FetchOptions<"json">) =>
    makeRequest<T>(url, "DELETE", undefined, options),
};

// Also export the raw client for advanced usage
export default apiClient;
