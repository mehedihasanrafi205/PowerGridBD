"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks";
import { cn } from "@/lib/utils";

const resetSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetForm) => {
    resetMutation.mutate(data);
  };

  return (
    <AuthShell>
      <div className="mb-8 text-center lg:text-left">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Set New Password
        </h1>
        <p className="text-muted-foreground">
          Enter the 6-digit code from your email plus your new password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Reset Code</Label>
          <InputOTP
            {...register("otp")}
            disabled={resetMutation.isPending}
            className={cn(
              errors.otp &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
            )}
          />
          {errors.otp && (
            <p className="text-sm text-destructive">{errors.otp.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={resetMutation.isPending}
            className={cn(
              errors.password &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
            )}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            disabled={resetMutation.isPending}
            className={cn(
              errors.confirmPassword &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
            )}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={resetMutation.isPending}
        >
          {resetMutation.isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t get a code?{" "}
          <Link
            href="/auth/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            Resend code
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
