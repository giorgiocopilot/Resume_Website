/**
 * optimize-portrait.mjs
 * -----------------------------------------------------------------------------
 * Regenerate the responsive portrait assets from a single source image.
 *
 * Usage:
 *   node scripts/optimize-portrait.mjs [sourcePath]
 *
 *   • sourcePath defaults to design/profile-source.png (kept OUT of /public so
 *     the large original is never deployed).
 *   • Outputs square-cropped AVIF + WebP at 480px and 960px into
 *     public/images/ as profile-480.* and profile-960.* (referenced by
 *     ExecutiveProfile.astro).
 *
 * Requires `sharp` (already an Astro transitive dependency). If you prefer not
 * to run Node, any tool that produces the same filenames/sizes works too.
 * -----------------------------------------------------------------------------
 */
import sharp from "sharp";
import { existsSync } from "node:fs";

const src = process.argv[2] ?? "design/profile-source.png";
if (!existsSync(src)) {
  console.error(`Source image not found: ${src}`);
  process.exit(1);
}

const jobs = [
  ["public/images/profile-480.webp", 480, "webp"],
  ["public/images/profile-960.webp", 960, "webp"],
  ["public/images/profile-480.avif", 480, "avif"],
  ["public/images/profile-960.avif", 960, "avif"],
];

for (const [out, size, fmt] of jobs) {
  let img = sharp(src).resize(size, size, { fit: "cover", position: "attention" });
  img = fmt === "webp" ? img.webp({ quality: 82 }) : img.avif({ quality: 60 });
  await img.toFile(out);
  console.log(`✓ ${out}`);
}
console.log("Portrait assets regenerated.");
