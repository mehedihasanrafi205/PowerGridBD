import apiClient from "@/lib/apiClient";
import type {
  Outage,
  OutageDetailResponse,
  OutageFilters,
  OutagePaginatedResponse,
  OutagePayload,
  OutageStatusPayload,
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
  if (params?.status?.length) {
    for (const s of params.status) {
      searchParams.append("status", s);
    }
  }
  if (params?.areaId) {
    const areaIds = Array.isArray(params.areaId)
      ? params.areaId
      : [params.areaId];
    for (const id of areaIds) {
      searchParams.append("areaId", id);
    }
  }
  if (params?.feederId) searchParams.append("feederId", params.feederId);
  if (params?.substationId)
    searchParams.append("substationId", params.substationId);
  if (params?.zoneId) searchParams.append("zoneId", params.zoneId);
  if (params?.isPriority) searchParams.append("isPriority", "true");
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.technicianId)
    searchParams.append("technicianId", params.technicianId);
  if (params?.customerId) searchParams.append("customerId", params.customerId);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  if (params?.from) searchParams.append("from", params.from);
  if (params?.to) searchParams.append("to", params.to);
  if (params?.assignedFrom)
    searchParams.append("assignedFrom", params.assignedFrom);
  if (params?.assignedTo) searchParams.append("assignedTo", params.assignedTo);
  if (params?.resolvedFrom)
    searchParams.append("resolvedFrom", params.resolvedFrom);
  if (params?.resolvedTo) searchParams.append("resolvedTo", params.resolvedTo);
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
