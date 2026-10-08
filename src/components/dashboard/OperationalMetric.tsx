import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OperationalMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  delta?: string;
  deltaDirection?: "up" | "down" | "neutral";
  className?: string;
}

/**
 * OperationalMetric — a KPI card with a mono value.
 *
 * Label sits above a large tabular-numeral value (JetBrains Mono),
 * with an optional unit, icon, and signed delta. Uses semantic
 * surface tokens (bg-card, text-foreground) so it adapts to the
 * active theme.
 */
export function OperationalMetric({
  label,
  value,
  unit,
  icon,
  delta,
  deltaDirection = "neutral",
  className,
}: OperationalMetricProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span
            className="flex-shrink-0 text-muted-foreground"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>

      {delta && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {deltaDirection === "up" && (
            <ArrowUpRight
              className="h-3.5 w-3.5 text-emerald"
              aria-hidden="true"
            />
          )}
          {deltaDirection === "down" && (
            <ArrowDownRight
              className="h-3.5 w-3.5 text-destructive"
              aria-hidden="true"
            />
          )}
          <span className="text-muted-foreground">{delta}</span>
        </div>
      )}
    </div>
  );
}
