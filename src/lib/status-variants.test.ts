import { describe, expect, it } from "bun:test";
import {
  applicationBadgeVariant,
  auditActionBadgeVariant,
  outageBadgeVariant,
  paymentBadgeVariant,
  paymentTypeLabel,
  roleBadgeVariant,
  scheduleBadgeVariant,
} from "./status-variants";

describe("outageBadgeVariant", () => {
  it.each([
    ["PENDING", "warning"],
    ["ASSIGNED", "info"],
    ["IN_PROGRESS", "default"],
    ["RESOLVED", "success"],
    ["RESTORED", "success"],
    ["FAILED", "destructive"],
  ] as const)("maps %s to %s", (status, expected) => {
    expect(outageBadgeVariant(status)).toBe(expected);
  });

  it("falls back to secondary for unknown statuses", () => {
    expect(outageBadgeVariant("CANCELLED")).toBe("secondary");
    expect(outageBadgeVariant("WHATEVER")).toBe("secondary");
    expect(outageBadgeVariant("")).toBe("secondary");
  });
});

describe("scheduleBadgeVariant", () => {
  it.each([
    ["SCHEDULED", "info"],
    ["ONGOING", "warning"],
    ["COMPLETED", "success"],
  ] as const)("maps %s to %s", (status, expected) => {
    expect(scheduleBadgeVariant(status)).toBe(expected);
  });

  it("falls back to secondary for unknown statuses", () => {
    expect(scheduleBadgeVariant("CANCELLED")).toBe("secondary");
    expect(scheduleBadgeVariant("ACTIVE")).toBe("secondary");
  });
});

describe("applicationBadgeVariant", () => {
  it.each([
    ["PENDING", "warning"],
    ["UNDER_REVIEW", "info"],
    ["APPROVED", "success"],
    ["REJECTED", "destructive"],
  ] as const)("maps %s to %s", (status, expected) => {
    expect(applicationBadgeVariant(status)).toBe(expected);
  });

  it("falls back to secondary for unknown statuses", () => {
    expect(applicationBadgeVariant("DRAFT")).toBe("secondary");
  });
});

describe("paymentBadgeVariant", () => {
  it.each([
    ["SUCCESS", "success"],
    ["FAILED", "destructive"],
    ["PENDING", "warning"],
  ] as const)("maps %s to %s", (status, expected) => {
    expect(paymentBadgeVariant(status)).toBe(expected);
  });

  it("falls back to secondary for unknown statuses", () => {
    expect(paymentBadgeVariant("CANCELLED")).toBe("secondary");
    expect(paymentBadgeVariant("REFUNDED")).toBe("secondary");
  });
});

describe("paymentTypeLabel", () => {
  it("labels known product types", () => {
    expect(paymentTypeLabel("PRIORITY_RESTORATION")).toBe(
      "Priority Restoration",
    );
    expect(paymentTypeLabel("SLA_SUBSCRIPTION")).toBe("SLA Subscription");
  });

  it("passes unknown types through unchanged", () => {
    expect(paymentTypeLabel("CUSTOM_X")).toBe("CUSTOM_X");
  });
});

describe("auditActionBadgeVariant", () => {
  it.each([
    ["CREATE", "success"],
    ["APPROVE", "success"],
    ["UPDATE", "info"],
    ["DELETE", "destructive"],
    ["REJECT", "destructive"],
    ["ASSIGN", "warning"],
    ["STATUS_CHANGE", "default"],
  ] as const)("maps %s to %s", (action, expected) => {
    expect(auditActionBadgeVariant(action)).toBe(expected);
  });

  it("falls back to secondary for unknown actions", () => {
    expect(auditActionBadgeVariant("LOGIN")).toBe("secondary");
    expect(auditActionBadgeVariant("")).toBe("secondary");
  });
});

describe("roleBadgeVariant", () => {
  it.each([
    ["ADMIN", "destructive"],
    ["POWER_OPERATOR", "warning"],
    ["TECHNICIAN", "success"],
    ["CUSTOMER", "info"],
  ] as const)("maps %s to %s", (role, expected) => {
    expect(roleBadgeVariant(role)).toBe(expected);
  });

  it("falls back to secondary for unknown roles", () => {
    expect(roleBadgeVariant("GUEST")).toBe("secondary");
  });
});
