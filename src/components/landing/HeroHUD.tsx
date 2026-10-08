"use client";

import { motion } from "framer-motion";
import { ChevronRight, Radio } from "lucide-react";

/**
 * HeroHUD — integrated status strip anchored to the hero's bottom edge.
 *
 * Contains the platform status indicator, the outage-monitoring indicator,
 * and the Report Outage call to action. It is part of the hero section,
 * not a floating element detached from it.
 *
 * All indicators render statically; the pulse is a CSS-only ambient effect
 * that is disabled under prefers-reduced-motion.
 */
export function HeroHUD() {
  return (
    <div className="relative border-t border-white/10 bg-black/25 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:px-8">
        {/* Platform status */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
            Platform Operational
          </span>
        </div>

        <span
          className="hidden h-4 w-px bg-white/15 sm:block"
          aria-hidden="true"
        />

        {/* Outage monitoring indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric-blue" />
          </span>
          <Radio
            className="h-3.5 w-3.5 text-electric-blue"
            aria-hidden="true"
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
            Outage Monitoring Live
          </span>
        </div>

        {/* Spacer pushes the CTA to the trailing edge */}
        <div className="flex-1" aria-hidden="true" />

        {/* Report Outage CTA */}
        <motion.a
          href="/customer/outage/report"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-electric-blue transition-colors hover:text-white"
        >
          Report Outage
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.a>
      </div>
    </div>
  );
}
