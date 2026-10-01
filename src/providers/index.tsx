"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";
import { AuthProvider } from "./auth.provider";
import { Toaster } from "@/components/ui/toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <Toaster />
        {children}
      </QueryProvider>
    </AuthProvider>
  );
}

export { AuthProvider } from "./auth.provider";
export { default as QueryProvider } from "./query.provider";
