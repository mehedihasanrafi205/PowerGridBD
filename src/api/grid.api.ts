import apiClient from "@/lib/apiClient";
import type {
  ZonePayload,
  SubstationPayload,
  FeederPayload,
  AreaPayload,
  ZoneFilters,
  SubstationFilters,
  FeederFilters,
  AreaFilters,
  Zone,
  Substation,
  Feeder,
  Area,
  ZonePaginatedResponse,
  SubstationPaginatedResponse,
  FeederPaginatedResponse,
  AreaPaginatedResponse,
  ZoneDetailResponse,
  SubstationDetailResponse,
  FeederDetailResponse,
  AreaDetailResponse,
} from "@/types";

// Zones
export const createZone = (payload: ZonePayload) =>
  apiClient<{ success: boolean; statusCode: number; message: string; data: Zone }>("/grid/zones", {
    method: "POST",
    body: payload,
  });

export const getZones = (params?: ZoneFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<ZonePaginatedResponse>(`/grid/zones?${searchParams.toString()}`);
};

export const getZoneById = (id: string) =>
  apiClient<ZoneDetailResponse>(`/grid/zones/${id}`);

export const updateZone = (id: string, payload: ZonePayload) =>
  apiClient<ZoneDetailResponse>(`/grid/zones/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteZone = (id: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>(`/grid/zones/${id}`, {
    method: "DELETE",
  });

// Substations
export const createSubstation = (payload: SubstationPayload) =>
  apiClient<{ success: boolean; statusCode: number; message: string; data: Substation }>(
    "/grid/substations",
    { method: "POST", body: payload }
  );

export const getSubstations = (params?: SubstationFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.zoneId) searchParams.append("zoneId", params.zoneId);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<SubstationPaginatedResponse>(`/grid/substations?${searchParams.toString()}`);
};

export const getSubstationById = (id: string) =>
  apiClient<SubstationDetailResponse>(`/grid/substations/${id}`);

export const updateSubstation = (id: string, payload: SubstationPayload) =>
  apiClient<SubstationDetailResponse>(`/grid/substations/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteSubstation = (id: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>(
    `/grid/substations/${id}`,
    { method: "DELETE" }
  );

// Feeders
export const createFeeder = (payload: FeederPayload) =>
  apiClient<{ success: boolean; statusCode: number; message: string; data: Feeder }>(
    "/grid/feeders",
    { method: "POST", body: payload }
  );

export const getFeeders = (params?: FeederFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.substationId) searchParams.append("substationId", params.substationId);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<FeederPaginatedResponse>(`/grid/feeders?${searchParams.toString()}`);
};

export const getFeederById = (id: string) =>
  apiClient<FeederDetailResponse>(`/grid/feeders/${id}`);

export const updateFeeder = (id: string, payload: FeederPayload) =>
  apiClient<FeederDetailResponse>(`/grid/feeders/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteFeeder = (id: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>(`/grid/feeders/${id}`, {
    method: "DELETE",
  });

// Areas
export const createArea = (payload: AreaPayload) =>
  apiClient<{ success: boolean; statusCode: number; message: string; data: Area }>("/grid/areas", {
    method: "POST",
    body: payload,
  });

export const getAreas = (params?: AreaFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.feederId) searchParams.append("feederId", params.feederId);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<AreaPaginatedResponse>(`/grid/areas?${searchParams.toString()}`);
};

export const getAreaById = (id: string) =>
  apiClient<AreaDetailResponse>(`/grid/areas/${id}`);

export const updateArea = (id: string, payload: AreaPayload) =>
  apiClient<AreaDetailResponse>(`/grid/areas/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteArea = (id: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>(`/grid/areas/${id}`, {
    method: "DELETE",
  });