<!-- refreshed: 2026-07-02 -->
# Codebase Structure

**Analysis Date:** 2026-07-02

## Directory Layout

```
ArcaRX/
├── src/
│   ├── routes/                  # TanStack Router file-based routes
│   │   ├── __root.tsx           # Root layout: HTML shell, QueryClientProvider
│   │   ├── index.tsx            # Marketing homepage (/)
│   │   ├── admin/               # Admin dashboard routes (/admin/*)
│   │   │   ├── route.tsx        # Admin layout: sidebar + topbar + canvas
│   │   │   ├── dashboard.tsx    # /admin/dashboard - command center
│   │   │   ├── patients.tsx     # /admin/patients - layout passthrough
│   │   │   ├── patients.index.tsx
│   │   │   ├── patients.$id.tsx
│   │   │   ├── fit.tsx          # /admin/fit - layout passthrough
│   │   │   ├── fit.index.tsx    # /admin/fit - coaching overview
│   │   │   ├── fit.clients.tsx  # /admin/fit/clients
│   │   │   ├── fit.clients.$id.tsx
│   │   │   └── [50+ other admin page files]
│   │   ├── compare/
│   │   │   └── $competitor.tsx  # /compare/:competitor
│   │   ├── portal.tsx           # Portal layout (renders PortalShell)
│   │   ├── portal.index.tsx     # /portal - patient home
│   │   ├── portal.visits.tsx    # /portal/visits
│   │   ├── portal.meds.tsx
│   │   ├── portal.labs.tsx
│   │   ├── portal.shop.index.tsx
│   │   ├── portal.shop.$productId.tsx
│   │   ├── portal.shop.cart.tsx
│   │   ├── portal.shop.orders.tsx
│   │   ├── portal.messages.tsx
│   │   ├── portal.progress.tsx
│   │   ├── portal.billing.tsx
│   │   ├── portal.account.tsx
│   │   ├── ascend.tsx           # /ascend - Ascend OS prototype (ssr: false)
│   │   ├── arca.tsx             # /arca - Arca product marketing page
│   │   ├── features.tsx         # /features
│   │   ├── features.$slug.tsx   # /features/:slug
│   │   ├── pricing.tsx          # /pricing
│   │   ├── about.tsx
│   │   ├── blog.tsx
│   │   ├── blog.$slug.tsx
│   │   ├── customers.tsx
│   │   ├── demo.tsx
│   │   ├── partners.tsx
│   │   ├── security.tsx
│   │   └── README.md
│   │
│   ├── components/
│   │   ├── marketing/           # Public site components
│   │   │   ├── Nav.tsx          # Top nav with product toggle
│   │   │   ├── Footer.tsx
│   │   │   ├── FloatingCTA.tsx  # Sticky "Start Free Trial" bar
│   │   │   ├── DashboardMock.tsx # Visual hero mock of the admin UI
│   │   │   ├── Logo.tsx
│   │   │   ├── ProductToggle.tsx # ARCA Rx / Ascend toggle
│   │   │   ├── Reveal.tsx       # Scroll-reveal animation wrapper
│   │   │   ├── StubPage.tsx     # Placeholder for unbuilt marketing pages
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   ├── shell/               # Admin dashboard chrome
│   │   │   ├── AppSidebar.tsx   # Collapsible sidebar with all nav groups
│   │   │   ├── TopBar.tsx       # Header: breadcrumb, search, user menu
│   │   │   ├── CommandPalette.tsx # Cmd+K command palette
│   │   │   ├── DashboardCanvas.tsx # Main content wrapper with padding
│   │   │   ├── MobileTabBar.tsx # Fixed bottom nav (mobile admin)
│   │   │   ├── PageHeader.tsx   # Per-page title + action area
│   │   │   ├── ViewToggle.tsx   # Clinic / Patient toggle pill
│   │   │   ├── OnboardingChecklist.tsx
│   │   │   ├── AnalyticsSubPage.tsx # Reusable analytics section frame
│   │   │   ├── TreatmentPanel.tsx
│   │   │   ├── fit/             # Arca Fit / coaching-specific widgets
│   │   │   │   ├── AIAssistantPanel.tsx
│   │   │   │   ├── AdherenceHeatmap.tsx
│   │   │   │   ├── ExerciseRow.tsx
│   │   │   │   ├── HabitHeatmap.tsx
│   │   │   │   ├── InterventionQueue.tsx
│   │   │   │   ├── LeadKanban.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   ├── MacroRing.tsx
│   │   │   │   ├── OneRMChart.tsx
│   │   │   │   ├── ProgressPhotoCompare.tsx
│   │   │   │   ├── RiskPill.tsx
│   │   │   │   ├── VideoCard.tsx
│   │   │   │   ├── VolumeHeatmap.tsx
│   │   │   │   └── WeeklyDigestCard.tsx
│   │   │   └── viz/             # Reusable chart primitives
│   │   │       ├── AreaTrend.tsx
│   │   │       ├── Donut.tsx
│   │   │       └── Sparkline.tsx
│   │   │
│   │   ├── portal/              # Patient portal components
│   │   │   └── BookingModal.tsx
│   │   │
│   │   └── ui/                  # shadcn/ui primitives (40+ files)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── sidebar.tsx      # shadcn sidebar primitive used by AppSidebar
│   │       ├── chart.tsx        # Recharts wrapper
│   │       └── [38 other ui components]
│   │
│   ├── features/
│   │   ├── ascend/              # Ascend OS mobile prototype (self-contained)
│   │   │   ├── AscendApp.tsx    # Root component with tab switcher + framer-motion
│   │   │   ├── mockData.ts      # Ascend-specific mock data
│   │   │   ├── theme.css        # Ascend-specific CSS custom properties
│   │   │   ├── components/
│   │   │   │   └── primitives.tsx
│   │   │   └── tabs/            # One file per tab
│   │   │       ├── TodayTab.tsx
│   │   │       ├── FitnessTab.tsx
│   │   │       ├── LooksTab.tsx
│   │   │       ├── LifeTab.tsx
│   │   │       ├── BusinessTab.tsx
│   │   │       └── CoachTab.tsx
│   │   │
│   │   ├── portal/              # Patient portal feature module
│   │   │   ├── PortalShell.tsx  # Portal layout (left rail + outlet + mobile nav)
│   │   │   ├── mockData.ts      # Patient/visit/lab mock data
│   │   │   ├── shopData.ts      # Product catalog mock data
│   │   │   └── cart.ts          # Module-level cart state singleton
│   │   │
│   │   └── sites/               # White-label clinic site mocks
│   │       ├── HrtSite.tsx      # HRT clinic site preview
│   │       └── MedSpaSite.tsx   # Med spa site preview
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx       # `useIsMobile()` breakpoint hook
│   │   └── queries/             # React Query hooks for admin data
│   │       ├── usePatients.ts
│   │       ├── useAppointments.ts
│   │       ├── useEncounters.ts
│   │       ├── useLabs.ts
│   │       ├── usePrescriptions.ts
│   │       ├── useInvoices.ts
│   │       └── useAudit.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client (not yet wired to hooks)
│   │   ├── utils.ts             # `cn()` Tailwind merge utility
│   │   ├── seed-data.ts         # Practice fixture: locations, KPIs, chart series
│   │   ├── marketing-content.ts # Features + blog post content for dynamic pages
│   │   ├── fit-seed.ts          # Arca Fit coaching mock data
│   │   ├── fit-seed-extra.ts    # Extended fit mock data
│   │   ├── error-capture.ts
│   │   ├── error-page.ts        # Server-side 500 HTML renderer
│   │   ├── lovable-error-reporting.ts
│   │   ├── config.server.ts     # Server-only config
│   │   ├── data/                # Domain data layer
│   │   │   ├── types.ts         # All domain TypeScript interfaces
│   │   │   ├── index.ts         # Re-exports all data modules
│   │   │   ├── patients.ts
│   │   │   ├── providers.ts
│   │   │   ├── locations.ts
│   │   │   ├── encounters.ts
│   │   │   ├── labs.ts
│   │   │   ├── prescriptions.ts
│   │   │   ├── appointments.ts
│   │   │   ├── invoices.ts
│   │   │   └── audit.ts
│   │   └── api/
│   │       └── example.functions.ts  # TanStack Start server function example
│   │
│   ├── router.tsx               # Router factory (createRouter with QueryClient)
│   ├── routeTree.gen.ts         # AUTO-GENERATED - do not edit manually
│   ├── start.ts                 # TanStack Start entry point + error middleware
│   ├── server.ts                # Server handler
│   └── styles.css               # Global CSS: Tailwind directives + CSS variables
│
├── scripts/                     # Build/utility scripts
├── .planning/codebase/          # GSD codebase map documents
├── .claude/                     # Claude project config
└── .lovable/                    # Lovable platform config
```

