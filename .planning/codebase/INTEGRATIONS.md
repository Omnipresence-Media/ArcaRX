# External Integrations

**Analysis Date:** 2026-07-02

## APIs & External Services

**Database & Backend:**
- Supabase — primary data store and auth backend
  - SDK/Client: `@supabase/supabase-js` 2.110.0
  - Client file: `src/lib/supabase.ts` (exports singleton `supabase`)
  - Auth env var: `VITE_SUPABASE_URL` (line 3), `VITE_SUPABASE_ANON_KEY` (line 4)
  - Both are public VITE_ vars — the anon key is intentionally shipped to the browser
  - Instantiation: `createClient(supabaseUrl, supabaseAnonKey)` — `src/lib/supabase.ts` line 6

**Lovable Platform:**
- Lovable.dev — AI-assisted dev platform that scaffolded and hosts the project
  - Error reporting bridge: `src/lib/lovable-error-reporting.ts`
  - Runtime hook: `window.__lovableEvents.captureException` (line 22)
  - Dev plugin: `componentTagger` provided by `@lovable.dev/vite-tanstack-config` (dev-only)
  - Project config: `.lovable/project.json` (template: `tanstack_start_ts_2026-05-29`)

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `VITE_SUPABASE_URL`
  - Client: `@supabase/supabase-js` singleton at `src/lib/supabase.ts`
  - Note: As of this analysis, routes use mock data (`@/features/portal/mockData`, `@/features/portal/shopData`). Supabase client is configured but live DB queries are not yet wired into route components.

**File Storage:**
- Not detected — no Supabase Storage or S3 calls found in source

**Caching:**
- TanStack Query (`@tanstack/react-query` 5.83.0) — client-side server state cache; `QueryClientProvider` wraps the app at `src/routes/__root.tsx` line 1

## Authentication & Identity

**Auth Provider:**
- Supabase Auth — via `@supabase/supabase-js` client
  - Implementation: not yet wired into route components (auth flows not found in current routes)
  - Client available at `src/lib/supabase.ts` for use in server functions

## Monitoring & Observability

**Error Tracking:**
- Lovable error bridge — `src/lib/lovable-error-reporting.ts`
  - Captures React error boundary failures
  - Forwards to `window.__lovableEvents.captureException` (platform-injected)
  - Reports: error object, source (`"react_error_boundary"`), current `window.location.pathname`
- SSR error normalization — `src/server.ts` — catches h3-swallowed 500s and re-renders error page

**Logs:**
- `console.error` used in `src/server.ts` for SSR-level errors (lines 33, 43)
- No structured logging library detected

## CI/CD & Deployment

**Hosting:**
- Vercel — SSR deployment via Build Output API v3
  - Config: `vercel.json`
    - `installCommand`: `bun install`
    - `buildCommand`: `bun run build && bun scripts/build-vercel.js`
    - `framework`: null (custom build, not a detected Vercel framework)
  - Runtime: Node.js 20.x (`scripts/build-vercel.js` line 65)
  - Output structure: `.vercel/output/` with `static/`, `functions/index.func/`
  - Routing: hashed assets get `cache-control: public, max-age=31536000, immutable`; all other paths fall through to SSR handler

**CI Pipeline:**
- Not detected — no `.github/workflows/`, CircleCI, or similar config found

## Environment Configuration

**Required env vars:**

| Variable | Access Pattern | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `import.meta.env.VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `import.meta.env.VITE_SUPABASE_ANON_KEY` | Supabase public anon key |
| `NODE_ENV` | `process.env.NODE_ENV` (server-side only) | Runtime environment |

**Env var rules (from `src/lib/config.server.ts`):**
- `VITE_*` prefix: public, shipped to browser via `import.meta.env` — never put secrets here
- Server secrets (e.g. `DATABASE_URL`, `STRIPE_SECRET_KEY`): use `process.env` inside `*.server.ts` files or `createServerFn` handlers, never module scope (Cloudflare Workers bind env at request time)

**Secrets location:**
- `.env` file present at `/Users/omni/Desktop/ArcaRX/.env` — contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values (contents not read)

## Webhooks & Callbacks

**Incoming:**
- Not detected — no webhook handler routes found in `src/routes/`

**Outgoing:**
- Not detected — no fetch calls to third-party webhook endpoints found in source

## Third-Party Services — Not Yet Integrated (Placeholders in Config)

The following are referenced as commented-out examples in `src/lib/config.server.ts` but are not active:
- Stripe — `process.env.STRIPE_SECRET_KEY` commented out at line 24
- Generic database URL — `process.env.DATABASE_URL` commented out at line 23

These indicate planned integrations, not current ones.

---

*Integration audit: 2026-07-02*
