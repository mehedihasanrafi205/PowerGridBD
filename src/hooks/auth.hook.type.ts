import {
  getMe,
  googleOAuth,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
  forgotPassword,
  resetPassword,
} from "@/api/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userRegistration,
    onSuccess: () => {
      toast.success("Registration successful! Check your email for OTP.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });
};

export const useVerifyAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyAccount,
    onSuccess: () => {
      toast.success("Email verified! Redirecting...");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Verification failed");
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: () => {
      toast.success("Welcome back!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
  });
};

export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: googleOAuth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Google login failed");
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => toast.success("Reset OTP sent to your email"),
    onError: (error: Error) =>
      toast.error(error.message || "Failed to send OTP"),
  });
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successful");
      router.push("/auth/login");
    },
    onError: (error: Error) => toast.error(error.message || "Reset failed"),
  });
};
