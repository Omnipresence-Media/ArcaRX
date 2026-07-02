# Coding Conventions

**Analysis Date:** 2026-07-02

## Naming Patterns

**Files:**
- Route files use TanStack file-route convention with dot-notation for nested paths: `portal.visits.tsx`, `admin/patients.$id.tsx`, `admin/fit.clients.index.tsx`
- Component files use PascalCase: `AppSidebar.tsx`, `PageHeader.tsx`, `TreatmentPanel.tsx`
- Hook files use camelCase with `use` prefix: `usePatients.ts`, `useAppointments.ts`
- Data/utility files use camelCase: `seed-data.ts`, `marketing-content.ts`, `fit-seed.ts`
- Type-only files: `types.ts` inside data subdirectory

**Functions/Components:**
- All React components are named function declarations (not arrow functions at top level): `function Dashboard()`, `function PatientsPage()`
- Sub-components within a route file are defined as named functions above the main page component: `function WaitingRoom(...)`, `function Sparkline(...)`
- Helper/utility functions are camelCase: `waitMinutes`, `modalityIcon`, `riskBadge`, `memberBadge`
- Lookup map constants use SCREAMING_SNAKE_CASE: `CHECKIN_TIMES`, `FILTERS`, `PIE_COLORS`, `TRACK_META`

**Variables:**
- camelCase throughout: `selectedLocation`, `todaySchedule`, `patientsLoading`
- Destructured query results always alias loading states: `isLoading: patientsLoading`, `isLoading: statsLoading`

**Types:**
- Domain types and interfaces in `src/lib/data/types.ts`
- Union string types are preferred over enums: `type RiskLevel = "high" | "med" | "low"`
- Inline prop type objects used for simple components: `{ schedule: any[] }`, `{ eyebrow?: string; title: string }`
- Exported interfaces for data shapes: `Patient`, `Provider`, `Appointment`, `Encounter`

## Code Style

**Formatting:**
- Prettier (v3.7.3) configured via `eslint-plugin-prettier`
- No standalone `.prettierrc` file found — Prettier runs with defaults through ESLint integration
- Run: `bun run format` (calls `prettier --write .`)

**Linting:**
- ESLint v9 flat config at `eslint.config.js`
- TypeScript-ESLint strict config enabled
- `@typescript-eslint/no-unused-vars` is turned **off** — unused vars are allowed
- `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps` enforced
- `react-refresh/only-export-components` set to warn

**TypeScript:**
- `strict: true` in `tsconfig.json`
- `noUnusedLocals: false`, `noUnusedParameters: false` — loose on dead code
- `any` is used in places as an escape hatch: `schedule: any[]` in `dashboard.tsx`, `OverviewTab({ patient, encounters, ... }: any)` in `patients.$id.tsx`
- Domain types in `src/lib/data/types.ts` are well-typed; route-level component props are sometimes lazily typed with `any`

## Import Organization

**Order (observed across files):**
1. Framework imports — `@tanstack/react-router`, `react`
2. UI component imports — `@/components/ui/card`, `@/components/ui/button`
3. Shell component imports — `@/components/shell/...`
4. Domain hook imports — `@/hooks/queries/usePatients`
5. Data/lib imports — `@/lib/data`, `@/lib/seed-data`
6. Lucide icon imports (grouped, often last among imports)

**Path Aliases:**
- `@/` maps to `src/` (configured in `tsconfig.json` and `components.json`)
- Specific aliases: `@/components`, `@/lib`, `@/hooks`
- No relative path imports observed in route or component files — all use `@/`

## Tailwind v4 + CSS Variables Approach

**System:** Tailwind v4 with `@theme inline` — design tokens are CSS custom properties, not Tailwind config values.

**Token referencing — two patterns exist (inconsistency):**

Pattern A (preferred): Use Tailwind semantic token class names directly:
```tsx
<p className="text-muted-foreground">
<div className="bg-card">
<Badge className="text-emerald-400 border-emerald-500/20">
```

Pattern B (verbose escape hatch): Use `[color:var(--token)]` syntax for brand tokens not in the Tailwind color palette:
```tsx
<p className="text-[color:var(--teal)]">
<div className="border-[color:var(--glass-stroke-strong)]">
```

