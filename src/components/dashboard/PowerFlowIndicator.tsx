import { cn } from "@/lib/utils";

interface PowerFlowIndicatorProps {
  from: string;
  to: string;
  /** When false the line renders idle (no traveling pulse). */
  active?: boolean;
  className?: string;
}

/**
 * PowerFlowIndicator — animated transmission segment.
 *
 * A track between two labeled endpoints with a traveling
 * pulse while energized. The pulse is pure CSS (disabled
 * under prefers-reduced-motion); labels stay as text so
 * the path is never color- or motion-only.
 */
export function PowerFlowIndicator({
  from,
  to,
  active = true,
  className,
}: PowerFlowIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="shrink-0 text-xs font-medium text-foreground">
        {from}
      </span>
      <span
        className="relative h-0.5 min-w-8 flex-1 overflow-hidden rounded-full bg-border"
        aria-hidden="true"
      >
        {active && <span className="power-flow-pulse" />}
      </span>
      <span className="shrink-0 text-xs font-medium text-foreground">{to}</span>
    </div>
  );
}
