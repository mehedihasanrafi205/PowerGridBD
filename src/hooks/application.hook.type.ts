import {
  createApplication,
  verifyApplication,
  resendApplicationOtp,
  getMyApplication,
  getApplications,
  getApplicationById,
  reviewApplication,
} from "@/api/application.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ApplicationFilters,
  ApplicationPayload,
  ApplicationReviewPayload,
} from "@/types";

export const useMyApplication = (email: string) => {
  return useQuery({
    queryKey: ["application", "my", email],
    queryFn: () => getMyApplication(email),
    enabled: !!email,
    staleTime: 60 * 1000,
  });
};

export const useApplications = (filters?: ApplicationFilters) => {
  return useQuery({
    queryKey: ["applications", filters],
    queryFn: () => getApplications(filters),
    staleTime: 60 * 1000,
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      toast.success("Application submitted! Check your email for OTP.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit application");
    },
  });
};

export const useVerifyApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application verified! Redirecting...");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Verification failed");
    },
  });
};

export const useResendApplicationOtp = () => {
  return useMutation({
    mutationFn: (email: string) => resendApplicationOtp(email),
    onSuccess: () => toast.success("OTP resent!"),
    onError: (error: Error) =>
      toast.error(error.message || "Failed to resend OTP"),
  });
};

export const useReviewApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { status: "APPROVED" | "REJECTED"; reason?: string };
    }) => reviewApplication(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application reviewed!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to review application");
    },
  });
};
