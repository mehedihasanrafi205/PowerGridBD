import {
  getOperationalAnalytics,
  getPerformanceAnalytics,
  getGeographicalAnalytics,
  getFinancialAnalytics,
  getTrendsAnalytics,
  getMySummary,
  getTechnicianSummary,
  getAuditLogs,
} from "@/api/analytics.api";
import { useQuery } from "@tanstack/react-query";
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

export const useAuditLogs = (filters?: { entity?: string; action?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }) => {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => getAuditLogs(filters),
    staleTime: 60 * 1000,
  });
};