import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * EmptyState — the single standard "no data" block.
 *
 * Muted icon in a rounded container, semibold title,
 * muted description, optional action. Replaces every
 * bespoke `py-8 text-center text-muted-foreground` div
 * so empty states look identical across the product.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 py-8 text-center",
        className,
      )}
    >
      <div
        className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p className="font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
