"use client";

import { AnimatePresence, motion } from "framer-motion";
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
import { easing } from "@/lib/animation";
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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

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
    <motion.section
      id="operations"
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-zinc-950 py-20 lg:py-28 border-t border-zinc-900"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-between mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-smart-teal">
            <span className="h-0.5 w-12 bg-smart-teal/30" />
            Live Operations Feed
            <span className="h-0.5 w-12 bg-smart-teal/30" />
          </div>
          <span className="hidden md:flex items-center gap-1.5 font-mono text-xs text-zinc-500">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            SCADA FEED
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Mission-control telemetry.
        </motion.h2>
        <motion.p
          className="text-lg text-zinc-400 max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Real outage reports and load-shedding schedules, streamed from the
          operational API — exactly what your control room sees.
        </motion.p>

        {/* Locked state for anonymous visitors */}
        <AnimatePresence mode="wait">
          {!isAuthenticated && !authLoading && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-12 text-center"
            >
              <motion.div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Lock className="h-6 w-6 text-zinc-400" />
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Live feed requires authentication
              </motion.h3>
              <motion.p
                className="text-zinc-400 max-w-md mx-auto mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                The operations feed streams real outage and schedule data. Sign
                in with any demo account to see it in action.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>

              {/* Static schema preview */}
              <motion.div
                className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 text-left overflow-x-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <pre className="font-mono text-xs leading-relaxed text-zinc-500">
                  {`OUTAGE_FEED schema
  id            uuid        PRIMARY KEY
  status        enum        PENDING → … → RESTORED
  priority      boolean     SSLCommerz verified
  area          json        { feeder, substation, zone }
  timestamps    ISO-8601    reportedAt · assignedAt · resolvedAt`}
                </pre>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authenticated: real data tables */}
        <AnimatePresence mode="wait">
          {isAuthenticated && (
            <motion.div
              key="authenticated"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              className="space-y-10"
            >
              {/* Outages table */}
              <motion.div
                variants={rowVariants}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
              >
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
                      <motion.div
                        key={i}
                        className="h-10 rounded-lg bg-zinc-900"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                ) : outageRows.length === 0 ? (
                  <motion.div
                    className="p-10 text-center text-sm text-zinc-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No outage reports in the system.
                  </motion.div>
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
                        <AnimatePresence mode="wait">
                          {outageRows.map((outage) => {
                            const reported = formatDateTime(outage.reportedAt);
                            return (
                              <motion.tr
                                key={outage.id}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
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
                                    <motion.span
                                      className="font-mono text-xs font-medium text-amber-400"
                                      animate={{
                                        boxShadow: [
                                          "0 0 0px rgba(251,191,36,0)",
                                          "0 0 8px rgba(251,191,36,0.6)",
                                          "0 0 0px rgba(251,191,36,0)",
                                        ],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                      }}
                                    >
                                      PRIORITY
                                    </motion.span>
                                  ) : (
                                    <span className="font-mono text-xs text-zinc-600">
                                      STANDARD
                                    </span>
                                  )}
                                </TableCell>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </motion.div>

              {/* Schedules table */}
              <motion.div
                variants={rowVariants}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
              >
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
                      <motion.div
                        key={i}
                        className="h-10 rounded-lg bg-zinc-900"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                ) : scheduleRows.length === 0 ? (
                  <motion.div
                    className="p-10 text-center text-sm text-zinc-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No load-shedding schedules published.
                  </motion.div>
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
                        <AnimatePresence mode="wait">
                          {scheduleRows.map((schedule) => {
                            const start = formatDateTime(schedule.startTime);
                            const end = formatDateTime(schedule.endTime);
                            return (
                              <motion.tr
                                key={schedule.id}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
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
                                  {start.date} {start.time} → {end.date}{" "}
                                  {end.time}
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
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
