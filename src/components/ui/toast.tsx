"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "group rounded-lg border bg-background p-4 shadow-lg",
          description: "text-sm text-muted-foreground",
          actionButton: "px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "px-3 py-1.5 text-sm font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80",
        },
      }}
    />
  );
}

export { toast } from "sonner";