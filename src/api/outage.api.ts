import apiClient from "@/lib/apiClient";
import type {
  OutagePayload,
  OutageStatusPayload,
  OutageFilters,
  Outage,
  OutagePaginatedResponse,
  OutageDetailResponse,
} from "@/types";

export const createOutage = (payload: OutagePayload) =>
  apiClient<{
    success: boolean;
    statusCode: number;
    message: string;
    data: Outage;
  }>("/outage", {
    method: "POST",
    body: payload,
  });

export const getOutages = (params?: OutageFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.status?.length)
    params.status.forEach((s) => searchParams.append("status", s));
  if (params?.areaId) searchParams.append("areaId", params.areaId);
  if (params?.isPriority) searchParams.append("isPriority", "true");
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  if (params?.from) searchParams.append("from", params.from);
  if (params?.to) searchParams.append("to", params.to);
  return apiClient<OutagePaginatedResponse>(
    `/outage?${searchParams.toString()}`,
  );
};

export const getOutageById = (id: string) =>
  apiClient<OutageDetailResponse>(`/outage/${id}`);

export const assignTechnician = (id: string, technicianId: string) =>
  apiClient<OutageDetailResponse>(`/outage/${id}/assign`, {
    method: "PATCH",
    body: { technicianId },
  });

export const updateOutageStatus = (id: string, payload: OutageStatusPayload) =>
  apiClient<OutageDetailResponse>(`/outage/${id}/status`, {
    method: "PATCH",
    body: payload,
  });

export const deleteOutage = (id: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>(
    `/outage/${id}`,
    {
      method: "DELETE",
    },
  );
