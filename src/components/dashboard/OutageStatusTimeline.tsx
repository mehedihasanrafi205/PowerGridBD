import { cn } from "@/lib/utils";
import type { OutageStatus } from "@/types";

interface OutageStatusTimelineProps {
  currentStatus: OutageStatus;
  className?: string;
}

/** The five-stage restoration lifecycle. */
const LIFECYCLE: OutageStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "RESTORED",
];

/** Stage marker color — semantic per Design.md. */
const stageStyles: Record<OutageStatus, string> = {
  PENDING: "bg-amber",
  ASSIGNED: "bg-smart-teal",
  IN_PROGRESS: "bg-electric-blue",
  RESOLVED: "bg-emerald",
  RESTORED: "bg-emerald",
  CANCELLED: "bg-muted-foreground",
  FAILED: "bg-destructive",
};

/**
 * OutageStatusTimeline — horizontal five-stage lifecycle
 * (PENDING → ASSIGNED → IN_PROGRESS → RESOLVED → RESTORED).
 *
 * Reached stages render as filled markers joined by filled
 * connectors; the current stage carries a focus ring.
 * CANCELLED/FAILED render as terminal states with no stages
 * completed. Each stage label is always visible (never
 * color-only).
 */
export function OutageStatusTimeline({
  currentStatus,
  className,
}: OutageStatusTimelineProps) {
  const currentIndex = LIFECYCLE.indexOf(currentStatus);
  const isTerminal = currentIndex === -1;

  return (
    <div className={className}>
      <ol
        className="flex items-center"
        aria-label={`Outage lifecycle — current stage: ${currentStatus}`}
      >
        {LIFECYCLE.map((stage, index) => {
          const reached = !isTerminal && index <= currentIndex;
          const isCurrent = !isTerminal && index === currentIndex;

          return (
            <li key={stage} className="flex items-center">
              {index > 0 && (
                <span
                  className={cn(
                    "h-0.5 w-4 sm:w-8",
                    reached ? "bg-electric-blue" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              )}
              <span className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "h-3 w-3 rounded-full border-2",
                    reached
                      ? cn("border-transparent", stageStyles[stage])
                      : "border-border bg-transparent",
                    isCurrent && "ring-2 ring-ring ring-offset-1",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wider",
                    reached ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {stage}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      {isTerminal && (
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-destructive">
          {currentStatus}
        </p>
      )}
    </div>
  );
}
