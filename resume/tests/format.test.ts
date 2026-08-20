/**
 * Unit tests: date formatting helpers used by the visual components.
 */
import { describe, it, expect } from "vitest";
import {
  formatYearMonth,
  formatRange,
  datetimeAttr,
} from "../src/scripts/format";

describe("formatYearMonth", () => {
  it("formats a month to 'Mon YYYY'", () => {
    expect(formatYearMonth("2025-09")).toBe("Sep 2025");
    expect(formatYearMonth("2020-01")).toBe("Jan 2020");
    expect(formatYearMonth("1999-12")).toBe("Dec 1999");
  });
});

describe("formatRange", () => {
  it("renders 'present' as 'Present'", () => {
    expect(formatRange({ start: "2025-09", end: "present" })).toBe(
      "Sep 2025 \u2014 Present",
    );
  });

  it("renders a closed range", () => {
    expect(formatRange({ start: "2022-12", end: "2024-12" })).toBe(
      "Dec 2022 \u2014 Dec 2024",
    );
  });

  it("treats a missing end as Present", () => {
    expect(formatRange({ start: "2017-07" })).toBe("Jul 2017 \u2014 Present");
  });
});

describe("datetimeAttr", () => {
  it("returns the value for a real month", () => {
    expect(datetimeAttr("2025-09")).toBe("2025-09");
  });
  it("returns empty for 'present' or undefined", () => {
    expect(datetimeAttr("present")).toBe("");
    expect(datetimeAttr(undefined)).toBe("");
  });
});
