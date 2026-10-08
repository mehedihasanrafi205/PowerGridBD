"use client";

import { cn } from "@/lib/utils";

export type LogoVariant = "full" | "icon" | "compact";
export type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  href?: string;
  "aria-label"?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * PowerGridBD Logo — a pure React SVG component.
 *
 * Design rationale:
 * - The mark combines a power-grid node (central hub) with
 *   radiating connections, forming an abstract "PG" monogram.
 * - Colors use the design system tokens: electric-blue primary,
 *   deep-charcoal on dark backgrounds, white on light.
 * - No external image files; scales perfectly at any size.
 * - Variants: "full" (icon + wordmark), "icon" (mark only),
 *   "compact" (icon + abbreviated "PG" text).
 */
export function Logo({
  variant = "full",
  size = "md",
  className,
  href,
  "aria-label": ariaLabel = "PowerGridBD",
  onClick,
}: LogoProps) {
  const sizeClasses: Record<LogoSize, string> = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9",
    xl: "h-11 w-11",
  };

  const textSizeClasses: Record<LogoSize, string> = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const iconSizeClasses: Record<LogoSize, string> = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  };

  const logoMark = (
    <svg
      className={cn("text-electric-blue", iconSizeClasses[size])}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer ring — grid boundary */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="none"
      />

      {/* Connection lines — grid topology */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {/* Vertical main line */}
        <line x1="16" y1="4" x2="16" y2="11" strokeOpacity="0.6" />
        <line x1="16" y1="21" x2="16" y2="28" strokeOpacity="0.6" />

        {/* Horizontal main line */}
        <line x1="4" y1="16" x2="11" y2="16" strokeOpacity="0.6" />
        <line x1="21" y1="16" x2="28" y2="16" strokeOpacity="0.6" />

        {/* Diagonal connections — substation/feeder links */}
        <line x1="7" y1="7" x2="11" y2="11" strokeOpacity="0.4" />
        <line x1="25" y1="7" x2="21" y2="11" strokeOpacity="0.4" />
        <line x1="7" y1="25" x2="11" y2="21" strokeOpacity="0.4" />
        <line x1="25" y1="25" x2="21" y2="21" strokeOpacity="0.4" />
      </g>

      {/* Central hub node — dispatch center */}
      <circle
        cx="16"
        cy="16"
        r="5"
        fill="currentColor"
        filter="url(#hubGlow)"
      />

      {/* Inner pulse ring — live status indicator */}
      <circle
        cx="16"
        cy="16"
        r="7.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="none"
        className="logo-pulse-ring"
      />

      {/* Glow filter for hub */}
      <defs>
        <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );

  const wordmark = (
    <span
      className={cn(
        "font-bold tracking-tight text-white",
        textSizeClasses[size],
      )}
    >
      PowerGrid<span className="text-electric-blue">BD</span>
    </span>
  );

  const compactText = (
    <span
      className={cn(
        "font-bold tracking-tight text-white",
        textSizeClasses[size],
      )}
    >
      PG
    </span>
  );

  const content = (
    <span className={cn("flex items-center gap-2", className)}>
      {logoMark}
      {variant === "full" && wordmark}
      {variant === "compact" && compactText}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-charcoal rounded-sm transition-opacity hover:opacity-80"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <span className="flex items-center gap-2" role="img" aria-label={ariaLabel}>
      {content}
    </span>
  );
}

/**
 * Logo mark only — for favicon, app icon, or tight spaces.
 */
export function LogoMark({ size = "md", className }: { size?: LogoSize; className?: string }) {
  const iconSizeClasses: Record<LogoSize, string> = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  };

  return (
    <svg
      className={cn("text-electric-blue", iconSizeClasses[size], className)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="none"
      />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="16" y1="4" x2="16" y2="11" strokeOpacity="0.6" />
        <line x1="16" y1="21" x2="16" y2="28" strokeOpacity="0.6" />
        <line x1="4" y1="16" x2="11" y2="16" strokeOpacity="0.6" />
        <line x1="21" y1="16" x2="28" y2="16" strokeOpacity="0.6" />
        <line x1="7" y1="7" x2="11" y2="11" strokeOpacity="0.4" />
        <line x1="25" y1="7" x2="21" y2="11" strokeOpacity="0.4" />
        <line x1="7" y1="25" x2="11" y2="21" strokeOpacity="0.4" />
        <line x1="25" y1="25" x2="21" y2="21" strokeOpacity="0.4" />
      </g>
      <circle cx="16" cy="16" r="5" fill="currentColor" filter="url(#hubGlow)" />
      <circle
        cx="16"
        cy="16"
        r="7.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="none"
        className="logo-pulse-ring"
      />
      <defs>
        <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}