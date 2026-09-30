"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import QueryProvider from "./query.provider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
};

export default Providers;
