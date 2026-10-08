"use client";

import type { ReactNode } from "react";
import { AnimationProviders } from "@/components/animation";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "./auth.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimationProviders>
          <Toaster />
          {children}
        </AnimationProviders>
      </AuthProvider>
    </ThemeProvider>
  );
}

export { AuthProvider } from "./auth.provider";
