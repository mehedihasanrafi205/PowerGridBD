"use client";

import type { ReactNode } from "react";
import QueryProvider from "./query.provider";
import { Toaster } from "@/components/ui/toast";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
};

export default Providers;
