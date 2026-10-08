/**
 * Pure interval-overlap helpers for the schedule conflict engine.
 *
 * Kept free of React so the logic is unit-testable (`bun test`).
 * `ScheduleTimeline` renders from these results.
 */

export interface ConflictInterval {
  id: string;
  groupKey: string;
  startMs: number;
  endMs: number;
  active: boolean;
}

export interface ConflictPair {
  aId: string;
  bId: string;
  groupKey: string;
}

export interface ConflictResult {
  /** IDs of every interval involved in at least one collision. */
  conflictIds: Set<string>;
  /** The colliding pairs (for banner text). */
  pairs: ConflictPair[];
}

/**
 * Half-open interval overlap: [aStart, aEnd) ∩ [bStart, bEnd) ≠ ∅.
 * Touching endpoints ([10,12) vs [12,14)) do NOT overlap.
 */
export function intervalsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Detect collisions between active intervals sharing a group.
 * Inactive intervals never collide. Pairwise within groups.
 */
export function detectIntervalConflicts(
  intervals: ConflictInterval[],
): ConflictResult {
  const conflictIds = new Set<string>();
  const pairs: ConflictPair[] = [];

  const byGroup = new Map<string, ConflictInterval[]>();
  for (const interval of intervals) {
    if (!interval.active) continue;
    const list = byGroup.get(interval.groupKey);
    if (list) list.push(interval);
    else byGroup.set(interval.groupKey, [interval]);
  }

  for (const [groupKey, list] of byGroup) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (intervalsOverlap(a.startMs, a.endMs, b.startMs, b.endMs)) {
          conflictIds.add(a.id);
          conflictIds.add(b.id);
          pairs.push({ aId: a.id, bId: b.id, groupKey });
        }
      }
    }
  }

  return { conflictIds, pairs };
}
