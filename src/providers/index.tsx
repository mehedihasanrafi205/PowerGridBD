"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";
import AuthProvider from "./auth.provider";
import { Toaster } from "@/components/ui/toast";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <QueryProvider>
        <Toaster />
        {children}
      </QueryProvider>
    </AuthProvider>
  );
};

export default Providers;