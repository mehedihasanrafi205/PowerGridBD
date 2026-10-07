"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, Clock, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth, useOperationalAnalytics, useReveal } from "@/hooks";
import { easing } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { HeroHUD } from "./HeroHUD";
import { HeroTopology } from "./HeroTopology";

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
            <motion.div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-xs font-medium mb-6",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              initial={false}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: 0.6, ease: easing.easeOut }}
            >
              <Activity className="h-3.5 w-3.5" />
              Bangladesh&apos;s Grid Operations Platform
            </motion.div>

            <motion.h1
              className={cn(
                "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              initial={false}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.1 }}
            >
              Enterprise-grade{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-smart-teal to-emerald-400">
                power grid
              </span>{" "}
              operations.
            </motion.h1>

            <motion.p
              className={cn(
                "text-lg md:text-xl text-zinc-400 leading-relaxed mb-8",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              initial={false}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.2 }}
            >
              PowerGridBD unifies outage reporting, load-shedding schedules,
              technician dispatch, and SLA-backed priority restoration across
              Zone → Substation → Feeder → Area hierarchies — built for
              operators, technicians, and customers who keep the grid running.
            </motion.p>

            <motion.div
              className={cn(
                "flex flex-col sm:flex-row gap-4 mb-10",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              initial={false}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.3 }}
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
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className={cn(
                "flex flex-wrap items-center gap-6 text-sm text-zinc-500",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              initial={false}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.4 }}
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
            </motion.div>
          </div>

          {/* Right: Topology + HUD */}
          <motion.div
            className="relative"
            initial={false}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.3 }}
          >
            <div className="relative flex flex-col items-center gap-8">
              {/* Topology SVG with GSAP animations */}
              <div className="w-full max-w-4xl">
                <HeroTopology />
              </div>

              {/* HUD Cockpit with Framer Motion + GSAP */}
              <HeroHUD />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
