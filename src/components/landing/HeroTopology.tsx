"use client";

import { useEffect, useRef } from "react";
import { useGSAP, useReducedMotion } from "@/components/animation";

interface HeroTopologyProps {
  className?: string;
}

export function HeroTopology({ className = "" }: HeroTopologyProps) {
  const { gsap, ScrollTrigger } = useGSAP();
  const { prefersReducedMotion } = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const radarRef = useRef<SVGRectElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion || !svgRef.current) return;

    const ctx = gsap.context(() => {
      const radar = radarRef.current;
      const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];
      const nodes = nodeRefs.current.filter(Boolean) as SVGCircleElement[];

      if (radar) {
        gsap.fromTo(
          radar,
          { y: -200, opacity: 0 },
          {
            y: 600,
            opacity: 0.4,
            ease: "none",
            duration: 6.5,
            repeat: -1,
            repeatDelay: 0.5,
          },
        );
      }

      lines.forEach((line, i) => {
        const length = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDashoffset: length, opacity: 0.4 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            ease: "none",
            duration: 3,
            repeat: -1,
            delay: i * 0.5,
          },
        );
      });

      nodes.forEach((node, i) => {
        if (i === 0 || i === 5 || i === 6) return;
        gsap.fromTo(
          node,
          { scale: 0.8, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.inOut",
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
          },
        );
      });
    }, svgRef);

    return () => ctx.revert();
  }, [gsap, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <svg
        ref={svgRef}
        className={`w-full max-w-5xl h-[560px] text-electric-blue ${className}`}
        fill="none"
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 380,60 L 420,80 L 470,120 L 530,130 L 560,190 L 520,230 L 500,280 L 550,370 L 580,480 L 540,510 L 490,460 L 440,430 L 410,490 L 370,520 L 310,490 L 280,410 L 250,330 L 280,260 L 310,190 L 340,110 Z"
          fill="rgba(0, 97, 148, 0.04)"
          stroke="#007bb9"
          strokeDasharray="6 6"
          strokeWidth="2"
        />
        <line
          stroke="#00D2FF"
          strokeWidth="2.5"
          x1="380"
          x2="430"
          y1="120"
          y2="290"
          strokeDasharray="8 6"
        />
        <line
          stroke="#00D2FF"
          strokeWidth="2.5"
          x1="520"
          x2="430"
          y1="160"
          y2="290"
          strokeDasharray="8 6"
        />
        <line
          stroke="#00D2FF"
          strokeWidth="2.5"
          x1="280"
          x2="430"
          y1="260"
          y2="290"
          strokeDasharray="8 6"
        />
        <line
          stroke="#00D2FF"
          strokeWidth="3"
          x1="430"
          x2="540"
          y1="290"
          y2="450"
          strokeDasharray="8 6"
        />
        <line
          stroke="#00D2FF"
          strokeWidth="2"
          x1="430"
          x2="330"
          y1="290"
          y2="470"
          strokeDasharray="8 6"
        />
        <line
          opacity="0.6"
          stroke="#13C8A3"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          x1="520"
          x2="540"
          y1="160"
          y2="450"
        />
        <circle cx="430" cy="290" fill="#00D2FF" fillOpacity="0.3" r="14" />
        <circle cx="430" cy="290" fill="#FFFFFF" r="7" />
        <circle cx="380" cy="120" fill="#13C8A3" r="5" />
        <circle cx="520" cy="160" fill="#00D2FF" r="6" />
        <circle cx="280" cy="260" fill="#00D2FF" r="5" />
        <circle cx="540" cy="450" fill="#00D2FF" r="7" />
        <circle cx="330" cy="470" fill="#13C8A3" r="5" />
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      className={`w-full max-w-5xl h-[560px] text-electric-blue ${className}`}
      fill="none"
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stylized Geo Contour */}
      <path
        d="M 380,60 L 420,80 L 470,120 L 530,130 L 560,190 L 520,230 L 500,280 L 550,370 L 580,480 L 540,510 L 490,460 L 440,430 L 410,490 L 370,520 L 310,490 L 280,410 L 250,330 L 280,260 L 310,190 L 340,110 Z"
        fill="rgba(0, 97, 148, 0.04)"
        stroke="#007bb9"
        strokeDasharray="6 6"
        strokeWidth="2"
      />

      {/* Radar Scan Beam */}
      <rect
        ref={radarRef}
        className="grid-scan-beam"
        x="0"
        y="-100"
        width="800"
        height="120"
        fill="url(#radarGradient)"
        opacity="0"
      />

      {/* Transmission Lines with Animated Electrical Currents */}
      <line
        ref={(el) => {
          lineRefs.current[0] = el;
        }}
        className="transmission-line-flow"
        stroke="#00D2FF"
        strokeWidth="2.5"
        x1="380"
        x2="430"
        y1="120"
        y2="290"
        strokeDasharray="8 6"
      />
      <line
        ref={(el) => {
          lineRefs.current[1] = el;
        }}
        className="transmission-line-flow"
        stroke="#00D2FF"
        strokeWidth="2.5"
        x1="520"
        x2="430"
        y1="160"
        y2="290"
        strokeDasharray="8 6"
      />
      <line
        ref={(el) => {
          lineRefs.current[2] = el;
        }}
        className="transmission-line-flow"
        stroke="#00D2FF"
        strokeWidth="2.5"
        x1="280"
        x2="430"
        y1="260"
        y2="290"
        strokeDasharray="8 6"
      />
      <line
        ref={(el) => {
          lineRefs.current[3] = el;
        }}
        className="transmission-line-flow"
        stroke="#00D2FF"
        strokeWidth="3"
        x1="430"
        x2="540"
        y1="290"
        y2="450"
        strokeDasharray="8 6"
      />
      <line
        ref={(el) => {
          lineRefs.current[4] = el;
        }}
        className="transmission-line-flow"
        stroke="#00D2FF"
        strokeWidth="2"
        x1="430"
        x2="330"
        y1="290"
        y2="470"
        strokeDasharray="8 6"
      />
      <line
        opacity="0.6"
        stroke="#13C8A3"
        strokeDasharray="4 4"
        strokeWidth="1.5"
        x1="520"
        x2="540"
        y1="160"
        y2="450"
      />

      {/* Pulsing SCADA Synchrophasor Nodes */}
      <circle
        ref={(el) => {
          nodeRefs.current[0] = el;
        }}
        className="status-dot-pulse"
        cx="430"
        cy="290"
        fill="#00D2FF"
        fillOpacity="0.3"
        r="14"
      />
      <circle cx="430" cy="290" fill="#FFFFFF" r="7" />
      <circle
        ref={(el) => {
          nodeRefs.current[1] = el;
        }}
        cx="380"
        cy="120"
        fill="#13C8A3"
        r="5"
      />
      <circle
        ref={(el) => {
          nodeRefs.current[2] = el;
        }}
        className="status-dot-pulse"
        cx="520"
        cy="160"
        fill="#00D2FF"
        r="6"
      />
      <circle
        ref={(el) => {
          nodeRefs.current[3] = el;
        }}
        cx="280"
        cy="260"
        fill="#00D2FF"
        r="5"
      />
      <circle
        ref={(el) => {
          nodeRefs.current[4] = el;
        }}
        className="status-dot-pulse"
        cx="540"
        cy="450"
        fill="#00D2FF"
        r="7"
      />
      <circle
        ref={(el) => {
          nodeRefs.current[5] = el;
        }}
        cx="330"
        cy="470"
        fill="#13C8A3"
        r="5"
      />

      <defs>
        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#007bb9" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}
