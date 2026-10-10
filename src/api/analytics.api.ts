import apiClient from "@/lib/apiClient";
import type {
  OperationalAnalyticsResponse,
  PerformanceAnalyticsResponse,
  GeographicalAnalyticsResponse,
  FinancialAnalyticsResponse,
  TrendsAnalyticsResponse,
  CustomerSummaryResponse,
  TechnicianSummaryResponse,
  AuditLogResponse,
  AuditLogFilters,
  SlaPlanResponse,
  SlaSubscribePayload,
  SlaSubscribeResponse,
  TechnicianWorkloadResponse,
} from "@/types";

export const getOperationalAnalytics = () =>
  apiClient<OperationalAnalyticsResponse>("/analytics/operational");

export const getPerformanceAnalytics = () =>
  apiClient<PerformanceAnalyticsResponse>("/analytics/performance");

export const getGeographicalAnalytics = () =>
  apiClient<GeographicalAnalyticsResponse>("/analytics/geographical");

export const getFinancialAnalytics = () =>
  apiClient<FinancialAnalyticsResponse>("/analytics/financial");

export const getTrendsAnalytics = (days?: number) => {
  const params = days ? `?days=${days}` : "";
  return apiClient<TrendsAnalyticsResponse>(`/analytics/trends${params}`);
};

export const getMySummary = () =>
  apiClient<CustomerSummaryResponse>("/analytics/my-summary");

export const getTechnicianSummary = () =>
  apiClient<TechnicianSummaryResponse>("/analytics/technician-summary");

export const getTechnicianWorkload = () =>
  apiClient<TechnicianWorkloadResponse>("/analytics/technician-workload");

export const getSlaPlans = () =>
  apiClient<SlaPlanResponse>("/analytics/sla-plans");

export const subscribeSla = (payload: SlaSubscribePayload) =>
  apiClient<SlaSubscribeResponse>("/analytics/sla/subscribe", {
    method: "POST",
    body: payload,
  });

export const getAuditLogs = (params?: AuditLogFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.entity) searchParams.append("entity", params.entity);
  if (params?.action) searchParams.append("action", params.action);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<AuditLogResponse>(
    `/analytics/audit-logs?${searchParams.toString()}`,
  );
};
