import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  updateScheduleStatus,
  deleteSchedule,
} from "@/api/schedule.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ScheduleFilters,
  SchedulePayload,
  ScheduleUpdatePayload,
  ScheduleStatusPayload,
} from "@/types";

export const useSchedules = (filters?: ScheduleFilters) => {
  return useQuery({
    queryKey: ["schedules", filters],
    queryFn: () => getSchedules(filters),
    staleTime: 60 * 1000,
  });
};

export const useSchedule = (id: string) => {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => getScheduleById(id),
    enabled: !!id,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create schedule");
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ScheduleUpdatePayload;
    }) => updateSchedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      toast.success("Schedule updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update schedule");
    },
  });
};

export const useUpdateScheduleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ScheduleStatusPayload;
    }) => updateScheduleStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      toast.success("Schedule status updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update status");
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete schedule");
    },
  });
};
