import apiClient from "@/lib/apiClient";
import type {
  PaymentInitiatePayload,
  PaymentFilters,
  Payment,
  PaymentInitiateResponse,
  PaymentPaginatedResponse,
  PaymentDetailResponse,
} from "@/types";

export const initiatePayment = (payload: PaymentInitiatePayload) =>
  apiClient<PaymentInitiateResponse>("/payment", {
    method: "POST",
    body: payload,
  });

export const getMyPayments = (params?: PaymentFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.status?.length) params.status.forEach((s) => searchParams.append("status", s));
  if (params?.type?.length) params.type.forEach((t) => searchParams.append("type", t));
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<PaymentPaginatedResponse>(`/payment/my-payments?${searchParams.toString()}`);
};

export const getAllPayments = (params?: PaymentFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.status?.length) params.status.forEach((s) => searchParams.append("status", s));
  if (params?.type?.length) params.type.forEach((t) => searchParams.append("type", t));
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<PaymentPaginatedResponse>(`/payment/all?${searchParams.toString()}`);
};

export const getPaymentByTransaction = (transactionId: string) =>
  apiClient<PaymentDetailResponse>(`/payment/transaction/${transactionId}`);

export const refundPayment = (transactionId: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string; data: { transactionId: string } }>(
    "/payment/refund",
    {
      method: "POST",
      body: { transactionId },
    }
  );