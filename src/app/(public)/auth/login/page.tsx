"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/apiClient";
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
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  {
    role: "POWER_OPERATOR",
    name: "Grid Control Operator",
    email: "operator@powergrid.bd",
    password: "Operator@12345",
    label: "Power Operator",
    description: "Grid & outage management",
    color: "bg-amber/10 text-amber border-amber/20",
  },
  {
    role: "TECHNICIAN",
    name: "Senior Field Technician",
    email: "technician@powergrid.bd",
    password: "Tech@12345",
    label: "Technician",
    description: "Assigned outage resolution",
    color: "bg-emerald/10 text-emerald border-emerald/20",
  },
];

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

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

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

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      if (response.success) {
        toast.success("Login successful!");
        const role = response.data?.user?.role;
        const roleRoutes: Record<string, string> = {
          CUSTOMER: "/customer",
          TECHNICIAN: "/technician",
          POWER_OPERATOR: "/operator",
          ADMIN: "/admin",
        };
        router.push(role ? roleRoutes[role] : "/");
        router.refresh();
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
        toast.success(`Login as ${role} successful!`);
        const userRole = response.data?.user?.role ?? role;
        const roleRoutes: Record<string, string> = {
          CUSTOMER: "/customer",
          TECHNICIAN: "/technician",
          POWER_OPERATOR: "/operator",
          ADMIN: "/admin",
        };
        router.push(roleRoutes[userRole] ?? "/");
        router.refresh();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12">
      {/* Theme control — accessible before sign-in */}
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-6"
          >
            PowerGridBD
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Tester Login Section */}
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with a tester account
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <button
                type="button"
                key={account.role}
                onClick={() =>
                  handleDemoLogin(account.email, account.password, account.role)
                }
                disabled={demoLoading !== null}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md text-left",
                  account.color,
                  demoLoading === account.role && "opacity-50 cursor-wait",
                )}
              >
                <div className="font-semibold">{account.label}</div>
                <div className="text-xs font-medium mt-0.5">{account.name}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono break-all">
                  {account.email}
                </div>
                {demoLoading === account.role && (
                  <div className="text-xs text-primary mt-1">Logging in...</div>
                )}
              </button>
            ))}
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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
