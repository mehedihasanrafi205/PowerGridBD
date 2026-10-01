import apiClient from "@/lib/apiClient";
import type {
  ApplicationPayload,
  ApplicationReviewPayload,
  ApplicationFilters,
  Application,
  ApplicationPaginatedResponse,
  ApplicationDetailResponse,
  ApplicationStatusResponse,
} from "@/types";

export const createApplication = (payload: ApplicationPayload) =>
  apiClient<{ success: boolean; statusCode: number; message: string; data: Application }>(
    "/applications",
    { method: "POST", body: payload }
  );

export const verifyApplication = (otp: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string; data: Application }>(
    "/applications/verify-email",
    { method: "POST", body: { otp } }
  );

export const resendApplicationOtp = (email: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>("/applications/resend-otp", {
    method: "POST",
    body: { email },
  });

export const getMyApplication = (email: string) =>
  apiClient<ApplicationStatusResponse>(`/applications/my?email=${encodeURIComponent(email)}`);

export const getApplications = (params?: ApplicationFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append("status", params.status);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<ApplicationPaginatedResponse>(`/applications?${searchParams.toString()}`);
};

export const getApplicationById = (id: string) =>
  apiClient<ApplicationDetailResponse>(`/applications/${id}`);

export const reviewApplication = (id: string, payload: ApplicationReviewPayload) =>
  apiClient<ApplicationDetailResponse>(`/applications/${id}/review`, {
    method: "PATCH",
    body: payload,
  });