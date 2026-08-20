// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Keep the site origin in ONE place. It feeds canonical URLs and the sitemap.
// This MUST match `seo.canonicalUrl` in src/data/resume.data.ts.
const SITE = "https://resume.copilotadoption.uk";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Fully static output — ideal for Cloudflare Pages (no server runtime).
  output: "static",
  integrations: [sitemap()],
  build: {
    // Emit CSS as external files (helps a strict CSP that forbids inline JS;
    // we keep a hashed style allowance for Astro's scoped styles — see _headers).
    inlineStylesheets: "never",
  },
  // We do not use Astro's <Image> remote service; images are pre-optimized
  // in /public. This keeps the build dependency-light and CSP-friendly.
});
