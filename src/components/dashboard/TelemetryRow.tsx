import { cn } from "@/lib/utils";
import { type GridStatus, GridStatusIndicator } from "./GridStatusIndicator";

interface TelemetryRowProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: GridStatus;
  className?: string;
}

/**
 * TelemetryRow — a compact label/value row for telemetry
 * panels and status decks.
 *
 * Label is muted on the left; the value is a tabular-numeral
 * mono reading on the right, with an optional unit and an
 * optional GridStatus dot.
 */
export function TelemetryRow({
  label,
  value,
  unit,
  status,
  className,
}: TelemetryRowProps) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 py-2", className)}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        {status && <GridStatusIndicator status={status} pulse={false} />}
        <span className="font-mono text-sm font-medium tabular-nums text-foreground">
          {value}
          {unit && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </span>
      </span>
    </div>
  );
}
