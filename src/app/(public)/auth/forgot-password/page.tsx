"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks";
import { cn } from "@/lib/utils";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const forgotMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotForm) => {
    forgotMutation.mutate(data, { onSuccess: () => setSent(true) });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12">
      {/* Theme control — accessible before sign-in */}
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-2xl font-bold text-primary"
          >
            PowerGridBD
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            Enter your account email to receive a reset code
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10">
              <CheckCircle
                className="h-6 w-6 text-emerald"
                aria-hidden="true"
              />
            </div>
            <p className="text-foreground">
              Reset code sent to{" "}
              <span className="font-mono font-medium">
                {getValues("email")}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Check your inbox, then continue to set a new password.
            </p>
            <Link href="/auth/reset-password">
              <Button className="w-full">Continue to Reset</Button>
            </Link>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-sm text-primary hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={forgotMutation.isPending}
                className={cn(
                  errors.email &&
                    "border-destructive focus:border-destructive focus:ring-destructive/20",
                )}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={forgotMutation.isPending}
            >
              {forgotMutation.isPending ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
