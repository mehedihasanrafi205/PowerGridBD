"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

/**
 * SectionHeading — the single standard landing section header.
 *
 * Eyebrow rule + headline + lede, left or centered. Renders
 * statically and fully visible on first paint — entrance
 * animation belongs to the section content below it, never
 * to the heading itself.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 max-w-2xl lg:mb-14",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-smart-teal",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-0.5 w-12 bg-smart-teal/30" aria-hidden="true" />
        {eyebrow}
        <span className="h-0.5 w-12 bg-smart-teal/30" aria-hidden="true" />
      </div>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-lg leading-relaxed text-zinc-400">{description}</p>
      )}
    </div>
  );
}
