import { Activity } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { auditActionBadgeVariant } from "@/lib/status-variants";
import { cn } from "@/lib/utils";

export interface FeedEvent {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actorName?: string;
  createdAt: string;
}

interface SystemEventFeedProps {
  events: FeedEvent[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

/** Map audit action to a semantic Badge variant. */

/**
 * SystemEventFeed — compact live event log (Design.md §7).
 *
 * Action badge + entity reference + actor + timestamp rows
 * for real audit events. Renders the list only — pages own
 * the surrounding Card. Empty state included.
 */
export function SystemEventFeed({
  events,
  viewAllHref,
  viewAllLabel = "View all",
  className,
}: SystemEventFeedProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <div
          className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          aria-hidden="true"
        >
          <Activity className="h-5 w-5" />
        </div>
        <p className="font-medium text-foreground">No recent activity</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          System events will appear here as they happen.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <ul className="divide-y divide-border">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-center gap-3 py-2.5 transition-colors hover:bg-muted/50"
          >
            <Badge
              variant={auditActionBadgeVariant(event.action)}
              className="shrink-0"
            >
              {event.action}
            </Badge>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {event.entity}{" "}
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  #{event.entityId.slice(0, 8)}
                </span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {event.actorName || "System"} •{" "}
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {viewAllHref && (
        <div className="pt-2 text-right">
          <Link
            href={viewAllHref}
            className="text-sm text-primary hover:underline"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
