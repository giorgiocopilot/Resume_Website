/**
 * contact-links.ts
 * -----------------------------------------------------------------------------
 * PURE, side-effect-free helpers for building contact URLs and validating the
 * reveal-persistence mode. Kept free of DOM/browser APIs so they can be:
 *   • imported by Astro components at build time, and
 *   • unit-tested directly with Vitest.
 * -----------------------------------------------------------------------------
 */
import type { RevealPersistence } from "../schemas/resume.schema";

/**
 * Build a `mailto:` URL with subject + body encoded via encodeURIComponent.
 *
 * @example
 *   buildMailtoUrl("a@b.com", "Hi", "Line 1\nLine 2")
 *   // => "mailto:a@b.com?subject=Hi&body=Line%201%0ALine%202"
 */
export function buildMailtoUrl(
  email: string,
  subject: string,
  body: string,
): string {
  // NOTE: URLSearchParams encodes spaces as "+". mailto clients expect "%20",
  // so we build the query manually with encodeURIComponent for correctness.
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body,
  )}`;
  return `mailto:${email}?${query}`;
}

/**
 * Build a WhatsApp `https://wa.me/<digits>?text=...` URL.
 * The number MUST be international digits only (no "+", spaces or dashes);
 * any stray formatting is stripped defensively here.
 *
 * @example
 *   buildWhatsAppUrl("48577654530", "Hello")
 *   // => "https://wa.me/48577654530?text=Hello"
 */
export function buildWhatsAppUrl(digitsOnlyNumber: string, message: string): string {
  const digits = digitsOnlyNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** The set of valid persistence modes (mirrors the Zod enum). */
export const REVEAL_PERSISTENCE_MODES = ["none", "session", "local"] as const;

/** Type guard: is `value` a valid RevealPersistence mode? */
export function isRevealPersistence(value: unknown): value is RevealPersistence {
  return (
    typeof value === "string" &&
    (REVEAL_PERSISTENCE_MODES as readonly string[]).includes(value)
  );
}

/**
 * Map a persistence mode to the matching Web Storage object (or null).
 * A `getStorage` indirection lets tests inject mock storages.
 *
 *  • "none"    → null  (nothing persisted; reveal is per page-load only)
 *  • "session" → sessionStorage (per browser tab)
 *  • "local"   → localStorage   (across tabs, until cleared)
 */
export function storageForMode(
  mode: RevealPersistence,
  getStorage: (kind: "session" | "local") => Storage | null,
): Storage | null {
  switch (mode) {
    case "none":
      return null;
    case "session":
      return getStorage("session");
    case "local":
      return getStorage("local");
    default: {
      // Exhaustiveness guard — a new mode would fail typechecking here.
      const _never: never = mode;
      return _never;
    }
  }
}

/** The single storage key used to remember the anonymous "revealed" flag. */
export const REVEAL_STORAGE_KEY = "resume:revealed";
