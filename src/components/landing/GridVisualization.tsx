"use client";

import { useEffect, useRef } from "react";
import { useGSAP, useReducedMotion } from "@/components/animation";
import { cn } from "@/lib/utils";

interface GridVisualizationProps {
  className?: string;
}

type NodeStatus = "ACTIVE" | "STANDBY" | "MAINT";

interface GridNode {
  id: string;
  x: number;
  y: number;
  status: NodeStatus;
}

interface ConnectionPath {
  id: string;
  d: string;
}

/**
 * Stylized Bangladesh national grid — 18 distributed grid nodes joined
 * by 9 transmission paths. Coordinates are in a 400×460 viewBox so the
 * visualization scales cleanly from 375px phones to 1440px+ desktops.
 */
const nodeData: GridNode[] = [
  { id: "dhaka", x: 205, y: 225, status: "ACTIVE" },
  { id: "chittagong", x: 330, y: 320, status: "ACTIVE" },
  { id: "rajshahi", x: 130, y: 190, status: "ACTIVE" },
  { id: "khulna", x: 150, y: 330, status: "ACTIVE" },
  { id: "sylhet", x: 275, y: 120, status: "ACTIVE" },
  { id: "barisal", x: 210, y: 355, status: "ACTIVE" },
  { id: "rangpur", x: 128, y: 95, status: "ACTIVE" },
  { id: "cumilla", x: 285, y: 235, status: "ACTIVE" },
  { id: "mymensingh", x: 205, y: 120, status: "ACTIVE" },
  { id: "noakhali", x: 310, y: 275, status: "ACTIVE" },
  { id: "tangail", x: 185, y: 170, status: "ACTIVE" },
  { id: "jessore", x: 175, y: 310, status: "ACTIVE" },
  { id: "netrokona", x: 230, y: 140, status: "STANDBY" },
  { id: "patuakhali", x: 245, y: 375, status: "MAINT" },
  { id: "coxs_bazar", x: 348, y: 295, status: "ACTIVE" },
  { id: "faridpur", x: 195, y: 265, status: "ACTIVE" },
  { id: "meherpur", x: 118, y: 265, status: "STANDBY" },
  { id: "barguna", x: 265, y: 365, status: "MAINT" },
];

const connectionPaths: ConnectionPath[] = [
  { id: "c1", d: "M205,225 L185,170 L205,120" },
  { id: "c2", d: "M205,225 L285,235 L330,320" },
  { id: "c3", d: "M205,225 L275,120" },
  { id: "c4", d: "M205,225 L130,190 L128,95" },
  { id: "c5", d: "M205,225 L195,265 L175,310 L150,330" },
  { id: "c6", d: "M205,225 L210,355 L245,375" },
  { id: "c7", d: "M285,235 L310,275" },
  { id: "c8", d: "M310,275 L348,295" },
  { id: "c9", d: "M175,310 L118,265" },
];

/** Stylized Bangladesh landmass silhouette (not a precise geodetic outline). */
const bangladeshOutline =
  "M118,78 L158,52 L210,48 L268,62 L296,96 L306,140 L292,178 L316,224 L344,268 L356,318 L330,352 L286,380 L236,398 L186,392 L142,356 L112,300 L104,240 L96,180 L100,124 Z";

/** Node fill by operational status — semantic colors per Design.md. */
function statusFill(status: NodeStatus): string {
  if (status === "ACTIVE") return "var(--color-electric-blue)";
  if (status === "STANDBY") return "var(--color-smart-teal)";
  return "var(--color-amber)";
}

/**
 * GridVisualization — the signature Bangladesh grid centerpiece.
 *
 * Visibility-first contract:
 * - The landmass outline, all 9 transmission paths, radar rings and all
 *   18 nodes render statically and completely on the first paint.
 * - GSAP (owned via useGSAP) only *enhances* that static state: it adds
 *   traveling energy pulses, node breathing, active-node glow and the
 *   rotating radar beam.
 * - When `prefers-reduced-motion` is set, the effect returns early and
 *   the complete static visualization remains fully visible.
 */
