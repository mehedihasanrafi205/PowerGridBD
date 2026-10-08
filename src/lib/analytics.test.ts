import { describe, expect, it } from "bun:test";
import { asCount } from "./analytics";

describe("asCount (backend number-or-envelope fields)", () => {
  it("passes bare numbers through", () => {
    expect(asCount(3)).toBe(3);
    expect(asCount(0)).toBe(0);
  });

  it("extracts count from envelope objects", () => {
    expect(asCount({ count: 2 })).toBe(2);
  });

  it("falls back to 0 for missing values", () => {
    expect(asCount(undefined)).toBe(0);
    expect(asCount(null)).toBe(0);
  });
});
