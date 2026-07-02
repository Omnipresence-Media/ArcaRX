<!-- refreshed: 2026-07-02 -->
# Architecture

**Analysis Date:** 2026-07-02

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        TanStack Start (SSR)                             │
│                `src/start.ts` · `src/server.ts`                         │
├────────────────────┬────────────────────┬───────────────────────────────┤
│   Marketing Site   │   Admin Dashboard  │     Patient Portal            │
│   `/` `/features`  │   `/admin/*`       │     `/portal/*`               │
│   `/pricing` etc.  │   route.tsx layout │     portal.tsx layout         │
└─────────┬──────────┴────────┬───────────┴──────────────┬────────────────┘
          │                   │                           │
          ▼                   ▼                           ▼
┌──────────────────┐  ┌──────────────────┐   ┌──────────────────────────┐
│ Marketing Comps  │  │  Shell + Sidebar  │   │   PortalShell.tsx        │
│ `components/     │  │  `components/     │   │  `features/portal/       │
│  marketing/`     │  │   shell/`         │   │   PortalShell.tsx`       │
└──────────────────┘  └────────┬─────────┘   └────────────┬─────────────┘
                               │                           │
                               ▼                           ▼
                    ┌──────────────────────────────────────────────────┐
                    │          React Query + Mock Data Layer            │
                    │    `src/hooks/queries/`  ←→  `src/lib/data/`    │
                    └─────────────────────────┬────────────────────────┘
                                              │
                                              ▼
                                   ┌────────────────────┐
                                   │  Supabase Client   │
                                   │  `src/lib/         │
                                   │   supabase.ts`     │
                                   │  (configured but   │
                                   │   not yet wired)   │
                                   └────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root shell | HTML document shell, QueryClientProvider, global meta | `src/routes/__root.tsx` |
| Router | TanStack Router instance with QueryClient context | `src/router.tsx` |
| Admin layout | Sidebar + TopBar + CommandPalette + DashboardCanvas shell | `src/routes/admin/route.tsx` |
| PortalShell | Patient portal left rail nav + mobile tab bar | `src/features/portal/PortalShell.tsx` |
| AppSidebar | Collapsible icon sidebar, location switcher, nav groups | `src/components/shell/AppSidebar.tsx` |
| Marketing Nav | Top nav for all public pages | `src/components/marketing/Nav.tsx` |
| Mock data layer | Typed static arrays returned via React Query hooks | `src/lib/data/` |
| Seed data | Practice/KPI/metric fixtures used in the admin UI | `src/lib/seed-data.ts` |

## Pattern Overview

**Overall:** File-based routing SPA with SSR via TanStack Start. Three independent surface areas (marketing, admin, portal) each with their own layout shell. Data is served from typed in-memory mock arrays wrapped in React Query hooks with artificial delay to simulate real latency.

**Key Characteristics:**
- No authentication guards — all routes are publicly accessible (demo/prototype)
- Supabase client is configured at `src/lib/supabase.ts` but no queries use it yet; all data is mock
- Admin and portal use `data-no-invert` on their root `<div>` to opt out of the marketing site's dark-mode filter
- TanStack Router context carries `QueryClient` instance, created once in `src/router.tsx`

## Layers

**Routing Layer:**
- Purpose: Defines URL structure and ties layouts to URL segments
- Location: `src/routes/`
- Contains: Layout files (`route.tsx`, `__root.tsx`, `portal.tsx`), leaf page files
- Depends on: Feature components, shell components
- Used by: Nothing — is the entry point

**Shell Layer:**
- Purpose: Persistent chrome (sidebars, top bars, command palette, mobile nav)
- Location: `src/components/shell/`
- Contains: `AppSidebar`, `TopBar`, `CommandPalette`, `MobileTabBar`, `DashboardCanvas`, page-level wrappers
- Depends on: UI primitives, router state
- Used by: Admin layout route (`src/routes/admin/route.tsx`)

**Feature Layer:**
- Purpose: Self-contained feature modules with their own layouts, hooks, and mock data
- Location: `src/features/`
- Contains: `ascend/` (Ascend OS prototype), `portal/` (patient portal shell + mock data + cart), `sites/` (HRT/MedSpa white-label site mocks)
- Depends on: UI components, router
- Used by: Routes that import from features

**Data Layer:**
- Purpose: Typed domain models + in-memory datasets + React Query hooks
- Location: `src/lib/data/` (raw arrays), `src/hooks/queries/` (React Query wrappers)
- Contains: `types.ts` (shared domain types), per-entity files (`patients.ts`, `encounters.ts`, etc.), query hooks
- Depends on: Nothing external (all mock)
- Used by: Admin route page components

**UI Component Layer:**
- Purpose: shadcn/ui primitives (button, card, sidebar, tabs, etc.)
- Location: `src/components/ui/`
- Contains: 40+ primitive components copied from shadcn/ui
- Depends on: Radix UI, Tailwind CSS
- Used by: Every layer above

## Data Flow

