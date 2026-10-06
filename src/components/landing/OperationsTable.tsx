"use client";

import { AlertTriangle, ArrowRight, Clock, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth, useOutages, useReveal, useSchedules } from "@/hooks";
import { cn } from "@/lib/utils";

const statusBadgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "success" | "warning" | "info"
> = {
  PENDING: "warning",
  ASSIGNED: "info",
  IN_PROGRESS: "default",
  RESOLVED: "success",
  RESTORED: "success",
  SCHEDULED: "info",
  ONGOING: "warning",
  COMPLETED: "success",
  CANCELLED: "secondary",
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

export function OperationsTable() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: outages, isLoading: outagesLoading } = useOutages({
    limit: 8,
    sortBy: "reportedAt",
    sortOrder: "desc",
  });
  const { data: schedules, isLoading: schedulesLoading } = useSchedules({
    limit: 8,
    sortBy: "startTime",
    sortOrder: "asc",
  });

  const { ref, isVisible } = useReveal({ threshold: 0.05 });

  const isLoading = authLoading || outagesLoading || schedulesLoading;
  const outageRows = outages?.data ?? [];
  const scheduleRows = schedules?.data ?? [];

  return (
    <section className="bg-zinc-950 py-20 lg:py-28 border-t border-zinc-900">
      <div ref={ref} className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-smart-teal">
            <span className="h-0.5 w-12 bg-smart-teal/30" />
            Live Operations Feed
            <span className="h-0.5 w-12 bg-smart-teal/30" />
          </div>
          <span className="hidden md:flex items-center gap-1.5 font-mono text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SCADA FEED
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Mission-control telemetry.
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mb-12">
          Real outage reports and load-shedding schedules, streamed from the
          operational API — exactly what your control room sees.
        </p>

        {/* Locked state for anonymous visitors */}
        {!isAuthenticated && !authLoading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-12 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">
              <Lock className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Live feed requires authentication
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto mb-6">
              The operations feed streams real outage and schedule data. Sign in
              with any demo account to see it in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/login">
                <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white gap-2">
                  Sign In to View Feed
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#roles">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-200 hover:bg-zinc-800/60"
                >
                  Explore Roles
                </Button>
              </Link>
            </div>

            {/* Static schema preview — honest representation of the feed shape */}
            <div className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 text-left overflow-x-auto">
              <pre className="font-mono text-xs leading-relaxed text-zinc-500">
                {`OUTAGE_FEED schema
  id            uuid        PRIMARY KEY
  status        enum        PENDING → … → RESTORED
  priority      boolean     SSLCommerz verified
  area          json        { feeder, substation, zone }
  timestamps    ISO-8601    reportedAt · assignedAt · resolvedAt`}
              </pre>
            </div>
          </div>
        )}

        {/* Authenticated: real data tables */}
        {isAuthenticated && (
          <div
            className={cn(
              "space-y-10 transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6",
            )}
          >
            {/* Outages table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/40">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Recent Outage Reports
                </div>
                <span className="font-mono text-xs text-zinc-500">
                  {outageRows.length} ROWS
                </span>
              </div>
              {isLoading ? (
                <div className="p-5 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 rounded-lg bg-zinc-900 animate-pulse"
                    />
                  ))}
                </div>
              ) : outageRows.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">
                  No outage reports in the system.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800/80 hover:bg-transparent">
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          ID
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Status
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Location
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Reported
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 text-right">
                          Priority
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outageRows.map((outage) => {
                        const reported = formatDateTime(outage.reportedAt);
                        return (
                          <TableRow
                            key={outage.id}
                            className="border-zinc-800/60 hover:bg-zinc-900/40"
                          >
                            <TableCell className="font-mono text-xs text-zinc-400">
                              {outage.id.slice(0, 8)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  statusBadgeVariant[outage.status] ??
                                  "secondary"
                                }
                              >
                                {outage.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-zinc-300">
                              {outage.area?.name ?? "—"}
                              {outage.area?.feeder?.name && (
                                <span className="text-zinc-500">
                                  {" "}
                                  · {outage.area.feeder.name}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-zinc-400 tabular-nums">
                              {reported.date} {reported.time}
                            </TableCell>
                            <TableCell className="text-right">
                              {outage.isPriority ? (
                                <span className="font-mono text-xs font-medium text-amber-400">
                                  PRIORITY
                                </span>
                              ) : (
                                <span className="font-mono text-xs text-zinc-600">
                                  STANDARD
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Schedules table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/40">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <Clock className="h-4 w-4 text-electric-blue" />
                  Upcoming Load-Shedding Schedules
                </div>
                <span className="font-mono text-xs text-zinc-500">
                  {scheduleRows.length} ROWS
                </span>
              </div>
              {isLoading ? (
                <div className="p-5 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 rounded-lg bg-zinc-900 animate-pulse"
                    />
                  ))}
                </div>
              ) : scheduleRows.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">
                  No load-shedding schedules published.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800/80 hover:bg-transparent">
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Title
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Type
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Window
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Status
                        </TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Recurrence
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleRows.map((schedule) => {
                        const start = formatDateTime(schedule.startTime);
                        const end = formatDateTime(schedule.endTime);
                        return (
                          <TableRow
                            key={schedule.id}
                            className="border-zinc-800/60 hover:bg-zinc-900/40"
                          >
                            <TableCell className="text-sm font-medium text-zinc-200">
                              {schedule.title}
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-xs text-zinc-400">
                                {schedule.type}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-zinc-400 tabular-nums">
                              {start.date} {start.time} → {end.date} {end.time}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  statusBadgeVariant[schedule.status] ??
                                  "secondary"
                                }
                              >
                                {schedule.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-zinc-400">
                              {schedule.recurrence ?? "NONE"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
