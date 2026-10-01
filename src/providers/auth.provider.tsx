"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/api/auth.api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading && error) {
      queryClient.removeQueries({ queryKey: ["user"] });
    }
  }, [error, isLoading, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: data?.success && data.data?.user ? data.data.user : null,
        isLoading,
        isAuthenticated: data?.success && !!data.data?.user,
        refresh: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}