"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth.provider";
import { Toaster } from "@/components/ui/toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toaster />
      {children}
    </AuthProvider>
  );
}

export { AuthProvider } from "./auth.provider";
