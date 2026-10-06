"use client";

import { AlertTriangle, Clock, Database, Zap } from "lucide-react";
import {
  useAuth,
  useOutages,
  useReveal,
  useSchedules,
  useZones,
} from "@/hooks";
import { cn } from "@/lib/utils";

interface StatusItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: "up" | "down" | "stable";
}

export function LiveStatusStrip() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: outages } = useOutages({ limit: 100 });
  const { data: schedules } = useSchedules({ limit: 100 });
  const { data: zones } = useZones({ limit: 100 });

  const { ref, isVisible } = useReveal({ threshold: 0.1 });

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
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-amber-400",
      trend: activeOutages > 10 ? "up" : "stable",
    },
    {
      label: "Priority Outages",
      value: isAuthenticated ? priorityOutages : "—",
      icon: <Zap className="h-4 w-4" />,
      color: "text-red-400",
      trend: "stable",
    },
    {
      label: "Active Schedules",
      value: isAuthenticated ? activeSchedules : "—",
      icon: <Clock className="h-4 w-4" />,
      color: "text-electric-blue",
      trend: "stable",
    },
    {
      label: "Grid Zones",
      value: isAuthenticated ? totalZones : "—",
      icon: <Database className="h-4 w-4" />,
      color: "text-smart-teal",
      trend: "stable",
    },
  ];

  if (authLoading) {
    return (
      <div
        ref={ref}
        className={cn(
          "border-t border-zinc-800 bg-zinc-950/50",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <div className="h-4 w-4 rounded animate-pulse bg-zinc-700" />
                <div className="h-4 w-16 animate-pulse bg-zinc-700 rounded" />
                <div className="h-4 w-12 animate-pulse bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      ref={ref}
      className={cn(
        "border-t border-zinc-800 bg-zinc-950/50 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
      aria-label="Live system status"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM OPERATIONAL
          </div>

          <div className="w-px h-6 bg-zinc-800 md:hidden" />

          {statusItems.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap transition-all duration-300",
                isVisible && "opacity-100 translate-y-0",
                !isVisible && "opacity-0 translate-y-2",
              )}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className={cn(item.color, "flex-shrink-0")}>
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  {item.label}
                </span>
                <span className="font-mono text-sm font-medium tabular-nums text-white">
                  {item.value}
                </span>
              </div>
              {index < statusItems.length - 1 && (
                <div className="w-px h-6 bg-zinc-800 mx-2 hidden sm:block" />
              )}
            </div>
          ))}

          {!isAuthenticated && (
            <div className="flex items-center gap-2 ml-auto text-xs text-zinc-500">
              <span className="hidden sm:inline">
                Sign in to view live data
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
