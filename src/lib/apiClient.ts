import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ACCESS_TOKEN_KEY = "powergridbd-access-token";
const REFRESH_TOKEN_KEY = "powergridbd-refresh-token";

/**
 * Token store.
 *
 * The backend returns tokens in the login response body (it does
 * not set cookies), so the client persists them and attaches the
 * access token to every request. Note: localStorage is
 * XSS-readable — httpOnly cookies would be strictly better, but
 * that requires a backend change (Set-Cookie on /auth/login).
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch {
    /* storage unavailable — requests will be unauthenticated */
  }
}

export function clearAuthTokens() {
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = getAccessToken();
    if (token) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
  },
  onResponseError({ response }) {
    // Expired/revoked session: drop tokens so the route guard
    // bounces to login instead of retrying with a dead token.
    // No navigation here — the dashboard shell owns redirects.
    if (response?.status === 401) {
      clearAuthTokens();
    }
  },
});

// Compatibility layer for old code using api.get/post/put/patch/delete
export const api = {
  get: <T>(
    url: string,
    options?: {
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
  ) => apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(
    url: string,
    body?: Record<string, unknown>,
    options?: {
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
  ) => apiClient<T>(url, { ...options, method: "POST", body }),
  put: <T>(
    url: string,
    body?: Record<string, unknown>,
    options?: {
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
  ) => apiClient<T>(url, { ...options, method: "PUT", body }),
  patch: <T>(
    url: string,
    body?: Record<string, unknown>,
    options?: {
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
  ) => apiClient<T>(url, { ...options, method: "PATCH", body }),
  delete: <T>(
    url: string,
    options?: {
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
  ) => apiClient<T>(url, { ...options, method: "DELETE" }),
};

export default apiClient;