export function GridVisualization({ className = "" }: GridVisualizationProps) {
  const { gsap } = useGSAP();
  const { prefersReducedMotion } = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const svg = ref.current;
    const ctx = gsap.context(() => {
      // 1. Energy pulses — a bright segment travels each transmission path.
      //    The base path stays visible underneath at all times.
      const pulses = svg.querySelectorAll<SVGPathElement>(".energy-pulse");
      pulses.forEach((path, index) => {
        gsap.fromTo(
          path,
          { "stroke-dashoffset": 50 },
          {
            "stroke-dashoffset": 0,
            duration: 2.4,
            delay: index * 0.25,
            ease: "none",
            repeat: -1,
          },
        );
      });

      // 2. Node breathing — subtle radius pulse on every node.
      const nodes = svg.querySelectorAll<SVGCircleElement>(".grid-node");
      nodes.forEach((node) => {
        gsap.fromTo(
          node,
          { attr: { r: 3 } },
          {
            attr: { r: 4.3 },
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "slow",
          },
        );
      });

      // 3. Active-node glow — soft halo behind ACTIVE nodes.
      const glows = svg.querySelectorAll<SVGCircleElement>(".node-glow");
      glows.forEach((glow) => {
        gsap.fromTo(
          glow,
          { opacity: 0.12 },
          {
            opacity: 0.34,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "slow",
          },
        );
      });

      // 4. Radar sweep — rotating beam around the Dhaka hub.
      const radar = svg.querySelector<SVGGElement>("#radar-sweep");
      if (radar) {
        gsap.fromTo(
          radar,
          { rotation: 0 },
          {
            rotation: 360,
            svgOrigin: "205 225",
            duration: 7,
            ease: "none",
            repeat: -1,
          },
        );
      }
    });

    return () => ctx.revert();
  }, [gsap, prefersReducedMotion]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 460"
      width="400"
      height="460"
      className={cn("h-auto w-full max-w-lg", className)}
      role="img"
      aria-label="Stylized Bangladesh power grid network visualization"
    >
      <title>Bangladesh power grid network</title>
      <desc>
        A stylized map of Bangladesh with 18 grid nodes and 9 transmission
        paths. Active nodes are electric blue, standby nodes are teal and
        maintenance nodes are amber.
      </desc>

      {/* Bangladesh landmass silhouette */}
      <path
        d={bangladeshOutline}
        fill="var(--color-electric-blue)"
        fillOpacity="0.05"
        stroke="var(--color-electric-blue)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Radar range rings (static) */}
      <circle
        cx="205"
        cy="225"
        r="118"
        fill="none"
        stroke="var(--color-electric-blue)"
        strokeOpacity="0.12"
        strokeDasharray="3 6"
      />
      <circle
        cx="205"
        cy="225"
        r="66"
        fill="none"
        stroke="var(--color-electric-blue)"
        strokeOpacity="0.1"
        strokeDasharray="2 5"
      />

      {/* Rotating radar beam (GSAP-enhanced) */}
      <g id="radar-sweep">
        <line
          x1="205"
          y1="225"
          x2="205"
          y2="107"
          stroke="var(--color-electric-blue)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>

      {/* Transmission paths — base layer, always visible */}
      {connectionPaths.map((path) => (
        <path
          key={`base-${path.id}`}
          d={path.d}
          fill="none"
          stroke="var(--color-electric-blue)"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 7"
        />
      ))}

      {/* Energy pulse overlays — bright traveling segment per path */}
      {connectionPaths.map((path) => (
        <path
          key={`pulse-${path.id}`}
          className="energy-pulse"
          d={path.d}
          fill="none"
          stroke="var(--color-electric-blue)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 44"
        />
      ))}

      {/* Active-node glow halos (GSAP-enhanced) */}
      {nodeData
        .filter((node) => node.status === "ACTIVE")
        .map((node) => (
          <circle
            key={`glow-${node.id}`}
            className="node-glow"
            cx={node.x}
            cy={node.y}
            r="7"
            fill="var(--color-electric-blue)"
            opacity="0.16"
          />
        ))}

      {/* Grid nodes */}
      {nodeData.map((node) => (
        <circle
          key={node.id}
          className="grid-node"
          cx={node.x}
          cy={node.y}
          r="3"
          fill={statusFill(node.status)}
          aria-label={`Grid node ${node.id} — ${node.status}`}
        />
      ))}
    </svg>
  );
}
