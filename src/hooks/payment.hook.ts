import {
  initiatePayment,
  getMyPayments,
  getPaymentByTransaction,
  refundPayment,
} from "@/api/payment.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PaymentFilters, PaymentInitiatePayload } from "@/types";

export const useMyPayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: ["payments", "my", filters],
    queryFn: () => getMyPayments(filters),
    staleTime: 60 * 1000,
  });
};

export const usePayment = (transactionId: string) => {
  return useQuery({
    queryKey: ["payment", transactionId],
    queryFn: () => getPaymentByTransaction(transactionId),
    enabled: !!transactionId,
  });
};

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentInitiatePayload) => initiatePayment(payload),
    onSuccess: (data) => {
      // Redirect to SSLCommerz gateway
      if (data.data?.gatewayUrl) {
        window.location.href = data.data.gatewayUrl;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate payment");
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => refundPayment(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "my"] });
      toast.success("Refund processed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process refund");
    },
  });
};