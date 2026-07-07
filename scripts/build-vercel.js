/**
 * Creates .vercel/output/ from scratch after bun run build.
 *
 * On Vercel's CI servers Nitro's vercel preset does NOT write .vercel/output/,
 * so we build the entire Vercel Build Output API v3 structure ourselves:
 *
 *   .vercel/output/
 *     config.json                        ← routing with handle:filesystem
 *     static/                            ← dist/client/ (client bundle)
 *     functions/index.func/              ← SSR handler (dist/server/)
 *       index.js                         ← Node.js → Web API bridge
 *       .vc-config.json
 *       index.mjs + _chunks/ + _libs/…  ← Nitro SSR output
 */

import { mkdir, cp, writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";

const ROOT = process.cwd();
const STATIC_SRC  = resolve(ROOT, "dist/client");
const SERVER_SRC  = resolve(ROOT, "dist/server");
const OUT         = resolve(ROOT, ".vercel/output");
const STATIC_OUT  = `${OUT}/static`;
const FUNC_OUT    = `${OUT}/functions/index.func`;

if (!existsSync(STATIC_SRC)) {
  console.error("✗ dist/client/ not found - did the build succeed?");
  process.exit(1);
}
if (!existsSync(SERVER_SRC)) {
  console.error("✗ dist/server/ not found - did the build succeed?");
  process.exit(1);
}

// 1. Static files
console.log("→ Copying dist/client/ → .vercel/output/static/");
await mkdir(STATIC_OUT, { recursive: true });
await cp(STATIC_SRC, STATIC_OUT, { recursive: true });

// 2. SSR function
console.log("→ Copying dist/server/ → .vercel/output/functions/index.func/");
await mkdir(FUNC_OUT, { recursive: true });
await cp(SERVER_SRC, FUNC_OUT, { recursive: true });

// 3. Node.js → Web API bridge (index.js)
const BRIDGE = `import nitroHandler from "./index.mjs";

export default async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host  = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url   = new URL(req.url, proto + "://" + host);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v != null) headers.set(k, Array.isArray(v) ? v.join(", ") : String(v));
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody
    ? new ReadableStream({
        start(ctrl) {
          req.on("data", (c) => ctrl.enqueue(c));
          req.on("end",  ()  => ctrl.close());
          req.on("error",(e) => ctrl.error(e));
        },
      })
    : undefined;

  const webReq = new Request(url.href, { method: req.method, headers, body, duplex: "half" });
  const webRes = await nitroHandler.fetch(webReq, {});

  res.statusCode = webRes.status;
  webRes.headers.forEach((v, k) => res.setHeader(k, v));

  if (webRes.body) {
    const reader = webRes.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}
`;
await writeFile(`${FUNC_OUT}/index.js`, BRIDGE);

// 4. Function runtime config
await writeFile(
  `${FUNC_OUT}/.vc-config.json`,
  JSON.stringify({ runtime: "nodejs22.x", handler: "index.js", launcherType: "Nodejs" }, null, 2)
);

// 5. Vercel routing config
const config = {
  version: 3,
  routes: [
    // Long-lived immutable cache for hashed assets
    {
      src: "^/assets/(.*)$",
      headers: { "cache-control": "public, max-age=31536000, immutable" },
      continue: true,
    },
    // Serve static files before falling through to SSR
    { handle: "filesystem" },
    // Everything else → SSR
    { src: "^/(.*)$", dest: "/index" },
  ],
};
await writeFile(`${OUT}/config.json`, JSON.stringify(config, null, 2));

console.log("✓ .vercel/output/ created successfully");
console.log(`  static: ${STATIC_OUT}`);
console.log(`  function: ${FUNC_OUT}`);
console.log(`  config: ${OUT}/config.json`);
