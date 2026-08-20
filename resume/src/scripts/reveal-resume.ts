/**
 * reveal-resume.ts
 * -----------------------------------------------------------------------------
 * The ONLY client-side JavaScript on the page. It progressively ENHANCES an
 * already-complete, already-accessible document. Loaded as a module <script>
 * (no inline JS) so a strict CSP without 'unsafe-inline' / 'unsafe-eval' works.
 *
 * ⚠️ SECURITY NOTE — READ THIS:
 *   Hiding the résumé with a CSS class is NOT access control. The full résumé
 *   HTML is ALWAYS present in the page source and is trivially retrievable
 *   (View Source, DevTools, disabling JS, crawlers). This "reveal on contact"
 *   is a UX gesture only — never put anything you must protect behind it.
 *
 * Progressive enhancement contract:
 *   • With JS OFF  → the <html> element never gets `.js`, CSS keeps everything
 *                    visible, and the page is fully usable (see global.css).
 *   • With JS ON   → we add `.js`, which lets CSS collapse the "full résumé"
 *                    until a contact button is clicked (or a stored flag says
 *                    it was already revealed this session/tab).
 *
 * What we DO on click:
 *   1. Record only an anonymous first-party UI flag (per persistence mode).
 *   2. Reveal the full résumé immediately.
 *   3. Open the chosen contact destination (mailto / wa.me) — we do NOT claim
 *      the message was sent; the browser cannot verify that.
 *   4. Move keyboard focus to the full-résumé heading.
 *   5. Announce the reveal via an aria-live region.
 *   6. Respect prefers-reduced-motion (transitions are gated in CSS).
 * -----------------------------------------------------------------------------
 */
import {
  REVEAL_STORAGE_KEY,
  isRevealPersistence,
  storageForMode,
} from "./contact-links";
import type { RevealPersistence } from "../schemas/resume.schema";

function safeGetStorage(kind: "session" | "local"): Storage | null {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    // Storage can throw in private modes / when blocked. Degrade gracefully.
    return null;
  }
}

function readPersistenceMode(root: HTMLElement): RevealPersistence {
  const raw = root.dataset.revealPersistence;
  return isRevealPersistence(raw) ? raw : "session";
}

function markRevealed(root: HTMLElement, announce = true): void {
  if (root.classList.contains("is-revealed")) return;
  root.classList.add("is-revealed");

  const full = document.getElementById("full-resume");
  if (full) {
    full.removeAttribute("hidden");
    full.setAttribute("aria-hidden", "false");
  }

  if (announce) {
    const live = document.getElementById("reveal-announcer");
    if (live) {
      live.textContent =
        "The full résumé is now shown below. Your contact app is opening in a separate window or tab.";
    }
    // Move focus to the full-résumé heading for keyboard/screen-reader users.
    const heading = document.getElementById("full-resume-heading");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: false });
    }
  }
}

function persistRevealed(mode: RevealPersistence): void {
  const storage = storageForMode(mode, safeGetStorage);
  try {
    storage?.setItem(REVEAL_STORAGE_KEY, "1");
  } catch {
    // Ignore storage write failures — reveal still works for this page load.
  }
}

function wasRevealed(mode: RevealPersistence): boolean {
  const storage = storageForMode(mode, safeGetStorage);
  try {
    return storage?.getItem(REVEAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function init(): void {
  const root = document.documentElement;
  // Signal to CSS that JS is active (this is what enables hiding at all).
  root.classList.add("js");

  const revealRoot = document.getElementById("resume-root");
  if (!(revealRoot instanceof HTMLElement)) return;

  const mode = readPersistenceMode(revealRoot);

  const full = document.getElementById("full-resume");

  // If this tab/browser already revealed the résumé, show it straight away
  // (no announcement, no focus jump — the user didn't just click).
  if (mode !== "none" && wasRevealed(mode)) {
    markRevealed(revealRoot, false);
  } else if (full) {
    // JS is hiding the section via CSS (`html.js ... #full-resume`), so mirror
    // that in the accessibility tree until the user reveals it.
    full.setAttribute("aria-hidden", "true");
  }

  // Wire up every element that should trigger a reveal + open a destination.
  const triggers =
    document.querySelectorAll<HTMLAnchorElement>("[data-reveal-trigger]");

  triggers.forEach((el) => {
    el.addEventListener("click", () => {
      // The anchor's real href (mailto:/wa.me) still opens the app natively;
      // we only add the reveal side-effects. No preventDefault → no hijacking.
      persistRevealed(mode);
      markRevealed(revealRoot, true);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
