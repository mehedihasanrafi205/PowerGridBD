/**
 * Numeric extraction for analytics fields the backend may return
 * either as a bare number or as a `{ count, ... }` envelope
 * (observed: `availableTechnicians`, `criticalFeedersDown`).
 * Unknown shapes fall back to 0 — never render the raw value,
 * which would crash React when it is an object.
 */
export function asCount(
  value: number | { count: number } | undefined | null,
): number {
  if (typeof value === "number") return value;
  if (value && typeof value.count === "number") return value.count;
  return 0;
}
