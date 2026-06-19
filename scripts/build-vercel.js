/**
 * Converts Nitro's dist/ output into Vercel Build Output API v3 format.
 * Run after `bun run build` when deploying to Vercel.
 */
import { cp, mkdir, writeFile, rm } from "fs/promises";
import { existsSync } from "fs";

const OUT = ".vercel/output";
const FUNC = `${OUT}/functions/index.func`;

async function main() {
  // Clean previous output
  if (existsSync(OUT)) await rm(OUT, { recursive: true });

  await mkdir(`${OUT}/static`, { recursive: true });
  await mkdir(FUNC, { recursive: true });

  // Static assets → .vercel/output/static/
  if (existsSync("dist/client")) {
    await cp("dist/client", `${OUT}/static`, { recursive: true });
  }

  // SSR server → .vercel/output/functions/index.func/
  await cp("dist/server", FUNC, { recursive: true });

  // Thin entrypoint that re-exports the Vercel edge handler
  await writeFile(
    `${FUNC}/index.js`,
    `export { default } from "./index.mjs";\n`
  );

  // Function config — edge runtime, web fetch API
  await writeFile(
    `${FUNC}/.vc-config.json`,
    JSON.stringify({ runtime: "edge", entrypoint: "index.js" }, null, 2)
  );

  // Route config: static assets pass-through, everything else → SSR function
  await writeFile(
    `${OUT}/config.json`,
    JSON.stringify(
      {
        version: 3,
        routes: [
          // Serve pre-built assets directly
          {
            src: "^/assets/(.*)$",
            headers: { "cache-control": "public, max-age=31536000, immutable" },
            continue: true,
          },
          // Fallback: all other requests → edge SSR function
          { src: "^/(.*)$", dest: "/index" },
        ],
      },
      null,
      2
    )
  );

  console.log("✓ .vercel/output ready for deployment");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
