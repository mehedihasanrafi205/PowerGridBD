"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { DEMO_TOPOLOGY } from "./demo-topology";

const PowerGridMap = dynamic(
  () => import("./PowerGridMap").then((m) => m.PowerGridMap),
  {
    ssr: false,
    loading: () => <HeroMapSkeleton />,
  },
);

function HeroMapSkeleton() {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-deep-charcoal p-5">
      <span className="sr-only">Loading grid map…</span>
      <div className="flex items-center justify-between">
        <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-24 animate-pulse rounded bg-white/10" />
      </div>
      <div className="relative flex-1 overflow-hidden rounded-lg border border-white/10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-electric-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-electric-blue) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-electric-blue/60" />
      </div>
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 w-20 animate-pulse rounded bg-white/10" />
        ))}
      </div>
    </div>
  );
}

interface HeroGridMapProps {
  className?: string;
}

/**
 * HeroGridMap — the hero's interactive operations map.
 *
 * Client-only Leaflet (never server-rendered) inside the
 * hero's right-column panel chrome. Same data interface as
 * every future map surface; today it renders the labeled
 * demonstration topology.
 *
 * Map height scales from 320px on mobile to 500px on desktop.
 *
 * The map is fully contained within its card — no overlays
 * escape, no z-index conflicts with navbar or hero content.
 */
export function HeroGridMap({ className }: HeroGridMapProps) {
  return (
    <div
      className={cn(
        "relative isolate z-0 w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-deep-charcoal shadow-2xl",
        className,
      )}
      style={{
        height: "clamp(320px, calc(25vw + 200px), 500px)",
        position: "relative",
        zIndex: 0,
      }}
      data-testid="hero-map-card"
    >
      <div
        className="h-full w-full min-h-0 min-w-0"
        data-testid="hero-map-container"
      >
        <PowerGridMap data={DEMO_TOPOLOGY} />
      </div>
    </div>
  );
}