### Admin Route (Mock Path)

1. User navigates to `/admin/dashboard` → `src/routes/admin/route.tsx` renders `AdminLayout`
2. `AdminLayout` wraps in `SidebarProvider` → renders `<AppSidebar>` + `<TopBar>` + `<DashboardCanvas>` + `<Outlet>`
3. `<Outlet>` renders `src/routes/admin/dashboard.tsx` → `Dashboard` component
4. `Dashboard` calls `usePatients()` from `src/hooks/queries/usePatients.ts`
5. Hook runs `useQuery` → `queryFn` sleeps 120ms then returns `patients` array from `src/lib/data/patients.ts`
6. React Query caches for `staleTime: 30_000ms`

### Portal Path

1. `/portal` → `src/routes/portal.tsx` → renders `PortalShell` from `src/features/portal/PortalShell.tsx`
2. `PortalShell` renders left rail nav + `<Outlet>` for sub-routes (`/portal/visits`, `/portal/meds`, etc.)
3. Sub-routes import directly from `src/features/portal/mockData.ts` (no React Query layer)
4. Cart state lives in `src/features/portal/cart.ts` — module-level singleton (Zustand-free, plain export)

### Marketing Path

1. `/` → `src/routes/index.tsx` → `HomePage` renders all sections inline (no sub-routes)
2. All content is static JSX + inline style objects
3. `DashboardMock` (`src/components/marketing/DashboardMock.tsx`) is a purely visual SVG/HTML mock

## Key Abstractions

**Domain Types (`src/lib/data/types.ts`):**
- Purpose: Central type definitions for all clinical entities
- Entities: `Patient`, `Encounter`, `LabResult`, `Prescription`, `Appointment`, `Invoice`, `AuditEvent`, `Provider`, `Location`
- Treatment tracks: `"trt" | "glp1" | "aesthetics" | "skincare" | "nad" | "hormone" | "general"`

**React Query Hooks (`src/hooks/queries/`):**
- Pattern: each hook wraps a mock array lookup behind `useQuery` with a `sleep(120)` artificial delay
- Files: `usePatients.ts`, `useAppointments.ts`, `useEncounters.ts`, `useLabs.ts`, `usePrescriptions.ts`, `useInvoices.ts`, `useAudit.ts`
- Replacing mock with Supabase means only changing the `queryFn` body in each hook file

**Practice Seed (`src/lib/seed-data.ts`):**
- Purpose: KPI metrics, revenue series, chart data, and `practice` object (locations/MRR)
- Used by: `AppSidebar` for location switcher, `Dashboard` for charts

## Entry Points

**Server entry:**
- Location: `src/start.ts`
- Role: Creates TanStack Start instance with error middleware

**Router entry:**
- Location: `src/router.tsx`
- Role: Instantiates router with `routeTree` (auto-generated at `src/routeTree.gen.ts`) and `QueryClient`

**Root route:**
- Location: `src/routes/__root.tsx`
- Role: HTML shell (`<html><head><body>`), Google Fonts links, global meta tags, `QueryClientProvider` wrapper

## Route Map

### Marketing Routes (no layout wrapper, each route renders Nav + Footer inline)
| URL | File |
|-----|------|
| `/` | `src/routes/index.tsx` |
| `/features` | `src/routes/features.tsx` |
| `/features/$slug` | `src/routes/features.$slug.tsx` |
| `/pricing` | `src/routes/pricing.tsx` |
| `/about` | `src/routes/about.tsx` |
| `/customers` | `src/routes/customers.tsx` |
| `/blog` | `src/routes/blog.tsx` |
| `/blog/$slug` | `src/routes/blog.$slug.tsx` |
| `/demo` | `src/routes/demo.tsx` |
| `/partners` | `src/routes/partners.tsx` |
| `/security` | `src/routes/security.tsx` |
| `/compare/$competitor` | `src/routes/compare/$competitor.tsx` |
| `/arca` | `src/routes/arca.tsx` |
| `/ascend` | `src/routes/ascend.tsx` (Ascend OS prototype, SSR disabled) |

### Admin Routes (nested under `/admin` layout in `src/routes/admin/route.tsx`)
**Front Desk:**
- `/admin/dashboard` — Command Center with KPIs, waiting room, charts
- `/admin/calendar` — Appointment calendar
- `/admin/pos` — Point of sale

**Patients:**
- `/admin/patients` → `/admin/patients.index` (list), `/admin/patients.$id` (detail)
- `/admin/memberships`, `/admin/messages`, `/admin/leads`

**Clinical:**
- `/admin/charts`, `/admin/protocols`, `/admin/intake`, `/admin/scribe`
- `/admin/photo-reviews`, `/admin/telehealth`, `/admin/population`

**Analytics:**
- `/admin/analytics`, `/admin/acquisition`, `/admin/paid-channels`, `/admin/email-sms`
- `/admin/membership-health`, `/admin/product-revenue`, `/admin/bookings-analytics`
- `/admin/referrals`, `/admin/phone-calls`

