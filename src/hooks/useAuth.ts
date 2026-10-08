"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, userLogout } from "@/api/auth.api";
import { clearAuthTokens } from "@/lib/apiClient";
import type { Role, User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    // Single attempt on 401 (invalid token never recovers), but
    // tolerate serverless cold-start 5xx/network blips.
    retry: (failureCount, err) => {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      if (data?.success && data.data?.id) {
        setAuthState({
          user: data.data,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    }
  }, [data, isLoading]);

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!authState.user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(authState.user.role);
  };

  const canAccess = (requiredRoles: Role | Role[]): boolean => {
    return hasRole(requiredRoles);
  };

  const logout = async () => {
    try {
      await userLogout();
    } catch (error) {
      // Server logout is best-effort (e.g. already-expired token) —
      // the local session must still be torn down below.
      console.error("Logout failed:", error);
    } finally {
      clearAuthTokens();
      setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      queryClient.clear();
      router.push("/auth/login");
    }
  };

  return {
    ...authState,
    hasRole,
    canAccess,
    logout,
    refresh: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  };
}
