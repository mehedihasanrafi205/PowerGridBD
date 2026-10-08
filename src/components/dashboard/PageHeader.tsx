import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  status?: ReactNode;
  className?: string;
}

/**
 * PageHeader — the single standard page heading.
 *
 * `headline-xl` title (text-3xl bold) + `body-md` muted
 * description, with an optional status indicator and a
 * trailing action cluster. Every dashboard page uses this
 * — never a bespoke h1 block.
 */
export function PageHeader({
  title,
  description,
  actions,
  status,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-start justify-between gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
        {status && <div className="mt-3">{status}</div>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
