# Accessibility checklist (WCAG 2.2 AA — static résumé)

This page is designed to meet WCAG 2.2 AA as far as feasible for a static résumé.
Re-verify these after any content or style change. Automated tools (axe,
Lighthouse, WAVE) cover part of this; the rest is manual.

## Structure & semantics
- [x] Single, correct document outline: one `<h1>` (name), `<h2>` section titles.
- [x] Landmarks: `<header>`, `<main id="main">`, `<footer>`; `<address>` for contact links.
- [x] Lists (`<ul>`/`<dl>`) used for responsibilities, achievements, skills, credentials, languages.
- [x] `<time datetime="YYYY-MM">` on all experience dates.
- [x] `<article>` per role and per project/skill card.

## Keyboard & focus
- [x] All interactive elements are real links/buttons and keyboard reachable.
- [x] Visible focus ring (`:focus-visible`, 3px accent outline, 3px offset).
- [x] Skip link ("Skip to content") is the first focusable element.
- [x] On reveal, focus moves to the full-résumé heading (`tabindex="-1"`).
- [ ] Manual: tab through the whole page; confirm logical order, no traps.

## Screen readers
- [x] `role="status"` `aria-live="polite"` region announces the reveal.
- [x] Full résumé present in DOM even before reveal; `aria-hidden` mirrors the visual collapsed state only while JS hides it.
- [x] Decorative SVG icons marked `aria-hidden="true"`; buttons have text labels.
- [x] Portrait `alt` is descriptive (no "image of").
- [ ] Manual: test with VoiceOver / NVDA — verify reveal announcement + focus.

## Contrast & color (target AA: 4.5:1 text, 3:1 large/UI)
- [x] Body text `#eef2fb` on `#0a0e1a` ≈ 15:1.
- [x] Muted text `#b6c0d6` on `#0a0e1a` ≈ 8:1.
- [x] Accent `#35d6ff` used for large text / borders / focus (not small body text).
- [x] Primary button uses dark ink `#04222c` on cyan for AA.
- [ ] Manual: re-check any new color pairings.

## Motion & preferences
- [x] `prefers-reduced-motion: reduce` disables transitions/animations/smooth scroll.
- [x] No autoplay, no parallax, no scroll hijacking, no custom cursor, no loading screen.

## Zoom & reflow (WCAG 2.2: 1.4.10 Reflow, 1.4.4 Resize text)
- [x] Fluid `clamp()` type; layout reflows to one column on small screens.
- [ ] Manual: 400% zoom at 1280px width — no horizontal scroll, no clipping.
- [x] Tap targets ≥ 44px (buttons `min-height: 3rem`).

## Robustness / progressive enhancement
- [x] Fully usable with JavaScript disabled (full résumé visible; contact links work).
- [x] Print stylesheet expands all content and removes chrome.
- [x] No essential info conveyed by color alone (labels + text accompany all states).

## New in WCAG 2.2 (spot-checks)
- [x] 2.4.11 Focus Not Obscured: sticky mobile bar does not cover focused content (body has bottom padding).
- [x] 2.5.8 Target Size (Minimum): interactive targets ≥ 24×24 CSS px (buttons far exceed).
- [x] 3.2.6 Consistent Help: contact actions appear consistently (hero + sticky bar).
