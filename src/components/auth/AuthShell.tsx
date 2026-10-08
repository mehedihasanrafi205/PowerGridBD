"use client";

import { Activity, CalendarClock, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme";

const capabilities = [
  {
    icon: Activity,
    title: "Outage lifecycle tracking",
    description: "Report to restoration, fully audited",
  },
  {
    icon: CalendarClock,
    title: "Load-shedding scheduler",
    description: "Feeder plans with conflict control",
  },
  {
    icon: ShieldCheck,
    title: "SLA-backed restoration",
    description: "Priority tiers that hold to account",
  },
  {
    icon: Users,
    title: "Role-based consoles",
    description: "Customer, technician, operator, admin",
  },
];

/**
 * AuthShell — the shared split-screen authentication frame.
 *
 * LEFT (lg+ only, always dark): the PowerGridBD brand canvas —
 * deep-charcoal ops surface with grid texture, brand mark,
 * mission statement, and real product capabilities. Never
 * carries live grid metrics or institutional claims.
 *
 * RIGHT (all screens): the theme-aware form area with the
 * theme control and the page's own form content.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Brand canvas */}
      <section
        aria-label="About PowerGridBD"
        className="relative hidden overflow-hidden bg-deep-charcoal lg:flex lg:w-5/12 lg:flex-col lg:justify-between lg:p-10 xl:w-1/2"
      >
        {/* Grid texture + brand glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-electric-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-electric-blue) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-electric-blue/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-smart-teal/10 blur-2xl"
          aria-hidden="true"
        />

        {/* Brand row */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue font-mono text-lg font-bold text-white">
              P
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-white">
                PowerGridBD
              </span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                Grid Operations Platform
              </span>
            </span>
          </Link>
        </div>

        {/* Mission statement */}
        <div className="relative z-10 my-auto max-w-xl py-10">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-smart-teal">
            Operations Console
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-5xl">
            National grid visibility &amp; outage orchestration for Bangladesh
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
            One operational plane to monitor the grid, dispatch field crews, and
            meet restoration commitments — across every feeder and substation.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <li
                  key={capability.title}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3.5"
                >
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      {capability.title}
                    </span>
                    <span className="block text-xs text-zinc-400">
                      {capability.description}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Platform strip — honest product facts, never grid metrics */}
        <div className="relative z-10 border-t border-white/10 pt-5">
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            <span>
              <span className="text-white">4</span> role consoles
            </span>
            <span>
              <span className="text-white">5</span>-stage outage lifecycle
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Platform operational
            </span>
          </div>
        </div>
      </section>

      {/* Form area */}
      <section className="relative flex flex-1 flex-col px-5 py-10 sm:px-8 lg:justify-center lg:py-12">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="mx-auto w-full max-w-md flex-1 lg:flex-none">
          {children}
        </div>
      </section>
    </div>
  );
}
