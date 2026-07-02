# Technology Stack

**Analysis Date:** 2026-07-02

## Languages

**Primary:**
- TypeScript 5.8.3 — all source files in `src/` (`tsconfig.json` line 1)
- TSX — React component files throughout `src/routes/` and `src/components/`

**Secondary:**
- JavaScript — build scripts (`scripts/build-vercel.js`)

## Runtime

**Environment:**
- Node.js 20.x — Vercel function runtime (`scripts/build-vercel.js` line 65: `"runtime": "nodejs20.x"`)
- Nitro SSR server — handles edge/serverless via `src/server.ts`

**Package Manager:**
- Bun — `vercel.json` install command: `bun install`
- Lockfile: `bun.lock` present
- Config: `bunfig.toml` — 24h supply-chain guard via `minimumReleaseAge = 86400`

## Frameworks

**Core:**
- React 19.2.0 — UI rendering (`package.json` line 57)
- TanStack Start 1.167.50 — SSR meta-framework (`@tanstack/react-start`, `package.json` line 47)
- TanStack Router 1.168.25 — file-based routing (`@tanstack/react-router`, `package.json` line 46)
- TanStack Query 5.83.0 — server state management (`@tanstack/react-query`, `package.json` line 45)

**UI Component System:**
- shadcn/ui — component library scaffolding (`components.json`, style: "new-york", baseColor: slate)
- Radix UI — headless primitives (22 `@radix-ui/*` packages, `package.json` lines 16–42)
- Tailwind CSS 4.2.1 — styling (`package.json` line 65)
- Framer Motion 12.40.0 — animations (`package.json` line 54)
- Lucide React 0.575.0 — icon library (`package.json` line 56; configured as icon library in `components.json`)

**Forms:**
- React Hook Form 7.71.2 + `@hookform/resolvers` 5.2.2 + Zod 3.24.2 — form handling and validation

**Data Display:**
- Recharts 2.15.4 — charts and data visualization
- Embla Carousel React 8.6.0 — carousels
- React Day Picker 9.14.0 — date picker

**Build/Dev:**
- Vite 7.3.1 — dev server and bundler
- `@lovable.dev/vite-tanstack-config` 2.1.1 — unified Vite config; provides tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, componentTagger (dev-only), VITE_* env injection, `@` path alias (`vite.config.ts` lines 1–6)
- `@tanstack/router-plugin` 1.167.28 — route tree generation
- Nitro 3.0.260429-beta — SSR bundler, configured via `vite.config.ts` with `preset: "vercel"`

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.110.0 — database and auth client; instantiated in `src/lib/supabase.ts`
- `@tanstack/react-start` 1.167.50 — SSR server functions and entry point
- `zod` 3.24.2 — schema validation used across forms

**UI Utilities:**
- `class-variance-authority` 0.7.1 — component variant styling
- `clsx` 2.1.1 + `tailwind-merge` 3.5.0 — conditional class merging (used in `src/lib/utils.ts`)
- `tw-animate-css` 1.3.4 — Tailwind animation utilities
- `cmdk` 1.1.1 — command menu primitive
- `sonner` 2.0.7 — toast notifications
- `vaul` 1.1.2 — drawer component
- `input-otp` 1.4.2 — OTP input
- `react-resizable-panels` 4.6.5 — resizable layout panels
- `date-fns` 4.1.0 — date utilities

## Configuration

**TypeScript:**
- Target: ES2022, module: ESNext, strict mode enabled
- Path alias: `@/*` → `./src/*` (`tsconfig.json` line 23–25)
- `noEmit: true` — Vite handles bundling, tsc only typechecks
- `moduleResolution: "Bundler"` — modern resolution for Vite

**Build:**
- `vite.config.ts` — delegates to `@lovable.dev/vite-tanstack-config`
- Nitro preset: `vercel` — targets Vercel serverless output
- Custom Vercel output script: `scripts/build-vercel.js` — manually constructs `.vercel/output/` with Build Output API v3 structure
- Build command (Vercel): `bun run build && bun scripts/build-vercel.js`

**Linting/Formatting:**
- ESLint 9.32.0 with `typescript-eslint` 8.56.1 (`eslint.config.js`)
- Prettier 3.7.3 via `eslint-plugin-prettier`
- Rules: React Hooks enforced, `react-refresh/only-export-components` warned, `@typescript-eslint/no-unused-vars` off

**Lovable Platform:**
- Template: `tanstack_start_ts_2026-05-29` (`.lovable/project.json`)
- Error reporting: `src/lib/lovable-error-reporting.ts` — sends to `window.__lovableEvents.captureException`

## Platform Requirements

**Development:**
- Bun as package manager and script runner
- `bun run dev` → Vite dev server
- `bun run typecheck` → `tsc --noEmit`
- `bun run build` → typecheck + Vite build

**Production:**
- Vercel — Node.js 20.x serverless function for SSR
- Static assets served from `.vercel/output/static/` with 1-year immutable cache
- SSR handled by `.vercel/output/functions/index.func/` (Nitro output + Node-to-Web-API bridge)

---

*Stack analysis: 2026-07-02*
