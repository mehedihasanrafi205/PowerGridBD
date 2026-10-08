"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { detectIntervalConflicts } from "@/lib/schedule-conflicts";
import { cn } from "@/lib/utils";
import type { Schedule, ScheduleStatus } from "@/types";

/** Schedules that occupy capacity and can therefore collide. */
const ACTIVE_STATUSES: ScheduleStatus[] = ["SCHEDULED", "ONGOING"];

interface PlacedBlock {
  schedule: Schedule;
  leftPct: number;
  widthPct: number;
  conflicts: boolean;
}

interface TimelineGroup {
  key: string;
  label: string;
  sublabel?: string;
  blocks: PlacedBlock[];
}

interface ConflictDisplay {
  a: Schedule;
  b: Schedule;
  groupLabel: string;
}

interface ScheduleTimelineProps {
  schedules: Schedule[];
  className?: string;
}

function toMs(iso: string): number | null {
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/** Grouping key: feeder first, falling back to area. */
function groupKeyOf(schedule: Schedule): string {
  return schedule.feeder?.id ?? `area-${schedule.area?.id ?? "general"}`;
}

function statusBlockStyle(status: string): string {
  if (status === "SCHEDULED") return "bg-electric-blue";
  if (status === "ONGOING") return "bg-amber";
  if (status === "COMPLETED") return "bg-emerald";
  return "bg-muted-foreground";
}

/**
 * ScheduleTimeline — Gantt visualization with automated
 * overlap detection (Design.md §7).
 *
 * Groups schedules by feeder (falling back to area), lays
 * blocks on a shared time axis, and flags half-open interval
 * collisions between active (SCHEDULED/ONGOING) schedules on
 * the same feeder. All conflicts derive from the real rows
 * passed in — nothing is simulated.
 *
 * Static by design (no animation); the data table below it
 * remains the screen-reader accessible alternative.
 */
export function ScheduleTimeline({
  schedules,
  className,
}: ScheduleTimelineProps) {
  // Parse + filter out rows with unusable timestamps.
  const parsed = schedules.flatMap((schedule) => {
    const start = toMs(schedule.startTime);
    const end = toMs(schedule.endTime);
    if (start === null || end === null || end <= start) return [];
    return [{ schedule, start, end }];
  });

  if (parsed.length === 0) return null;

  const min = Math.min(...parsed.map((p) => p.start));
  const max = Math.max(...parsed.map((p) => p.end));
  const span = Math.max(max - min, 60 * 60 * 1000);

  // Group by feeder, falling back to area.
  const groups = new Map<string, TimelineGroup>();
  for (const p of parsed) {
    const key = groupKeyOf(p.schedule);
    const label = p.schedule.feeder?.name ?? p.schedule.area?.name ?? "General";
    const sublabel =
      p.schedule.feeder?.substation?.name ?? p.schedule.area?.feeder?.name;
    let group = groups.get(key);
    if (!group) {
      group = { key, label, sublabel, blocks: [] };
      groups.set(key, group);
    }
    group.blocks.push({
      schedule: p.schedule,
      leftPct: ((p.start - min) / span) * 100,
      widthPct: Math.max(((p.end - p.start) / span) * 100, 1.5),
      conflicts: false,
    });
  }

  // Detect collisions via the shared pure engine, then mark
  // blocks and resolve banner display rows.
  const byId = new Map(parsed.map((p) => [p.schedule.id, p.schedule]));
  const detection = detectIntervalConflicts(
    parsed.map((p) => ({
      id: p.schedule.id,
      groupKey: groupKeyOf(p.schedule),
      startMs: p.start,
      endMs: p.end,
      active: ACTIVE_STATUSES.includes(p.schedule.status),
    })),
  );
  for (const block of [...groups.values()].flatMap((g) => g.blocks)) {
    if (detection.conflictIds.has(block.schedule.id)) {
      block.conflicts = true;
    }
  }
  const conflicts: ConflictDisplay[] = detection.pairs.flatMap((pair) => {
    const a = byId.get(pair.aId);
    const b = byId.get(pair.bId);
    if (!a || !b) return [];
    return [
      {
        a,
        b,
        groupLabel: groups.get(pair.groupKey)?.label ?? "Grid",
      },
    ];
  });

  const orderedGroups = [...groups.values()].sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  // Hour ticks across the window.
  const tickCount = 6;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const ms = min + (span * i) / tickCount;
    const date = new Date(ms);
    const label = date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return { leftPct: (i / tickCount) * 100, label };
  });

  const shownConflicts = conflicts.slice(0, 5);
  const hiddenCount = conflicts.length - shownConflicts.length;

  return (
    <div className={className}>
      {/* Conflict banner */}
      {conflicts.length > 0 ? (
        <div
          className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
          role="alert"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {conflicts.length} overlap
            {conflicts.length === 1 ? "" : "s"} detected on the same feeder
          </p>
          <ul className="mt-2 space-y-1 text-sm text-destructive/90">
            {shownConflicts.map((c) => (
              <li key={`${c.a.id}-${c.b.id}`} className="font-mono text-xs">
                {c.groupLabel}: “{c.a.title}” ↔ “{c.b.title}”
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="text-xs">+{hiddenCount} more</li>
            )}
          </ul>
        </div>
      ) : (
        <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-emerald" aria-hidden="true" />
          No overlaps detected between active schedules on the same feeder.
        </p>
      )}

      {/* Gantt canvas */}
      <div
        className="overflow-x-auto"
        role="img"
        aria-label={`Schedule timeline with ${parsed.length} intervals across ${orderedGroups.length} feeders and ${conflicts.length} detected overlaps.`}
      >
        <div className="min-w-[720px]">
          {/* Time axis */}
          <div className="relative mb-1 ml-40 h-5 sm:ml-48">
            {ticks.map((tick) => (
              <span
                key={tick.label}
                className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tabular-nums text-muted-foreground"
                style={{ left: `${tick.leftPct}%` }}
              >
                {tick.label}
              </span>
            ))}
          </div>

          {/* Feeder rows */}
          <div className="space-y-2">
            {orderedGroups.map((group) => (
              <div key={group.key} className="flex items-stretch gap-3">
                <div className="w-36 shrink-0 truncate pt-1 text-xs sm:w-48">
                  <p className="truncate font-medium text-foreground">
                    {group.label}
                  </p>
                  {group.sublabel && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {group.sublabel}
                    </p>
                  )}
                </div>
                <div className="relative h-9 flex-1 rounded bg-muted/50">
                  {group.blocks.map((block) => (
                    <div
                      key={block.schedule.id}
                      title={`${block.schedule.title} — ${block.schedule.status} (${new Date(block.schedule.startTime).toLocaleString()} → ${new Date(block.schedule.endTime).toLocaleString()})`}
                      className={cn(
                        "absolute top-1.5 bottom-1.5 rounded",
                        statusBlockStyle(block.schedule.status),
                        block.conflicts && "conflict-stripes",
                      )}
                      style={{
                        left: `${block.leftPct}%`,
                        width: `${block.widthPct}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-electric-blue" />
              Scheduled
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber" />
              Ongoing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald" />
              Completed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="conflict-stripes h-2.5 w-2.5 rounded-sm" />
              Overlap conflict
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
