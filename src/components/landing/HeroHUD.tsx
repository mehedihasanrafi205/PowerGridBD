"use client";

import { motion, stagger, type Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGSAP, useReducedMotion } from "@/components/animation";
import { useOperationalAnalytics } from "@/hooks";
import { easing } from "@/lib/animation";
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

interface HeroHUDProps {
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
  stagger: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.easeOut },
  },
};

export function HeroHUD({ className = "" }: HeroHUDProps) {
  const { gsap } = useGSAP();
  const { prefersReducedMotion } = useReducedMotion();
  const { data: analytics } = useOperationalAnalytics();
  const [mttr, setMttr] = useState<number | null>(null);
  const mttrRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (analytics?.data?.mttr) {
      setMttr(analytics.data.mttr);
    }
  }, [analytics]);

  useEffect(() => {
    if (prefersReducedMotion || !mttrRef.current || mttr === null) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mttrRef.current!,
        { innerText: 0 },
        {
          innerText: mttr.toFixed(1),
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 0.1 },
          onUpdate: function () {
            if (mttrRef.current) {
              mttrRef.current.innerText =
                this.targets()[0].innerText.toFixed(1);
            }
          },
        },
      );
    }, mttrRef);

    return () => ctx.revert();
  }, [gsap, mttr, prefersReducedMotion]);

  return (
    <div className={cn("relative", className)}>
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
        {/* HUD Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <motion.span
              initial={false}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
              }}
              className="w-2 h-2 rounded-full bg-red-500/80"
            />
            <motion.span
              initial={false}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
                delay: 0.2,
              }}
              className="w-2 h-2 rounded-full bg-amber-500/80"
            />
            <motion.span
              initial={false}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
                delay: 0.4,
              }}
              className="w-2 h-2 rounded-full bg-emerald-500/80"
            />
          </div>
          <span className="font-mono text-xs text-zinc-500 tracking-wider">
            GRID-OPS / LIVE
          </span>
        </div>

        <motion.div
          className="p-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Grid Hierarchy */}
          <motion.div className="mb-6" variants={itemVariants}>
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
                <motion.div
                  key={row}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Outage Lifecycle Stepper */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Outage Lifecycle
              </span>
              <span className="font-mono text-[10px] text-electric-blue">
                5 STAGES
              </span>
            </div>
            <motion.div
              className="flex flex-wrap items-center gap-1.5"
              initial="hidden"
              animate="stagger"
              variants={containerVariants}
            >
              {outageStages.map((stage, i) => (
                <motion.div
                  key={stage.status}
                  variants={itemVariants}
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
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Stat Card — Real MTTR */}
      <motion.div
        ref={mttrRef}
        className={cn(
          "absolute -bottom-6 -left-6 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm px-5 py-4 shadow-xl shadow-black/40 hidden sm:block",
          className,
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
          MTTR
        </div>
        <div className="font-mono text-2xl font-bold text-white tabular-nums">
          {mttr !== null ? (
            <>
              {mttr.toFixed(1)}
              <span className="text-sm text-zinc-500">h</span>
            </>
          ) : (
            <span className="text-zinc-600">—</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
