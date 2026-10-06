"use client";

import { useReveal } from "@/hooks";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  const { ref, isVisible } = useReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={{ transitionDelay: "100ms" }}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-smart-teal mb-3",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-0.5 w-12 bg-smart-teal/30" />
        {eyebrow}
        <span className="h-0.5 w-12 bg-smart-teal/30" />
      </div>
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3",
          align === "center" && "text-center",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed",
            align === "center" && "mx-auto text-center",
          )}
        >
          {description}
        </p>
      )}
    </section>
  );
}
