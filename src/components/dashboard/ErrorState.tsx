import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * ErrorState — the single standard failure block.
 *
 * Destructive-tinted icon, semibold title, the backend's
 * message in muted text, optional retry action. Used for
 * every query-failure surface instead of bespoke markup.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 py-8 text-center",
        className,
      )}
      role="alert"
    >
      <div
        className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
        aria-hidden="true"
      >
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
