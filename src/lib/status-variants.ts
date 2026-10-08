/**
 * Shared status → Badge variant mappings (Design.md §6).
 *
 * One canonical mapping per domain. Every page and primitive
 * imports from here instead of defining a local copy, so a
 * status looks identical everywhere in the product. Unknown
 * values fall back to `secondary` — never throw, never blank.
 */

export type StatusBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info";

/** Outage lifecycle → badge. */
export function outageBadgeVariant(status: string): StatusBadgeVariant {
  if (status === "PENDING") return "warning";
  if (status === "ASSIGNED") return "info";
  if (status === "IN_PROGRESS") return "default";
  if (status === "RESOLVED" || status === "RESTORED") return "success";
  if (status === "FAILED") return "destructive";
  return "secondary";
}

/** Load-shedding schedule lifecycle → badge. */
export function scheduleBadgeVariant(status: string): StatusBadgeVariant {
  if (status === "SCHEDULED") return "info";
  if (status === "ONGOING") return "warning";
  if (status === "COMPLETED") return "success";
  return "secondary";
}

/** Technician application lifecycle → badge. */
export function applicationBadgeVariant(status: string): StatusBadgeVariant {
  if (status === "PENDING") return "warning";
  if (status === "UNDER_REVIEW") return "info";
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "destructive";
  return "secondary";
}

/** Payment lifecycle → badge. */
export function paymentBadgeVariant(status: string): StatusBadgeVariant {
  if (status === "SUCCESS") return "success";
  if (status === "FAILED") return "destructive";
  if (status === "PENDING") return "warning";
  return "secondary";
}

/** Payment product type → human label. */
export function paymentTypeLabel(type: string): string {
  if (type === "PRIORITY_RESTORATION") return "Priority Restoration";
  if (type === "SLA_SUBSCRIPTION") return "SLA Subscription";
  return type;
}

/** Audit action → badge. */
export function auditActionBadgeVariant(action: string): StatusBadgeVariant {
  if (action === "CREATE" || action === "APPROVE") return "success";
  if (action === "UPDATE") return "info";
  if (action === "DELETE" || action === "REJECT") return "destructive";
  if (action === "ASSIGN") return "warning";
  if (action === "STATUS_CHANGE") return "default";
  return "secondary";
}

/** User role → badge. */
export function roleBadgeVariant(role: string): StatusBadgeVariant {
  if (role === "ADMIN") return "destructive";
  if (role === "POWER_OPERATOR") return "warning";
  if (role === "TECHNICIAN") return "success";
  if (role === "CUSTOMER") return "info";
  return "secondary";
}
