"use client";

import { cn } from "@/lib/utils";
import { GridVisualization } from "./GridVisualization";
import { HeroContent } from "./HeroContent";
import { HeroHUD } from "./HeroHUD";

interface HeroProps {
  className?: string;
}

/**
 * Hero — the cinematic, visibility-first centerpiece of the landing page.
 *
 * Two-column desktop composition: LEFT (eyebrow, headline, description, CTAs,
 * status indicators), RIGHT/CENTER (large Bangladesh grid visualization).
 * An integrated HUD strip is anchored to the bottom edge of the hero.
 *
 * Visibility-first contract:
 * - Every element renders at full opacity on the first paint.
 * - No `opacity: 0`, no IntersectionObserver dependency, no transform that
 *   moves the map out of the viewport.
 * - GSAP/Framer Motion only *enhance* an already-complete static state.
 */
export function Hero({ className = "" }: HeroProps) {
  return (
    <section
      className={cn("relative overflow-hidden bg-deep-charcoal", className)}
      aria-label="PowerGridBD platform overview"
    >
      {/* Ambient brand glow — static, subtle */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 55% at 50% -10%, var(--color-electric-blue) / 0.12, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, var(--color-smart-teal) / 0.08, transparent 50%)",
        }}
      />
      {/* Fine grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-electric-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-electric-blue) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Two-column composition */}
      <div className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:py-10">
        {/* LEFT: content — fully visible on first render */}
        <div className="w-full lg:w-[46%] lg:flex-shrink-0">
          <HeroContent />
        </div>

        {/* RIGHT/CENTER: grid visualization — fully visible on first render */}
        <div className="w-full lg:min-w-0 lg:flex-1">
          <GridVisualization />
        </div>
      </div>

      {/* Integrated HUD — anchored to the hero's bottom edge, not floating */}
      <HeroHUD />
    </section>
  );
}
