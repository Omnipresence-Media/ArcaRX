/**
 * Converts Nitro's dist/ output into Vercel Build Output API v3 format.
 * Uses Node.js 20.x runtime (SSR requires node:stream / crypto).
 */
import { cp, mkdir, writeFile, rm } from "fs/promises";
import { existsSync } from "fs";

const OUT = ".vercel/output";
const FUNC = `${OUT}/functions/index.func`;

// Node.js-compatible wrapper: bridges Web API fetch handler → Node.js (req, res)
const NODE_HANDLER = `
import nitroHandler from "./index.mjs";

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
`.trimStart();

async function main() {
  if (existsSync(OUT)) await rm(OUT, { recursive: true });

  await mkdir(`${OUT}/static`, { recursive: true });
  await mkdir(FUNC, { recursive: true });

  // Static client assets → .vercel/output/static/
  if (existsSync("dist/client")) {
    await cp("dist/client", `${OUT}/static`, { recursive: true });
  }

  // SSR server → .vercel/output/functions/index.func/
  await cp("dist/server", FUNC, { recursive: true });

  // Node.js bridge wrapper
  await writeFile(`${FUNC}/index.js`, NODE_HANDLER);

  // Function config — Node.js 20.x runtime
  await writeFile(
    `${FUNC}/.vc-config.json`,
    JSON.stringify(
      { runtime: "nodejs20.x", handler: "index.js", launcherType: "Nodejs" },
      null,
      2
    )
  );

  // Route config
  await writeFile(
    `${OUT}/config.json`,
    JSON.stringify(
      {
        version: 3,
        routes: [
          {
            src: "^/assets/(.*)$",
            headers: { "cache-control": "public, max-age=31536000, immutable" },
            continue: true,
          },
          { src: "^/(.*)$", dest: "/index" },
        ],
      },
      null,
      2
    )
  );

  console.log("✓ .vercel/output built (nodejs20.x runtime)");
}

main().catch((err) => { console.error(err); process.exit(1); });
