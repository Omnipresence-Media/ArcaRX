/**
 * Post-build patch for Vercel config.
 * Nitro's vercel preset omits handle:filesystem, so all requests (including
 * JS/CSS assets) fall through to the SSR function instead of being served
 * as static files. We inject it before the SSR catch-all route.
 */
import { readFile, writeFile } from "fs/promises";

const CONFIG = ".vercel/output/config.json";

const raw = await readFile(CONFIG, "utf8");
const cfg = JSON.parse(raw);

// Insert handle:filesystem before any route that has dest:/index (SSR catch-all)
const ssrIdx = cfg.routes.findIndex((r) => r.dest === "/index" && !r.continue);
if (ssrIdx !== -1) {
  const alreadyHasFilesystem = cfg.routes
    .slice(0, ssrIdx)
    .some((r) => r.handle === "filesystem");
  if (!alreadyHasFilesystem) {
    cfg.routes.splice(ssrIdx, 0, { handle: "filesystem" });
    console.log("✓ Patched .vercel/output/config.json — inserted handle:filesystem before SSR route");
  } else {
    console.log("✓ config.json already has handle:filesystem, no patch needed");
  }
} else {
  console.log("⚠ No SSR catch-all route found — config.json unchanged");
}

await writeFile(CONFIG, JSON.stringify(cfg, null, 2));
