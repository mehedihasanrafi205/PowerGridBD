import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  assignTechnician,
  createOutage,
  deleteOutage,
  getOutageById,
  getOutages,
  updateOutageStatus,
} from "@/api/outage.api";
import type { OutageFilters, OutageStatusPayload } from "@/types";

export const useOutages = (filters?: OutageFilters) => {
  return useQuery({
    queryKey: ["outages", filters],
    queryFn: () => getOutages(filters),
    staleTime: 60 * 1000,
  });
};

export const useOutage = (id: string) => {
  return useQuery({
    queryKey: ["outage", id],
    queryFn: () => getOutageById(id),
    enabled: !!id,
  });
};

export const useCreateOutage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      toast.success("Outage reported successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to report outage");
    },
  });
};

export const useAssignTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, technicianId }: { id: string; technicianId: string }) =>
      assignTechnician(id, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      queryClient.invalidateQueries({ queryKey: ["outage"] });
      toast.success("Technician assigned!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign technician");
    },
  });
};

export const useUpdateOutageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: OutageStatusPayload;
    }) => updateOutageStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      queryClient.invalidateQueries({ queryKey: ["outage"] });
      toast.success("Status updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update status");
    },
  });
};

export const useDeleteOutage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOutage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      toast.success("Outage deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete outage");
    },
  });
};
