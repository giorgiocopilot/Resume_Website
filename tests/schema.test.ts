/**
 * Unit tests: schema validation (dates, quantified achievements, live data).
 */
import { describe, it, expect } from "vitest";
import {
  yearMonthSchema,
  isoDateSchema,
  achievementSchema,
  resumeSchema,
} from "../src/schemas/resume.schema";
import { resume } from "../src/data/resume.data";

describe("date validation", () => {
  it("accepts valid YYYY-MM", () => {
    expect(yearMonthSchema.safeParse("2025-09").success).toBe(true);
    expect(yearMonthSchema.safeParse("1999-12").success).toBe(true);
  });

  it("rejects invalid months and formats", () => {
    expect(yearMonthSchema.safeParse("2025-13").success).toBe(false);
    expect(yearMonthSchema.safeParse("2025-00").success).toBe(false);
    expect(yearMonthSchema.safeParse("2025-9").success).toBe(false);
    expect(yearMonthSchema.safeParse("25-09").success).toBe(false);
    expect(yearMonthSchema.safeParse("2025/09").success).toBe(false);
  });

  it("validates full ISO dates", () => {
    expect(isoDateSchema.safeParse("2024-02-29").success).toBe(true);
    expect(isoDateSchema.safeParse("2024-13-01").success).toBe(false);
    expect(isoDateSchema.safeParse("2024-01-32").success).toBe(false);
  });
});

describe("quantified achievement validation (discriminated union)", () => {
  it("requires an impact object when quantified is true", () => {
    const bad = achievementSchema.safeParse({
      quantified: true,
      result: "Did a thing",
      // impact missing
    });
    expect(bad.success).toBe(false);
  });

  it("accepts a valid quantified achievement", () => {
    const ok = achievementSchema.safeParse({
      quantified: true,
      result: "Scaled adoption",
      impact: { value: 98, unit: "%", basis: "active users" },
    });
    expect(ok.success).toBe(true);
  });

  it("forbids an impact object when quantified is false", () => {
    const bad = achievementSchema.safeParse({
      quantified: false,
      result: "Improved morale",
      impact: { value: 1, unit: "x" },
    });
    // .strict() means the extra `impact` key is rejected.
    expect(bad.success).toBe(false);
  });

  it("accepts an unquantified achievement without a number", () => {
    const ok = achievementSchema.safeParse({
      quantified: false,
      result: "Improved cross-team collaboration",
    });
    expect(ok.success).toBe(true);
  });

  it("rejects an unknown value for the number's unit type", () => {
    const bad = achievementSchema.safeParse({
      quantified: true,
      result: "x",
      impact: { value: "not-a-number", unit: "%" },
    });
    expect(bad.success).toBe(false);
  });
});

describe("live résumé data", () => {
  it("passes the full resumeSchema", () => {
    // `resume` is already parsed at import time, but we re-validate explicitly.
    expect(() => resumeSchema.parse(resume)).not.toThrow();
  });

  it("has a WhatsApp number of digits only", () => {
    expect(resume.contact.whatsappNumber).toMatch(/^\d+$/);
  });

  it("uses a valid email", () => {
    expect(resume.contact.email).toContain("@");
  });
});
