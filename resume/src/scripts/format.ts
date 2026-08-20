/**
 * format.ts — pure formatting helpers for dates (used by components + tests).
 */
import type { DateRange } from "../schemas/resume.schema";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** "2025-09" → "Sep 2025". A full ISO date keeps just year-month. */
export function formatYearMonth(value: string): string {
  const [yearStr, monthStr] = value.split("-");
  const monthIdx = Number(monthStr) - 1;
  const month = MONTHS[monthIdx] ?? monthStr;
  return `${month} ${yearStr}`;
}

/** Human label for a date range, e.g. "Sep 2025 — Present". */
export function formatRange(range: DateRange): string {
  const start = formatYearMonth(range.start);
  const end =
    range.end === "present" || range.end === undefined
      ? "Present"
      : formatYearMonth(range.end);
  return `${start} \u2014 ${end}`;
}

/** ISO value for a <time datetime> attribute (year-month, or "present" → ""). */
export function datetimeAttr(value: string | undefined): string {
  return !value || value === "present" ? "" : value;
}
