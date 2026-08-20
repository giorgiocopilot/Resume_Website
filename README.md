# Giorgio Tsoupis — Web Résumé

A fast, accessible, privacy-preserving **one-page professional résumé**, built
static-first for **Cloudflare Pages** with automatic redeploys from GitHub.

- **Stack:** [Astro](https://astro.build) · TypeScript (strict) · [Zod](https://zod.dev) (runtime + inferred types) · native/scoped CSS · minimal client JS.
- **No** React, no UI framework, no external fonts, no animation library, no database, no trackers.
- **Reveal UX:** the résumé shows profile + contact actions first; clicking a
  contact button opens WhatsApp/email **and** reveals the rest of the page.
  It never claims a message was sent.
- **Live host:** `https://resume.copilotadoption.uk`

> ⚠️ **The click-to-reveal is NOT access control.** The full résumé HTML is
> always present in the page source and is trivially retrievable (View Source,
> DevTools, JS disabled, crawlers, print). It is a UX convenience only. Never
> place anything you must protect behind it. See `src/scripts/reveal-resume.ts`.

---

## 1. Required local software

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | ≥ 18.20 (LTS 20/22 recommended) | Astro 4 requirement |
| **npm** | ≥ 9 | ships with Node |
| Git | any recent | for deployment |

Check: `node -v && npm -v`.

## 2. Installation

```bash
git clone <your-repo-url>
cd <repo>
npm install
```

## 3. Local development

```bash
npm run dev       # start dev server (http://localhost:4321)
npm run build     # production build → dist/ (+ injects CSP script hashes)
npm run preview   # serve the built dist/ locally
npm run check     # astro check + tsc --noEmit (types + Zod schema)
npm test          # vitest unit tests
```

## 4. Where résumé content is edited

**Everything** lives in one typed file:

```
src/data/resume.data.ts
```

It is validated at build time against `src/schemas/resume.schema.ts` (Zod).
If a field is missing or the wrong type/shape, **`npm run check` and
`npm run build` fail with a precise error** — nothing renders from bad data.

- Optional sections (projects, publications, etc.) **disappear cleanly** when
  their array is empty.
- Achievements follow the **Minto Pyramid**: result → quantified impact →
  evidence → actions → context. Set `quantified: true` **only** when you have a
  real `impact: { value, unit, basis? }`. Otherwise set `quantified: false` and
  the item is transparently tagged “Unquantified result” — **never invent a
  number**.
- Dates are `"YYYY-MM"` (or `"present"` for an ongoing role).

## 5. How to replace the profile image

1. Drop your square-ish source photo at `design/profile-source.png`
   (this folder is **not** deployed).
2. Regenerate the responsive, optimized assets:
   ```bash
   npm run optimize:portrait                 # uses design/profile-source.png
   # or: node scripts/optimize-portrait.mjs path/to/photo.jpg
   ```
   This writes `public/images/profile-{480,960}.{avif,webp}` — the exact
   filenames the hero references.
3. Update the `alt` text in `resume.data.ts → profile.photo.alt`.

Image guidance: prefer **AVIF/WebP**, square crop, explicit width/height are
already set in markup to prevent layout shift. The hero image loads eagerly;
everything else is lazy by default.

## 6. How to configure email & WhatsApp links

All contact values live in `resume.data.ts → contact`:

```ts
contact: {
  email: "george@copilotadoption.uk",
  whatsappNumber: "48577654530",   // INTERNATIONAL DIGITS ONLY (no +, spaces)
  emailSubject: "…",
  emailBody: "…",                  // "\n" for line breaks
  whatsappMessage: "…",
  revealPersistence: "session",    // "none" | "session" | "local"
  links: [ … ],                    // LinkedIn, Website, GitHub, Portfolio…
}
```

- `mailto:` and `wa.me` URLs are built (and their text `encodeURIComponent`-ed)
  in `src/scripts/contact-links.ts` — unit-tested in `tests/contact-links.test.ts`.
- **Reveal persistence:**
  - `none` – re-hides on every page load.
  - `session` – remembered for the current browser **tab** (default).
  - `local` – remembered across tabs until the visitor clears storage.

## 7. How to validate the content

```bash
npm run check   # Zod schema + TypeScript types
npm test        # URL construction, persistence, dates, achievements
```

A malformed `resume.data.ts` (bad date, quantified achievement with no impact,
invalid URL/email, unknown key) will **fail the build** with a Zod message.

## 8. Connect the GitHub repo to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository and authorize.
4. **Build settings:**
   - Framework preset: **Astro** (or “None”).
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Production branch:** `main`
5. Deploy. No environment variables or secrets are required.

> The native Cloudflare Pages ↔ GitHub integration is sufficient — **no GitHub
> Actions workflow is needed.**

## 9. Automatic deployment after a push to `main`

Every push to `main` triggers a **production** build on Cloudflare Pages using
the settings above. When the build succeeds, the new version goes live at your
`*.pages.dev` URL and any attached custom domain.

## 10. Preview deployments for pull requests

Every branch/PR gets its own **preview deployment** at a unique
`<hash>.<project>.pages.dev` URL, built with the same command. Review there
before merging; merging to `main` promotes to production.

## 11. Connect the existing custom domain

The project is preconfigured for **`resume.copilotadoption.uk`**.

1. Cloudflare Pages project → **Custom domains → Set up a custom domain**.
2. Enter `resume.copilotadoption.uk`.
3. If the domain’s DNS is already on Cloudflare, the `CNAME` is added
   automatically; otherwise add the shown `CNAME` at your DNS provider.
4. If you ever change the host, update these to match:
   - `astro.config.mjs → SITE`
   - `src/data/resume.data.ts → seo.canonicalUrl`
   - `public/robots.txt → Sitemap:` line
5. Rebuild/redeploy so canonical URL, sitemap, and Open Graph URLs are correct.

## 12. Roll back using Git

Two options:

- **Instant (no rebuild):** Cloudflare Pages → project → **Deployments** →
  pick a previous successful deployment → **Rollback**.
- **Via Git (source of truth):**
  ```bash
  git revert <bad-commit-sha>   # safe: creates a new commit undoing changes
  git push origin main          # triggers a fresh production deploy
  # or hard reset (rewrites history — use with care):
  # git reset --hard <good-sha> && git push --force-with-lease
  ```

## 13. Why click-to-reveal is **not** secure access control

Hiding is done with a CSS class **only when JavaScript is enabled**. The
complete résumé is always in the HTML and is retrievable by:

- Viewing source / DevTools,
- Disabling JavaScript (the page then shows everything by design),
- Crawlers and social scrapers,
- The print stylesheet (which expands all content).

Treat the reveal as a friendly interaction, never as protection. Do not put
sensitive data behind it — instead, **don’t publish sensitive data at all**
(see §14).

## 14. Personal data you should NOT add to a public résumé

- ❌ Street/home address (use **city/region** only — already the design).
- ❌ Date of birth, national ID / passport / tax numbers.
- ❌ Marital status, religion, health, or other sensitive attributes.
- ❌ Signature image, exact salary, references’ private contact details.
- ❌ Anything you wouldn’t want indexed by search engines forever.

Contact details are **excluded from JSON-LD by default**
(`seo.exposeContactInStructuredData: false`).

---

## Security headers & CSP

`public/_headers` defines Cloudflare Pages headers. The
`postbuild-csp` step (part of `npm run build`) computes the **SHA-256 hash of
each inline script** (the Schema.org JSON-LD and Astro’s small module script)
and injects them into the CSP `script-src` — so we ship a strict policy with
**no `unsafe-inline` and no `unsafe-eval`**. `style-src` is `'self'` only,
because Astro is configured (`inlineStylesheets: 'never'`) to emit all CSS as
external files (no inline `<style>` or `style=""`).

If you change résumé data, just rebuild — the hashes regenerate automatically.

## Project structure

```
astro.config.mjs         Site origin, static output, sitemap, external CSS
public/
  _headers               CSP + security headers (hash placeholder)
  robots.txt             Allow all + sitemap URL
  favicon.svg            GT monogram
  images/                Optimized portrait (avif/webp) + og-cover + placeholder
design/
  profile-source.png     Source photo (NOT deployed)
scripts/
  optimize-portrait.mjs  Regenerate responsive portrait assets
  postbuild-csp.mjs      Inject inline-script hashes into dist/_headers
src/
  schemas/resume.schema.ts   Zod schema + inferred TS types (single source)
  data/resume.data.ts        ALL résumé content (validated at build time)
  scripts/
    contact-links.ts    Pure mailto/wa.me builders + persistence helpers
    reveal-resume.ts     The only client script (progressive enhancement)
    format.ts            Date formatting helpers
  layouts/BaseLayout.astro   <head> SEO/OG/Twitter/JSON-LD, skip link, live region
  components/
    ExecutiveProfile.astro   Hero (photo, name, headline, summary, contacts)
    ContactActions.astro     The two contact buttons (hero + sticky mobile bar)
    FullResume.astro         Assembles all revealed sections
    ResumeSection.astro      Section wrapper w/ numbered accessible heading
    ExperienceItem.astro     One role (<article>, <time>)
    AchievementItem.astro    Minto-ordered achievement
    ProjectItem.astro / SkillGroup.astro
  pages/index.astro          The page
  styles/global.css          Original visual identity, print + reduced-motion
tests/                       Vitest unit tests + accessibility checklist
```

## Privacy summary

No cookies, no fingerprinting, no analytics, no ad or third-party scripts, no
external fonts, and **no network requests at view time** beyond loading the site
itself. The only stored value is an anonymous `resume:revealed` flag in your
own browser (per the chosen persistence mode).
