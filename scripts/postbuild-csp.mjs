/**
 * postbuild-csp.mjs
 * -----------------------------------------------------------------------------
 * Runs AFTER `astro build`. Scans every built HTML file for INLINE <script>
 * blocks (the Schema.org JSON-LD and Astro's small bundled import), computes
 * each block's SHA-256, and injects the resulting 'sha256-...' source
 * expressions into the Content-Security-Policy in dist/_headers — replacing the
 * %%INLINE_SCRIPT_HASHES%% placeholder.
 *
 * Why: this lets us keep a strict CSP (no 'unsafe-inline', no 'unsafe-eval')
 * while still shipping inline scripts, which CSP otherwise blocks. If content
 * changes, the hash changes, and rebuilding regenerates it automatically.
 * -----------------------------------------------------------------------------
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, extname } from "node:path";

const DIST = "dist";
const PLACEHOLDER = "%%INLINE_SCRIPT_HASHES%%";

/** Recursively list files under a directory. */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

/** Extract inner text of every INLINE <script> (i.e. without a src=) tag. */
function extractInlineScripts(html) {
  const scripts = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || "";
    const body = m[2] ?? "";
    if (/\bsrc\s*=/.test(attrs)) continue; // external → governed by 'self'
    if (body.trim().length === 0) continue;
    scripts.push(body);
  }
  return scripts;
}

function sha256Base64(text) {
  return createHash("sha256").update(text, "utf8").digest("base64");
}

async function main() {
  const files = await walk(DIST);
  const htmlFiles = files.filter((f) => extname(f) === ".html");

  const hashes = new Set();
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    for (const body of extractInlineScripts(html)) {
      hashes.add(`'sha256-${sha256Base64(body)}'`);
    }
  }

  const headersPath = join(DIST, "_headers");
  let headers;
  try {
    headers = await readFile(headersPath, "utf8");
  } catch {
    console.warn(
      "[postbuild-csp] dist/_headers not found — did public/_headers get copied? Skipping.",
    );
    return;
  }

  const replacement = hashes.size > 0 ? [...hashes].join(" ") : "";
  const updated = headers.split(PLACEHOLDER).join(replacement).replace(/  +/g, " ");
  await writeFile(headersPath, updated, "utf8");

  console.log(
    `[postbuild-csp] Injected ${hashes.size} inline-script hash(es) into dist/_headers.`,
  );
  if (hashes.size === 0) {
    console.log("[postbuild-csp] (No inline scripts found — CSP needs no hashes.)");
  }
}

main().catch((err) => {
  console.error("[postbuild-csp] Failed:", err);
  process.exit(1);
});