**Revenue:**
- `/admin/billing`, `/admin/rcm`

**Growth:**
- `/admin/reputation`, `/admin/social`, `/admin/website`

**Arca Fit / Coaching (under "Arca Extra" sidebar section):**
- `/admin/fit` (layout passthrough), `/admin/fit.index`, `/admin/fit.clients`, `/admin/fit.clients.$id`
- `/admin/fit.workouts`, `/admin/fit.workouts.builder`, `/admin/fit.nutrition`
- `/admin/fit.live`, `/admin/fit.scans`, `/admin/fit.videos`, `/admin/fit.messages`
- `/admin/fit.leads`, `/admin/fit.billing`, `/admin/fit.business`, `/admin/fit.calendar`
- `/admin/fit.challenges`, `/admin/fit.reviews`, `/admin/fit.portal`
- `/admin/coach-performance`

**Operations:**
- `/admin/inventory`, `/admin/locations`, `/admin/products`, `/admin/results-gallery`

**Compliance:**
- `/admin/hipaa`

**Settings:**
- `/admin/settings`

### Portal Routes (nested under `PortalShell` via `src/routes/portal.tsx`)
| URL | File |
|-----|------|
| `/portal` (index) | `src/routes/portal.index.tsx` |
| `/portal/visits` | `src/routes/portal.visits.tsx` |
| `/portal/meds` | `src/routes/portal.meds.tsx` |
| `/portal/labs` | `src/routes/portal.labs.tsx` |
| `/portal/messages` | `src/routes/portal.messages.tsx` |
| `/portal/progress` | `src/routes/portal.progress.tsx` |
| `/portal/billing` | `src/routes/portal.billing.tsx` |
| `/portal/account` | `src/routes/portal.account.tsx` |
| `/portal/shop` | `src/routes/portal.shop.index.tsx` |
| `/portal/shop/$productId` | `src/routes/portal.shop.$productId.tsx` |
| `/portal/shop/cart` | `src/routes/portal.shop.cart.tsx` |
| `/portal/shop/orders` | `src/routes/portal.shop.orders.tsx` |

## Architectural Constraints

- **Auth:** None implemented. All routes are public. "Start Free Trial" CTAs link directly to `/admin/dashboard` without any login flow.
- **Global state:** Cart state is a module-level singleton in `src/features/portal/cart.ts`. Location switcher state is local `useState` inside `AppSidebar` — not persisted.
- **SSR:** Enabled by default via TanStack Start. `/ascend` has `ssr: false` to disable for that route.
- **Supabase:** Client initialized at `src/lib/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars. No query hooks use it — all data is from in-memory mock arrays.
- **Circular imports:** None observed. Data layer has no imports from hooks or routes.
- **fit.* routes:** Use dot-notation filenames (e.g., `admin/fit.clients.tsx`) which TanStack Router maps to nested `/admin/fit/clients` paths. The parent `admin/fit.tsx` is a passthrough `<Outlet />`.

## Anti-Patterns

### Inline styles on marketing pages
**What happens:** `src/routes/index.tsx` and other marketing pages use extensive `style={{}}` prop objects with hardcoded hex colors and font families.
**Why it's wrong:** Bypasses Tailwind theming, makes global color changes require touching dozens of files, can't use design tokens.
**Do this instead:** Define CSS variables (like the portal/admin already use via `var(--teal)`, `var(--glass-stroke)`) and use Tailwind utility classes.

### Portal mock data accessed directly (no query layer)
**What happens:** Portal sub-routes import directly from `src/features/portal/mockData.ts` instead of going through React Query hooks.
**Why it's wrong:** No loading/error states, no cache, harder to swap for real API calls later.
**Do this instead:** Follow the admin pattern — create `src/hooks/queries/usePortal*.ts` hooks that wrap the data, then swap `queryFn` bodies when Supabase is ready.

## Error Handling

**Strategy:** Root-level error boundary at `src/routes/__root.tsx` (`ErrorComponent`). Errors are reported via `reportLovableError` from `src/lib/lovable-error-reporting.ts`. 404s handled by `NotFoundComponent` in same file.

**Patterns:**
- Route-level: `errorComponent` prop on root route catches unhandled throws
- Server-level: `errorMiddleware` in `src/start.ts` catches server errors, returns 500 HTML page via `src/lib/error-page.ts`
- Data layer: No explicit error handling in mock query hooks (no network to fail)

## Cross-Cutting Concerns

**Logging:** `console.error` only. Lovable-specific error reporting hook in `src/lib/lovable-error-reporting.ts`.
**Validation:** None implemented (prototype stage).
**Authentication:** None implemented. All areas are demo-accessible without login.
**Mobile:** Admin has `MobileTabBar` (`src/components/shell/MobileTabBar.tsx`) for bottom nav. Portal has inline bottom tab bar in `PortalShell` + FAB for quick actions. Marketing is responsive via Tailwind.

---

*Architecture analysis: 2026-07-02*
