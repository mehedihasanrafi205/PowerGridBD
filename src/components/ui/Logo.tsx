"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "icon" | "full" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
  /** Used when variant="full" to show wordmark alongside icon */
  showWordmark?: boolean;
  href?: string;
  "aria-label"?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

const variantClasses = {
  default: "",
  icon: "",
  full: "flex items-center gap-2",
  wordmark: "hidden lg:flex",
};

/**
 * PowerGridBD Logo Component
 *
 * Uses the logo.svg from public/ as an <img> for reliable rendering
 * of the complex embedded artwork. Provides size and variant options
 * for different contexts (nav, footer, favicon replacement, etc.).
 *
 * @example
 * ```tsx
 * // Default icon
 * <Logo size="md" />
 *
 * // Full logo with wordmark (for headers)
 * <Logo variant="full" size="md" />
 *
 * // As a link (for footer/nav)
 * <Logo variant="full" href="/" />
 *
 * // Icon only (for favicon, mobile)
 * <Logo variant="icon" size="sm" />
 * ```
 */
const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      variant = "default",
      size = "md",
      href,
      className,
      showWordmark = true,
      onClick,
      "aria-label": ariaLabel,
      children,
      ...props
    },
    ref,
  ) => {
    const logoContent = (
      <>
        <img
          src="/logo.svg"
          alt="PowerGridBD"
          className={cn("block", sizeClasses[size])}
          aria-hidden="true"
        />
        {variant === "full" && showWordmark && (
          <span className="font-semibold text-white text-lg tracking-tight">
            PowerGrid<span className="text-electric-blue">BD</span>
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(
            "flex items-center",
            variantClasses[variant],
            className,
          )}
          onClick={onClick}
          aria-label={ariaLabel}
          {...props}
        >
          {logoContent}
        </Link>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center", variantClasses[variant], className)}
        {...props}
      >
        {logoContent}
      </div>
    );
  },
);

Logo.displayName = "Logo";

/**
 * LogoIcon — minimal icon-only version for tight spaces
 * (favicon, mobile nav, loading states)
 */
export function LogoIcon({
  size = "md",
  className,
  ...props
}: Omit<LogoProps, "variant">) {
  return <Logo variant="icon" size={size} className={className} {...props} />;
}

/**
 * LogoWordmark — full logo with wordmark for desktop headers
 */
export function LogoWordmark({
  size = "lg",
  className,
  ...props
}: Omit<LogoProps, "variant">) {
  return <Logo variant="full" size={size} className={className} {...props} />;
}

/**
 * LogoMark — just the icon mark without wordmark
 */
export function LogoMark({
  size = "md",
  className,
  ...props
}: Omit<LogoProps, "variant">) {
  return (
    <Logo variant="default" size={size} className={className} {...props} />
  );
}

/**
 * LogoLink — logo wrapped in a link (for headers/footers) — alias for Logo with href
 */
interface LogoLinkProps extends Omit<LogoProps, "href"> {
  href: string;
  "aria-label"?: string;
}

export function LogoLink({
  href = "/",
  size = "md",
  variant = "full",
  className,
  "aria-label": ariaLabel = "PowerGridBD — Home",
  ...props
}: LogoLinkProps) {
  return (
    <Logo
      href={href}
      size={size}
      variant={variant}
      className={cn("flex items-center", className)}
      aria-label={ariaLabel}
      {...props}
    />
  );
}

export { Logo };
