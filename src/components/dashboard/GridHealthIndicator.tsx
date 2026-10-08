import { cn } from "@/lib/utils";

interface GridHealthIndicatorProps {
  /** Nodes currently energized. */
  active: number;
  /** Total nodes tracked. */
  total: number;
  label?: string;
  className?: string;
}

/**
 * GridHealthIndicator — energized share as a state bar.
 *
 * Percentage derives from real node counts; the bar state is
 * emerald (≥95%), amber (≥80%), or destructive below that.
 * Zero tracked nodes renders an honest "no data" state
 * instead of an invented 100%.
 */
export function GridHealthIndicator({
  active,
  total,
  label = "Nodes energized",
  className,
}: GridHealthIndicatorProps) {
  if (total <= 0) {
    return (
      <div className={className}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-sm text-muted-foreground">—</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" />
        <p className="mt-1 text-xs text-muted-foreground">
          No nodes tracked yet.
        </p>
      </div>
    );
  }

  const pct = Math.round((active / total) * 100);
  const state =
    pct >= 95 ? "bg-emerald" : pct >= 80 ? "bg-amber" : "bg-destructive";
  const text =
    pct >= 95 ? "text-emerald" : pct >= 80 ? "text-amber" : "text-destructive";

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn("font-mono text-sm font-semibold tabular-nums", text)}
        >
          {pct}%
          <span className="ml-1.5 font-normal text-muted-foreground">
            {active}/{total}
          </span>
        </span>
      </div>
      <div
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-all", state)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
