"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary fallback.
 *
 * Catches render-time failures anywhere in the tree and
 * offers a retry (re-render the segment) plus safe exits.
 * Never leaks stack traces to the UI; the digest aids
 * support triage if the user reports it.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-muted-foreground">
          This section failed to load.
          {error.digest && (
            <>
              {" "}
              Reference{" "}
              <span className="font-mono text-sm">{error.digest}</span>.
            </>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
