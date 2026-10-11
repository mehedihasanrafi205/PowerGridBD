"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
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
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Get email from query params
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp", "");

  const handleVerify = async (data: OTPForm) => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/verify-email", {
        email,
        otp: data.otp,
      });
      if (response.success) {
        toast.success("Email verified successfully! Redirecting...");
        router.push("/");
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
    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }
    setResendLoading(true);
    try {
      await api.post("/auth/resend-otp", { email });
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

  const handleOtpChange = (value: string) => {
    setValue("otp", value, { shouldValidate: true });
  };

  return (
    <AuthShell>
      <div className="flex min-h-[calc(100svh-5rem)] flex-col justify-center lg:min-h-0">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-blue/10">
            <svg
              className="h-7 w-7 text-electric-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Verify Your Email
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            We&apos;ve sent a 6-digit verification code to
            <br />
            <span className="break-all font-medium text-foreground">
              {email || "your email"}
            </span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleVerify)}
          className="mx-auto w-full max-w-xs space-y-5"
        >
          <div className="space-y-3">
            <Label
              htmlFor="otp"
              className="block text-center text-sm font-medium text-foreground"
            >
              Verification Code
            </Label>
            <div className="flex justify-center">
              <InputOTP
                name="otp"
                value={otpValue}
                onChange={handleOtpChange}
                disabled={isLoading}
                length={6}
                containerClassName="gap-1.5 sm:gap-2"
                className="w-full justify-center"
                inputClassName={cn(
                  "h-12 w-10 sm:w-11",
                  errors.otp &&
                    "border-destructive focus:border-destructive focus:ring-destructive/20",
                )}
              />
            </div>
            {errors.otp && (
              <p className="text-sm text-destructive text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold text-white"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mx-auto mt-6 w-full max-w-xs space-y-4 text-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span
              className="h-px min-w-4 flex-1 bg-border"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap">
              Didn&apos;t receive the code?
            </span>
            <span
              className="h-px min-w-4 flex-1 bg-border"
              aria-hidden="true"
            />
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={handleResendOtp}
            disabled={resendLoading || resendCooldown > 0}
            className="h-11 w-full"
          >
            {resendLoading
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : "Resend OTP"}
          </Button>
        </div>

        <div className="mt-7 text-center">
          <p className="text-sm text-muted-foreground">
            Back to{" "}
            <a
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