## Key File Locations

**Entry Points:**
- `src/start.ts`: TanStack Start server entry, registers error middleware
- `src/router.tsx`: Router instance factory - import `getRouter()` to access router
- `src/routes/__root.tsx`: HTML document shell + global providers
- `src/routeTree.gen.ts`: Auto-generated route tree (never edit manually)

**Layout Files:**
- `src/routes/admin/route.tsx`: Admin shell (sidebar + topbar + canvas)
- `src/routes/portal.tsx`: Patient portal shell (renders `PortalShell`)
- `src/features/portal/PortalShell.tsx`: Actual portal layout component

**Core Data:**
- `src/lib/data/types.ts`: All TypeScript domain types
- `src/lib/data/index.ts`: Barrel export for all mock data
- `src/lib/seed-data.ts`: Practice KPIs, chart series, location fixtures
- `src/lib/marketing-content.ts`: Feature pages and blog content data

**Design System:**
- `src/components/ui/`: All shadcn/ui primitives
- `src/styles.css`: CSS custom properties (`--teal`, `--glass-stroke`, `--surface-glass`, etc.)
- `src/lib/utils.ts`: `cn()` helper (`clsx` + `tailwind-merge`)

**Supabase:**
- `src/lib/supabase.ts`: Client instance (requires `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`)

