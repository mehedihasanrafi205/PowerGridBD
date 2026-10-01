"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPForm = z.infer<typeof otpSchema>;

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleVerify = async (data: OTPForm) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/verify-email", {
        otp: data.otp,
      });
      if (response.success) {
        toast.success("Email verified successfully! Redirecting...");
        router.push("/");
        router.refresh();
      } else {
        toast.error(response.message || "Verification failed");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await api.post("/auth/resend-otp");
      toast.success("OTP resent! Please check your email.");
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to resend OTP";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to your email address
          </p>
        </div>

        <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <InputOTP
              {...register("otp")}
              disabled={isLoading}
              className={cn(
                errors.otp &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20",
              )}
            />
            {errors.otp && (
              <p className="text-sm text-destructive">{errors.otp.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResendOtp}
            disabled={resendLoading || resendCooldown > 0}
            className="w-full"
          >
            {resendLoading
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : "Resend OTP"}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Back to{" "}
            <a
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
