import { FileSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 — rendered for unknown routes.
 *
 * Theme-aware, on-system. Offers the three most useful
 * exits: home, role dashboard entry, and outage reporting.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <FileSearch className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="font-mono text-sm font-semibold tabular-nums text-primary">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The address doesn&apos;t match any PowerGridBD route. It may have
          moved, or you may have followed a stale link.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">Back to home</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
          <Link href="/customer/outage/report">
            <Button variant="ghost" className="w-full sm:w-auto">
              Report an outage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