## Naming Conventions

**Files:**
- Route files: kebab-case matching the URL segment (`patients.$id.tsx`, `fit.clients.tsx`)
- Component files: PascalCase (`AppSidebar.tsx`, `PortalShell.tsx`)
- Hook files: camelCase with `use` prefix (`usePatients.ts`, `use-mobile.tsx`)
- Data files: lowercase noun (`patients.ts`, `encounters.ts`)

**Routes:**
- Layouts: `route.tsx` for directory-based, or the path segment file for non-directory layouts
- Dynamic segments: `$paramName` prefix (`patients.$id.tsx`, `blog.$slug.tsx`)
- Index routes: `.index.tsx` suffix (`patients.index.tsx`, `portal.index.tsx`)
- Nested via dots: `fit.clients.tsx` → `/admin/fit/clients` (TanStack Router dot notation)

**Components:**
- PascalCase always: `AppSidebar`, `DashboardCanvas`, `ViewToggle`
- Shell components (admin chrome): live in `src/components/shell/`
- Marketing components: live in `src/components/marketing/`
- Feature-scoped components: live inside `src/features/<feature>/`

## Where to Add New Code

**New admin route/page:**
1. Create `src/routes/admin/<name>.tsx` with `createFileRoute("/admin/<name>")({})`
2. Add to `AppSidebar.tsx` nav section (either `primarySections` or `extraSections`)
3. `routeTree.gen.ts` regenerates automatically on dev server restart

**New admin page with nested routes:**
1. Create `src/routes/admin/<name>.tsx` (passthrough: `component: () => <Outlet />`)
2. Create `src/routes/admin/<name>.index.tsx` for the index
3. Create `src/routes/admin/<name>.$id.tsx` for detail views

**New Arca Fit page:**
- Use dot notation: `src/routes/admin/fit.<pagename>.tsx` → maps to `/admin/fit/<pagename>`

**New portal sub-page:**
- Create `src/routes/portal.<pagename>.tsx`
- Add link to `NAV` array in `src/features/portal/PortalShell.tsx`

**New marketing page:**
- Create `src/routes/<name>.tsx` with Nav + Footer wrapping the content
- Import from `src/components/marketing/` for shared chrome
- Add link to `src/components/marketing/Nav.tsx`

**New domain data type:**
- Add interface to `src/lib/data/types.ts`
- Create `src/lib/data/<entity>.ts` with mock array
- Export from `src/lib/data/index.ts`
- Create `src/hooks/queries/use<Entity>.ts` following the pattern in `usePatients.ts`

**New shell widget (admin):**
- Add to `src/components/shell/` (general) or `src/components/shell/fit/` (Arca Fit specific)

**New visualization:**
- Add to `src/components/shell/viz/` for reusable chart components

**Utilities:**
- Generic helpers: `src/lib/utils.ts`
- Server-only config: `src/lib/config.server.ts`

## Special Directories

**`src/routeTree.gen.ts`:**
- Purpose: Auto-generated by TanStack Router CLI from `src/routes/` file tree
- Generated: Yes - regenerates on `tsr generate` or dev server start
- Committed: Yes (required for build)
- Rule: Never edit manually

**`src/components/ui/`:**
- Purpose: shadcn/ui component copies
- Generated: Partially (via shadcn CLI `npx shadcn-ui add`)
- Committed: Yes
- Rule: Extend by wrapping, not by editing the source files directly

**`.planning/codebase/`:**
- Purpose: GSD codebase map documents for Claude agents
- Generated: By `/gsd:map-codebase` commands
- Committed: Yes

**`src/features/`:**
- Purpose: Self-contained feature modules with their own components, data, and state
- Rule: Features should not import from each other. Shared code goes to `src/components/` or `src/lib/`

---

*Structure analysis: 2026-07-02*
