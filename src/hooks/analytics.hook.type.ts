import {
  getOperationalAnalytics,
  getPerformanceAnalytics,
  getGeographicalAnalytics,
  getFinancialAnalytics,
  getTrendsAnalytics,
  getMySummary,
  getTechnicianSummary,
  getAuditLogs,
  getSlaPlans,
  subscribeSla,
  getTechnicianWorkload,
} from "@/api/analytics.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AuditLogFilters } from "@/types";

export const useOperationalAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "operational"],
    queryFn: getOperationalAnalytics,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePerformanceAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "performance"],
    queryFn: getPerformanceAnalytics,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGeographicalAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "geographical"],
    queryFn: getGeographicalAnalytics,
    staleTime: 2 * 60 * 1000,
  });
};

export const useFinancialAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "financial"],
    queryFn: getFinancialAnalytics,
    staleTime: 2 * 60 * 1000,
  });
};

export const useTrendsAnalytics = (days?: number) => {
  return useQuery({
    queryKey: ["analytics", "trends", days],
    queryFn: () => getTrendsAnalytics(days),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMySummary = () => {
  return useQuery({
    queryKey: ["analytics", "my-summary"],
    queryFn: getMySummary,
    staleTime: 60 * 1000,
  });
};

export const useTechnicianSummary = () => {
  return useQuery({
    queryKey: ["analytics", "technician-summary"],
    queryFn: getTechnicianSummary,
    staleTime: 60 * 1000,
  });
};

export const useTechnicianWorkload = () => {
  return useQuery({
    queryKey: ["analytics", "technician-workload"],
    queryFn: getTechnicianWorkload,
    staleTime: 60 * 1000,
  });
};

export const useSlaPlans = () => {
  return useQuery({
    queryKey: ["sla", "plans"],
    queryFn: getSlaPlans,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscribeSla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { planId: string }) => subscribeSla(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "my-summary"] });
      queryClient.invalidateQueries({ queryKey: ["sla", "plans"] });
      toast.success("SLA subscription successful!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to subscribe to SLA");
    },
  });
};

export const useAuditLogs = (filters?: { searchTerm?: string; entity?: string; action?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }) => {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => getAuditLogs(filters),
    staleTime: 60 * 1000,
  });
};