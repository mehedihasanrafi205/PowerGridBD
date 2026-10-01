import apiClient from "@/lib/apiClient";
import type {
  SchedulePayload,
  ScheduleUpdatePayload,
  ScheduleStatusPayload,
  ScheduleFilters,
  Schedule,
  SchedulePaginatedResponse,
  ScheduleDetailResponse,
} from "@/types";

export const createSchedule = (payload: SchedulePayload) =>
  apiClient<{
    success: boolean;
    statusCode: number;
    message: string;
    data: Schedule;
  }>("/schedule", {
    method: "POST",
    body: payload,
  });

export const getSchedules = (params?: ScheduleFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.status?.length)
    params.status.forEach((s) => searchParams.append("status", s));
  if (params?.type?.length)
    params.type.forEach((t) => searchParams.append("type", t));
  if (params?.feederId) searchParams.append("feederId", params.feederId);
  if (params?.areaId) searchParams.append("areaId", params.areaId);
  if (params?.from) searchParams.append("from", params.from);
  if (params?.to) searchParams.append("to", params.to);
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<SchedulePaginatedResponse>(
    `/schedule?${searchParams.toString()}`,
  );
};

export const getScheduleById = (id: string) =>
  apiClient<ScheduleDetailResponse>(`/schedule/${id}`);

export const updateSchedule = (id: string, payload: ScheduleUpdatePayload) =>
  apiClient<ScheduleDetailResponse>(`/schedule/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateScheduleStatus = (
  id: string,
  payload: ScheduleStatusPayload,
) =>
  apiClient<ScheduleDetailResponse>(`/schedule/${id}/status`, {
    method: "PATCH",
    body: payload,
  });

export const deleteSchedule = (id: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>(
    `/schedule/${id}`,
    {
      method: "DELETE",
    },
  );
