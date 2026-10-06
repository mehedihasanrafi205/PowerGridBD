"use client";

import {
  Activity,
  ArrowRight,
  ChevronRight,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth, useOperationalAnalytics, useReveal } from "@/hooks";
import { cn } from "@/lib/utils";

const outageStages = [
  {
    status: "PENDING",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  {
    status: "ASSIGNED",
    color: "text-electric-blue",
    bg: "bg-electric-blue/10",
    border: "border-electric-blue/30",
  },
  {
    status: "IN_PROGRESS",
    color: "text-electric-blue",
    bg: "bg-electric-blue/10",
    border: "border-electric-blue/30",
  },
  {
    status: "RESOLVED",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  {
    status: "RESTORED",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
];

export function HeroCockpit() {
  const { ref, isVisible } = useReveal({ threshold: 0.1 });
  const { isAuthenticated } = useAuth();
  const { data: analytics } = useOperationalAnalytics();
  const mttr = analytics?.data?.mttr;

  return (
    <section className="relative bg-deep-charcoal overflow-hidden">
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />
      {/* Glow accents */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-smart-teal/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="relative container mx-auto px-4 pt-32 pb-20 lg:pt-40 lg:pb-28"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-2xl">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-xs font-medium mb-6 transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <Activity className="h-3.5 w-3.5" />
              Bangladesh&apos;s Grid Operations Platform
            </div>

            <h1
              className={cn(
                "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6 transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: "100ms" }}
            >
              Enterprise-grade{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-smart-teal to-emerald-400">
                power grid
              </span>{" "}
              operations.
            </h1>

            <p
              className={cn(
                "text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: "200ms" }}
            >
              PowerGridBD unifies outage reporting, load-shedding schedules,
              technician dispatch, and SLA-backed priority restoration across
              Zone → Substation → Feeder → Area hierarchies — built for
              operators, technicians, and customers who keep the grid running.
            </p>

            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4 mb-10 transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: "300ms" }}
            >
              <Link href="/auth/login">
                <Button className="h-12 px-8 bg-electric-blue hover:bg-electric-blue/90 text-white text-base font-medium gap-2">
                  Access Platform
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#platform">
                <Button
                  variant="outline"
                  className="h-12 px-8 bg-zinc-900/50 border-zinc-700 text-zinc-200 hover:bg-zinc-800/50 hover:text-white text-base font-medium"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className={cn(
                "flex flex-wrap items-center gap-6 text-sm text-zinc-500 transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-smart-teal" />
                <span>SSLCommerz Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Priority Restoration</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-electric-blue" />
                <span>Real-time Schedules</span>
              </div>
            </div>
          </div>

          {/* Right: HUD Cockpit */}
          <div
            className={cn(
              "relative transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
              {/* HUD Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-xs text-zinc-500 tracking-wider">
                  GRID-OPS / LIVE
                </span>
              </div>

              <div className="p-6">
                {/* Grid hierarchy visualization */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Grid Hierarchy
                    </span>
                    <span className="font-mono text-[10px] text-smart-teal">
                      4 LEVELS
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    {[
                      "ZONE → DHAKA-NORTH",
                      "SUBSTATION → MIRPUR-02",
                      "FEEDER → F-114 / 33KV",
                      "AREA → SECTOR-11 / 4200",
                    ].map((row, i) => (
                      <div key={row} className="flex items-center gap-3">
                        <span className="text-zinc-600 w-16">L{i + 1}</span>
                        <span className="text-zinc-300">
                          {row.split("→")[1]?.trim() ?? row}
                        </span>
                        <span
                          className={cn(
                            "ml-auto",
                            i === 0
                              ? "text-electric-blue"
                              : i === 1
                                ? "text-smart-teal"
                                : i === 2
                                  ? "text-amber-400"
                                  : "text-emerald-400",
                          )}
                        >
                          ●
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outage lifecycle stepper */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Outage Lifecycle
                    </span>
                    <span className="font-mono text-[10px] text-electric-blue">
                      5 STAGES
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {outageStages.map((stage, i) => (
                      <div
                        key={stage.status}
                        className="flex items-center gap-1.5"
                      >
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-mono border",
                            stage.bg,
                            stage.border,
                            stage.color,
                          )}
                        >
                          {stage.status}
                        </span>
                        {i < outageStages.length - 1 && (
                          <ChevronRight className="h-3 w-3 text-zinc-700" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat card — real MTTR from operational analytics */}
            <div className="absolute -bottom-6 -left-6 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm px-5 py-4 shadow-xl shadow-black/40 hidden sm:block">
              <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                MTTR
              </div>
              <div className="font-mono text-2xl font-bold text-white tabular-nums">
                {isAuthenticated && typeof mttr === "number" ? (
                  <>
                    {mttr.toFixed(1)}
                    <span className="text-sm text-zinc-500">h</span>
                  </>
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
