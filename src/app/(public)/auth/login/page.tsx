"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Shield, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getMe } from "@/api/auth.api";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, setAuthTokens } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * Tester accounts from `.env.local` (TESTER_*). One-click sign-in
 * for evaluation; each entry carries its own password since the
 * accounts do not share credentials.
 */
const demoAccounts = [
  {
    role: "ADMIN",
    name: "System Super Admin",
    email: "superadmin@powergrid.bd",
    password: "Admin@12345",
    label: "Admin",
    description: "Full system access",
    icon: Shield,
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  {
    role: "POWER_OPERATOR",
    name: "Grid Control Operator",
    email: "operator@powergrid.bd",
    password: "Operator@12345",
    label: "Power Operator",
    description: "Grid & outage management",
    icon: Zap,
    color: "bg-amber/10 text-amber border-amber/20",
  },
  {
    role: "TECHNICIAN",
    name: "Senior Field Technician",
    email: "technician@powergrid.bd",
    password: "Tech@12345",
    label: "Technician",
    description: "Assigned outage resolution",
    icon: Wrench,
    color: "bg-emerald/10 text-emerald border-emerald/20",
  },
];

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Persist the session, then resolve the real user profile.
   * The login response carries only tokens — the user object
   * must come from getMe. Returns null when the profile cannot
   * be loaded, in which case callers stay on the login page
   * instead of navigating into a certain redirect bounce.
   */
  const establishSession = async (response: AuthResponse) => {
    const accessToken = response.data?.accessToken;
    if (accessToken) {
      setAuthTokens(accessToken, response.data?.refreshToken);
    }
    try {
      // A single attempt can hit a serverless cold start; the login
      // already succeeded, so a brief retry is the honest path
      // (wrong credentials fail fast at the login POST above).
      let me: Awaited<ReturnType<typeof getMe>> | null = null;
      for (let attempt = 0; attempt < 3 && !me?.success; attempt++) {
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        try {
          const result = await getMe();
          if (result?.success) me = result;
        } catch {
          /* retry below */
        }
      }
      if (me?.success && me.data?.id && me.data?.role) {
        // Seed ["user"] so the dashboard shell mounts
        // authenticated instead of racing its own fetch.
        queryClient.setQueryData(["user"], me);
        return me.data;
      }
    } catch {
      /* fall through to the invalidation below */
    }
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    return null;
  };

  const roleRoutes: Record<string, string> = {
    CUSTOMER: "/customer",
    TECHNICIAN: "/technician",
    POWER_OPERATOR: "/operator",
    ADMIN: "/admin",
  };

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      if (response.success) {
        const user = await establishSession(response);
        if (!user) {
          toast.error("Signed in, but the profile lookup failed. Try again.");
          return;
        }
        toast.success("Login successful!");
        router.push(roleRoutes[user.role] ?? "/");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (
    email: string,
    password: string,
    role: string,
  ) => {
    setDemoLoading(role);
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      if (response.success) {
        const user = await establishSession(response);
        if (!user) {
          toast.error("Signed in, but the profile lookup failed. Try again.");
          return;
        }
        toast.success(`Login as ${user.role} successful!`);
        router.push(roleRoutes[user.role] ?? "/");
      } else {
        toast.error(response.message || "Tester login failed");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Tester login failed. Please try again.";
      toast.error(message);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <AuthShell>
      <div className="mb-8 text-center lg:text-left">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Sign In to Console
        </h1>
        <p className="text-muted-foreground">
          Enter your credentials or continue with a tester account
        </p>
      </div>

      {/* Tester persona cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {demoAccounts.map((account) => {
          const Icon = account.icon;
          return (
            <button
              type="button"
              key={account.role}
              onClick={() =>
                handleDemoLogin(account.email, account.password, account.role)
              }
              disabled={demoLoading !== null}
              className={cn(
                "group rounded-lg border p-3.5 text-left transition-all hover:shadow-md",
                account.color,
                demoLoading === account.role && "cursor-wait opacity-50",
              )}
            >
              <span className="mb-2 flex items-center justify-between">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="rounded border border-current px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider opacity-80">
                  {account.label}
                </span>
              </span>
              <span className="block text-sm font-semibold text-foreground">
                {account.name}
              </span>
              <span className="mt-0.5 block break-all font-mono text-[11px] text-muted-foreground">
                {account.email}
              </span>
              {demoLoading === account.role && (
                <span className="mt-1 block text-xs text-primary">
                  Logging in...
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign in manually
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            disabled={isLoading}
            className={cn(
              errors.email &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
            )}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              disabled={isLoading}
              className={cn(
                "pr-10",
                errors.password &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In to Grid Console"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