**Custom `@utility` classes (defined in `src/styles.css`, use like regular Tailwind classes):**
- `surface-elevated` — glassmorphism card surface with blur + box-shadow
- `gradient-brand` — navy-to-teal gradient (primary CTA buttons)
- `glass-panel`, `glass-panel-raised`, `glass-panel-quiet` — tiered glass surface variants
- `badge-active`, `badge-risk-high`, `badge-risk-med`, `badge-risk-low` — semantic status badge styles
- `metric-numeral` — serif font + tabular numerals for dashboard KPIs
- `bloom-bg`, `grid-bg` — decorative background utilities
- `delta-up`, `delta-down` — semantic color for positive/negative data

**Brand color tokens:**
- `--teal`: primary accent (oklch-based)
- `--navy`: primary background/dark surfaces
- `--risk-low`, `--risk-med`, `--risk-high`: patient risk semantic colors
- `--data-pos`, `--data-neg`, `--data-neutral`: chart/metric semantic colors
- All glass surface tokens: `--surface-glass`, `--glass-stroke`, `--shadow-glass`, etc.

**Typography sizes:**
- Micro labels: `text-[10px]` with `uppercase tracking-wider` or `tracking-[0.14em]`
- Body small: `text-xs` (12px), `text-sm` (14px)
- Page headings: `text-2xl`, `text-3xl`, or `text-[34px]`/`text-[44px]` with `font-semibold tracking-tight`
- KPI numerals: `metric-numeral` utility class

## Reusable Component Patterns

**PageHeader** (`src/components/shell/PageHeader.tsx`):
The standard pattern for page-level headers. Accepts `eyebrow`, `title`, `description`, `actions`. Used in `patients.index.tsx` and other admin pages. Use this for all new admin pages.
```tsx
<PageHeader
  eyebrow="Section label"
  title="Page Title"
  description="Supporting copy."
  actions={<Button ...>Action</Button>}
/>
```

**Stat card grid:**
Consistent pattern across dashboard and patients pages — grid of `Card + CardContent` with a label, skeleton-while-loading, and a formatted value:
```tsx
<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
  {statCards.map((s) => (
    <Card key={s.label} className="surface-elevated">
      <CardContent className="p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
        {s.value === null
          ? <Skeleton className="mt-2 h-7 w-20" />
          : <p className="mt-1.5 text-2xl font-semibold tabular-nums">{s.value}</p>
        }
      </CardContent>
    </Card>
  ))}
</div>
```

**Loading skeleton pattern:**
When `isLoading` is true, render `<Skeleton className="h-N w-N" />` in place of content. Never conditionally hide the whole section — always show the skeleton at the same size as the real content.

**Empty state pattern:**
```tsx
<div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
  <AlertCircle className="h-8 w-8 opacity-40" />
  <p className="text-sm">No items found.</p>
</div>
```

**CTA Button pattern:**
Primary actions always use `gradient-brand text-white`:
```tsx
<Button size="sm" className="h-9 gradient-brand text-white">
  <Plus className="mr-1.5 h-4 w-4" />Label
</Button>
```

**Status/risk badge pattern:**
Use `badge-risk-*` utilities from `src/styles.css`:
```tsx
<Badge variant="outline" className={riskBadge(patient.risk)}>{patient.risk}</Badge>
// where riskBadge = (r) => r === "high" ? "badge-risk-high" : r === "med" ? "badge-risk-med" : "badge-risk-low"
```

**Section label pattern:**
Micro-uppercase labels above content sections:
```tsx
<p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Section · {count}</p>
```

**Data hooks:**
All data access goes through `@/hooks/queries/` hooks that wrap `@tanstack/react-query`. Each hook simulates async latency with a `sleep(120)`. Never import from `@/lib/data` directly in route/component files — always use a hook.

## Module Design

**Exports:**
- UI primitives (`src/components/ui/`) use named exports, no default exports
- Route files export `Route` (TanStack convention) as named export; page component is not exported
- Shared shell components use named exports: `export function PageHeader()`
- Hooks export named functions: `export function usePatients()`

**Barrel Files:**
- `src/lib/data/index.ts` or similar barrel not confirmed — imports appear to go to specific files like `@/lib/data/types`, `@/lib/data/locations`, `@/lib/data/providers`
- `src/lib/seed-data` is a single flat file with multiple named exports

## Comments

**Inline comments:** Used sparingly for non-obvious sections: `{/* Arca Extra - collapsible addon section */}`
- No JSDoc/TSDoc anywhere in app code (only auto-generated shadcn primitives use types inline)
- No `// TODO` or `// FIXME` comments exist in the codebase

---

*Convention analysis: 2026-07-02*
