import apiClient from "@/lib/apiClient";
import type {
  LoginPayload,
  RegistrationPayload,
  VerifyAccountPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  GoogleOAuthPayload,
  User,
  ApiResponse,
} from "@/types";

export const userRegistration = (payload: RegistrationPayload) =>
  apiClient<ApiResponse<{ user: User }>>("/auth/register", {
    method: "POST",
    body: payload,
  });

export const verifyAccount = (payload: VerifyAccountPayload) =>
  apiClient<ApiResponse<{ user: User }>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });

export const userLogin = (payload: LoginPayload) =>
  apiClient<ApiResponse<{ user: User }>>("/auth/login", {
    method: "POST",
    body: payload,
  });

export const userLogout = () =>
  apiClient<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });

export const getMe = () => apiClient<ApiResponse<{ user: User }>>("/auth/me");

export const googleOAuth = (payload: GoogleOAuthPayload) =>
  apiClient<ApiResponse<{ user: User }>>("/auth/google", {
    method: "POST",
    body: payload,
  });

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
