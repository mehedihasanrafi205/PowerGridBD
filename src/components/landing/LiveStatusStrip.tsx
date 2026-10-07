"use client";

import { motion, stagger } from "framer-motion";
import { AlertTriangle, Clock, Database, Zap } from "lucide-react";
import {
  useAuth,
  useOutages,
  useReveal,
  useSchedules,
  useZones,
} from "@/hooks";
import { easing } from "@/lib/animation";
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easing.easeOut },
    },
  };

  if (authLoading) {
    return (
      <motion.div
        ref={ref}
        initial={false}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        className={cn(
          "border-t border-zinc-800 bg-zinc-950/50",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <motion.div
                  className="h-4 w-4 rounded bg-zinc-700"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
                <motion.div
                  className="h-4 w-16 bg-zinc-700 rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2 + 0.1,
                  }}
                />
                <motion.div
                  className="h-4 w-12 bg-zinc-700 rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2 + 0.2,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(
        "border-t border-zinc-800 bg-zinc-950/50 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
      aria-label="Live system status"
    >
      <div className="container mx-auto px-4 py-3">
        <motion.div
          className="flex flex-wrap items-center gap-6 md:gap-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="flex items-center gap-2 text-xs font-medium text-zinc-400"
            variants={itemVariants}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            SYSTEM OPERATIONAL
          </motion.div>

          <div className="w-px h-6 bg-zinc-800 md:hidden" />

          {statusItems.map((item, index) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <motion.span
                className={cn(item.color, "flex-shrink-0")}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {item.icon}
              </motion.span>
              <motion.div className="flex flex-col" variants={itemVariants}>
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  {item.label}
                </span>
                <span className="font-mono text-sm font-medium tabular-nums text-white">
                  {item.value}
                </span>
              </motion.div>
              {index < statusItems.length - 1 && (
                <div className="w-px h-6 bg-zinc-800 mx-2 hidden sm:block" />
              )}
            </motion.div>
          ))}

          {!isAuthenticated && (
            <motion.div
              className="flex items-center gap-2 ml-auto text-xs text-zinc-500"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="hidden sm:inline">
                Sign in to view live data
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
