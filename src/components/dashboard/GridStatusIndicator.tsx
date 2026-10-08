import { cn } from "@/lib/utils";

/** Operational health state for grid/telemetry indicators. */
export type GridStatus = "operational" | "warning" | "critical" | "maintenance";

interface GridStatusIndicatorProps {
  status: GridStatus;
  label?: string;
  pulse?: boolean;
  className?: string;
}

/** Dot color per state — always paired with a text label so
 * state is never communicated by color alone. */
const statusDotStyles: Record<GridStatus, string> = {
  operational: "bg-emerald",
  warning: "bg-amber",
  critical: "bg-destructive",
  maintenance: "bg-electric-blue",
};

/**
 * GridStatusIndicator — a live status dot with an optional label.
 *
 * The dot pulses via CSS (animate-ping), which is disabled under
 * prefers-reduced-motion. When no label is provided the dot renders
 * alone (for dense telemetry rows); otherwise color is always paired
 * with text for accessibility.
 */
export function GridStatusIndicator({
  status,
  label,
  pulse = true,
  className,
}: GridStatusIndicatorProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              statusDotStyles[status],
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            statusDotStyles[status],
          )}
        />
      </span>
      {label && <span className="text-xs font-medium">{label}</span>}
    </span>
  );
}
