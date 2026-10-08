"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useResendApplicationOtp, useVerifyApplication } from "@/hooks";
import { cn } from "@/lib/utils";

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type VerifyForm = z.infer<typeof verifySchema>;

/**
 * Application email verification. The email arrives prefilled
 * from the application step (used for OTP resends); the code
 * itself verifies the pending application.
 */
export default function ApplicationVerifyForm() {
  const searchParams = useSearchParams();
  const [verified, setVerified] = useState(false);
  const verifyMutation = useVerifyApplication();
  const resendMutation = useResendApplicationOtp();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
    },
  });

  const onSubmit = (data: VerifyForm) => {
    verifyMutation.mutate(data.otp, {
      onSuccess: () => setVerified(true),
    });
  };

  const onResend = () => {
    const email = getValues("email");
    if (!email) return;
    resendMutation.mutate(email);
  };

  if (verified) {
    return (
      <div className="mx-auto w-full max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10">
          <span className="font-mono text-xl font-bold text-emerald">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Application verified</h2>
        <p className="text-zinc-400">
          Your application is now in the operator review queue. You will be
          contacted once a decision is made.
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-2">
            Back to home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8"
      >
        <div className="space-y-2">
          <Label htmlFor="verify-email">Email</Label>
          <Input
            id="verify-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            disabled={verifyMutation.isPending}
            className={cn(
              "bg-zinc-900 border-zinc-700 text-white",
              errors.email && "border-destructive",
            )}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="verify-otp">Verification Code</Label>
          <InputOTP
            {...register("otp")}
            disabled={verifyMutation.isPending}
            className={cn(errors.otp && "border-destructive")}
          />
          {errors.otp && (
            <p className="text-sm text-destructive">{errors.otp.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? "Verifying…" : "Verify Application"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onResend}
            disabled={resendMutation.isPending}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            {resendMutation.isPending ? "Sending…" : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
