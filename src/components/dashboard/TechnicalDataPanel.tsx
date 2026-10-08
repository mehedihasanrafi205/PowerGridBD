import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TechnicalDataRow {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

interface TechnicalDataPanelProps {
  title?: string;
  rows: TechnicalDataRow[];
  className?: string;
}

/**
 * TechnicalDataPanel — grouped label/value specifications.
 *
 * The single standard spec layout: muted labels, foreground
 * values, optional mono tabular numerals. Replaces bespoke
 * `<dl>` blocks so detail surfaces read identically.
 */
export function TechnicalDataPanel({
  title,
  rows,
  className,
}: TechnicalDataPanelProps) {
  return (
    <div className={className}>
      {title && (
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd
              className={cn(
                "min-w-0 break-words text-foreground",
                row.mono && "font-mono tabular-nums",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
