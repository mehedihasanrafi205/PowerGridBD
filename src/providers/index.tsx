"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth.provider";
import { Toaster } from "@/components/ui/toast";
import { AnimationProviders } from "@/components/animation";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AnimationProviders>
        <Toaster />
        {children}
      </AnimationProviders>
    </AuthProvider>
  );
}

export { AuthProvider } from "./auth.provider";