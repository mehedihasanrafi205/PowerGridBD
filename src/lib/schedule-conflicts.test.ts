import { describe, expect, it } from "bun:test";
import {
  detectIntervalConflicts,
  intervalsOverlap,
  type ConflictInterval,
} from "./schedule-conflicts";

function interval(
  id: string,
  groupKey: string,
  startMs: number,
  endMs: number,
  active = true,
): ConflictInterval {
  return { id, groupKey, startMs, endMs, active };
}

describe("intervalsOverlap (half-open semantics)", () => {
  it("detects a plain overlap", () => {
    expect(intervalsOverlap(10, 20, 15, 25)).toBe(true);
  });

  it("treats touching endpoints as non-overlapping", () => {
    expect(intervalsOverlap(10, 20, 20, 30)).toBe(false);
    expect(intervalsOverlap(20, 30, 10, 20)).toBe(false);
  });

  it("detects containment in both directions", () => {
    expect(intervalsOverlap(10, 30, 15, 20)).toBe(true);
    expect(intervalsOverlap(15, 20, 10, 30)).toBe(true);
  });

  it("detects identical intervals", () => {
    expect(intervalsOverlap(10, 20, 10, 20)).toBe(true);
  });

  it("rejects disjoint intervals", () => {
    expect(intervalsOverlap(10, 20, 30, 40)).toBe(false);
    expect(intervalsOverlap(30, 40, 10, 20)).toBe(false);
  });
});

describe("detectIntervalConflicts", () => {
  it("returns empty results for no input", () => {
    const result = detectIntervalConflicts([]);
    expect(result.conflictIds.size).toBe(0);
    expect(result.pairs).toEqual([]);
  });

  it("flags overlapping active intervals in the same group", () => {
    const result = detectIntervalConflicts([
      interval("a", "f1", 10, 20),
      interval("b", "f1", 15, 25),
      interval("c", "f1", 30, 40),
    ]);
    expect(result.conflictIds).toEqual(new Set(["a", "b"]));
    expect(result.pairs).toEqual([
      { aId: "a", bId: "b", groupKey: "f1" },
    ]);
  });

  it("ignores overlaps across different groups", () => {
    const result = detectIntervalConflicts([
      interval("a", "f1", 10, 20),
      interval("b", "f2", 15, 25),
    ]);
    expect(result.conflictIds.size).toBe(0);
    expect(result.pairs).toEqual([]);
  });

  it("ignores inactive intervals entirely", () => {
    const result = detectIntervalConflicts([
      interval("a", "f1", 10, 20),
      interval("b", "f1", 15, 25, false),
    ]);
    expect(result.conflictIds.size).toBe(0);
    expect(result.pairs).toEqual([]);
  });

  it("collects every pair in a three-way collision", () => {
    const result = detectIntervalConflicts([
      interval("a", "f1", 10, 30),
      interval("b", "f1", 15, 35),
      interval("c", "f1", 20, 40),
    ]);
    expect(result.conflictIds).toEqual(new Set(["a", "b", "c"]));
    expect(result.pairs).toHaveLength(3);
  });
});
