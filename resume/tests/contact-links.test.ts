/**
 * Unit tests: contact URL construction + reveal persistence modes.
 */
import { describe, it, expect } from "vitest";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  isRevealPersistence,
  storageForMode,
  REVEAL_PERSISTENCE_MODES,
} from "../src/scripts/contact-links";

describe("buildMailtoUrl", () => {
  it("builds a mailto URL with encoded subject and body", () => {
    const url = buildMailtoUrl("a@b.com", "Hello there", "Line 1\nLine 2 & more");
    expect(url).toBe(
      "mailto:a@b.com?subject=Hello%20there&body=Line%201%0ALine%202%20%26%20more",
    );
  });

  it("encodes spaces as %20 (not +) for client compatibility", () => {
    const url = buildMailtoUrl("x@y.z", "a b", "c d");
    expect(url).not.toContain("+");
    expect(url).toContain("%20");
  });

  it("encodes reserved characters in the body", () => {
    const url = buildMailtoUrl("x@y.z", "s", "a=b?c#d");
    expect(url).toContain(encodeURIComponent("a=b?c#d"));
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with digits-only number and encoded text", () => {
    expect(buildWhatsAppUrl("48577654530", "Hello world")).toBe(
      "https://wa.me/48577654530?text=Hello%20world",
    );
  });

  it("strips non-digit characters defensively", () => {
    expect(buildWhatsAppUrl("+48 577-654-530", "Hi")).toBe(
      "https://wa.me/48577654530?text=Hi",
    );
  });

  it("encodes emoji and special characters in the message", () => {
    const url = buildWhatsAppUrl("12345678", "Hi & bye 👋");
    expect(url).toContain(encodeURIComponent("Hi & bye 👋"));
  });
});

describe("isRevealPersistence", () => {
  it("accepts the three valid modes", () => {
    for (const mode of REVEAL_PERSISTENCE_MODES) {
      expect(isRevealPersistence(mode)).toBe(true);
    }
  });

  it("rejects anything else", () => {
    expect(isRevealPersistence("forever")).toBe(false);
    expect(isRevealPersistence(undefined)).toBe(false);
    expect(isRevealPersistence(42)).toBe(false);
  });
});

describe("storageForMode", () => {
  const fakeSession = {} as Storage;
  const fakeLocal = {} as Storage;
  const getStorage = (kind: "session" | "local") =>
    kind === "session" ? fakeSession : fakeLocal;

  it("returns null for 'none'", () => {
    expect(storageForMode("none", getStorage)).toBeNull();
  });

  it("returns sessionStorage for 'session'", () => {
    expect(storageForMode("session", getStorage)).toBe(fakeSession);
  });

  it("returns localStorage for 'local'", () => {
    expect(storageForMode("local", getStorage)).toBe(fakeLocal);
  });
});
