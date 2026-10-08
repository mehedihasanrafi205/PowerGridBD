"use client";

import { cn } from "@/lib/utils";

interface FilterTabsProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * FilterTabs — segmented status filter tabs.
 *
 * Single-select filter rendered as a bordered segmented
 * control (same language as the kanban view toggle).
 * Horizontally scrollable on small screens; the active tab
 * uses `aria-pressed` plus surface treatment (never color
 * alone).
 */
export function FilterTabs({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: FilterTabsProps) {
  return (
    <fieldset
      className={cn(
        "m-0 flex items-center gap-0.5 overflow-x-auto rounded-lg border border-input bg-muted/50 p-0.5",
        className,
      )}
    >
      <legend className="sr-only">{ariaLabel}</legend>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={
              active
                ? "whitespace-nowrap rounded-md bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
                : "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}
