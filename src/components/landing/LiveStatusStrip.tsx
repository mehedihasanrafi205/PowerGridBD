"use client";

import { AlertTriangle, Clock, Database, Zap } from "lucide-react";
import { useAuth, useOutages, useSchedules, useZones } from "@/hooks";
import { cn } from "@/lib/utils";

interface StatusItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

/**
 * LiveStatusStrip — telemetry rail anchored directly under the
 * navigation bar.
 *
 * Visibility-first: the strip renders statically and is fully
 * visible on the first paint. Ambient status pulses are CSS-only
 * (animate-ping) and are disabled under prefers-reduced-motion.
 *
 * Data integrity: values come from the real backend via TanStack
 * Query. Unauthenticated visitors see an honest "—" placeholder
 * and a sign-in prompt — never invented grid measurements.
 */
export function LiveStatusStrip() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: outages } = useOutages({ limit: 100 });
  const { data: schedules } = useSchedules({ limit: 100 });
  const { data: zones } = useZones({ limit: 100 });

  const activeOutages =
    outages?.data?.filter((o) =>
      ["PENDING", "ASSIGNED", "IN_PROGRESS"].includes(o.status),
    ).length ?? 0;

  const priorityOutages =
    outages?.data?.filter((o) => o.isPriority).length ?? 0;

  const activeSchedules =
    schedules?.data?.filter(
      (s) => s.status === "SCHEDULED" || s.status === "ONGOING",
    ).length ?? 0;

  const totalZones = zones?.data?.length ?? 0;

  const statusItems: StatusItem[] = [
    {
      label: "Active Outages",
      value: isAuthenticated ? activeOutages : "—",
      icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
      color: "text-amber-400",
    },
    {
      label: "Priority Outages",
      value: isAuthenticated ? priorityOutages : "—",
      icon: <Zap className="h-4 w-4" aria-hidden="true" />,
      color: "text-red-400",
    },
    {
      label: "Active Schedules",
      value: isAuthenticated ? activeSchedules : "—",
      icon: <Clock className="h-4 w-4" aria-hidden="true" />,
      color: "text-electric-blue",
    },
    {
      label: "Grid Zones",
      value: isAuthenticated ? totalZones : "—",
      icon: <Database className="h-4 w-4" aria-hidden="true" />,
      color: "text-smart-teal",
    },
  ];

  return (
    <section
      className="border-t border-zinc-800 bg-zinc-950/50"
      aria-label="Live system status"
    >
      <div className="container mx-auto px-4 py-3">
        {authLoading ? (
          /* Loading state — visible placeholder bars, never opacity-0 */
          <div className="flex items-center gap-8 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 whitespace-nowrap"
                aria-hidden="true"
              >
                <div className="h-4 w-4 animate-pulse rounded bg-zinc-700" />
                <div className="h-4 w-20 animate-pulse rounded bg-zinc-700" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:gap-10">
            {/* System status */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              SYSTEM OPERATIONAL
            </div>

            {statusItems.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <span className={cn(item.color, "flex-shrink-0")}>
                  {item.icon}
                </span>
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  {item.label}
                </span>
                <span className="font-mono text-sm font-medium tabular-nums text-white">
                  {item.value}
                </span>
                {index < statusItems.length - 1 && (
                  <span
                    className="mx-2 hidden h-6 w-px bg-zinc-800 sm:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}

            {!isAuthenticated && (
              <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
                <span className="hidden sm:inline">
                  Sign in to view live data
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
