"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
  useRef,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getMe } from "@/api/auth.api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a QueryClient for the provider
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

interface GetMeResponse {
  success: boolean;
  data?: { user: User };
  message: string;
  statusCode: number;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use a ref to create the query client only once
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = createQueryClient();
  }
  const queryClient = queryClientRef.current;

  // Track if we're on the client
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user on client side only
  useEffect(() => {
    setIsClient(true);
    if (!isClient) return;

    let mounted = true;
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (mounted && response.success && response.data?.user) {
          setUser(response.data.user);
        }
      } catch {
        // Ignore errors
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      mounted = false;
    };
  }, [isClient]);

  const isAuthenticated = Boolean(user);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user,
          isLoading: isClient ? isLoading : false,
          isAuthenticated,
          refresh: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
        }}
      >
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
