"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, userLogout } from "@/api/auth.api";
import { useEffect, useState } from "react";
import type { User, Role } from "@/types";

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
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      if (data?.success && data.data?.user) {
        setAuthState({
          user: data.data.user,
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
      queryClient.clear();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
