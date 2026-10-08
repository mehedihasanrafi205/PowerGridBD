"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, ShieldCheck, Zap } from "lucide-react";

/**
 * HeroContent — left column of the hero.
 *
 * Visibility-first: this content renders statically at full opacity on the
 * very first paint. Framer Motion is used only for CTA micro-interactions
 * (whileHover / whileTap) — never to hide the content on mount.
 */

const capabilities = [
  { icon: Activity, label: "Real-time grid visibility" },
  { icon: Zap, label: "SLA-backed restoration" },
  { icon: ShieldCheck, label: "Dispatch automation" },
] as const;

export function HeroContent() {
  return (
    <div className="flex flex-col items-start gap-7">
      {/* Operational eyebrow */}
      <div className="inline-flex items-center gap-2.5 rounded-full border border-electric-blue/30 bg-electric-blue/10 px-3.5 py-1.5">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-smart-teal opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-smart-teal" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-smart-teal">
          National Grid Operations Platform
        </span>
      </div>

      {/* Headline */}
      <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
        National grid visibility &amp; outage orchestration for Bangladesh
      </h1>

      {/* Description */}
      <p className="max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
        PowerGridBD gives utilities and distribution authorities a single
        operational plane to monitor the grid, orchestrate outage lifecycles,
        dispatch field crews, and meet SLA commitments across every feeder and
        substation.
      </p>

      {/* CTAs — motion adds hover/tap feedback only, content is always visible */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.a
          href="/auth/login"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-electric-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-electric-blue/90"
        >
          Access Operator Console
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </motion.a>
        <motion.a
          href="/customer/outage/report"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Report an Outage
        </motion.a>
      </div>

      {/* Capability indicators */}
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {capabilities.map((capability) => {
          const Icon = capability.icon;
          return (
            <li
              key={capability.label}
              className="flex items-center gap-2 text-xs text-zinc-400"
            >
              <Icon
                className="h-3.5 w-3.5 text-smart-teal"
                aria-hidden="true"
              />
              {capability.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
