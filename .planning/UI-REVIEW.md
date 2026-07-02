# ArcaRX — UI/UX Audit

**Audited:** 2026-07-02
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md present)
**Screenshots:** Not captured (no dev server detected at audit time; code-only audit)
**Files audited:** 13 route/component files across admin and portal surfaces

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Visual Hierarchy | 3/4 | PageHeader creates strong page-level anchors; patient profile card lacks clear primary CTA differentiation |
| 2. Typography | 3/4 | Scale is well-constrained but micro-size proliferation (`text-[10px]`, `text-[11px]`) is excessive |
| 3. Color & Contrast | 2/4 | Hardcoded hex values for chart colors throughout; semantic token usage inconsistent across surfaces |
| 4. Spacing & Layout | 3/4 | Consistent `p-4 md:p-8` shell padding; arbitrary spacing in nested components breaks the scale |
| 5. Interaction Design | 1/4 | Buttons with no handlers across portal visits, messages Send, portal index "Join visit", patient Cancel/Pause; zero loading states on portal routes |
| 6. Consistency | 2/4 | Admin uses PageHeader; portal skips it entirely. Sidebar practice name shows "Apex Aesthetics Group" vs "ARCA Rx". Two unrelated component patterns for the same job. |

**Overall: 14/24**

---

## Top 3 Priority Fixes

1. **BLOCKER — Decorative buttons throughout the portal** — Patients click "Reschedule", "Cancel", "Notes", "Join visit", and the messages "Send" button and nothing happens. This fails every task-completion flow the portal exposes and destroys trust. Wire `onClick` handlers with at minimum an optimistic local state update or a toast "Coming soon" — every visible affordance must do something. Files: `portal.visits.tsx:60–61,94`, `portal.index.tsx:53`, `portal.messages.tsx:88`.

2. **WARNING — Hardcoded hex colors in Recharts and chart utilities should use CSS custom properties** — `dashboard.tsx:138` defines `PIE_COLORS = ["#a78bfa", "#fbbf24", "#94a3b8"]`; `patients.$id.tsx:274` hardcodes `"#a78bfa"` for diastolic BP line; `scribe.tsx:71` hardcodes three hex values in the sparkline color function. These bypass the token system — if the theme changes or a white-label customer needs different colors, every hex must be hunted down. Replace with `var(--chart-violet)`, `var(--chart-amber)`, `var(--chart-slate)` custom properties defined once in `styles.css`.

3. **WARNING — Sidebar footer shows wrong practice identity** — `AppSidebar.tsx:229` renders the footer subtitle as "Practice Admin · Apex Group" — a leftover from a previous project. The location switcher also imports from `seed-data.ts` (`practice.name` = "Apex Aesthetics Group") while every other surface says "ARCA Rx". This is a visible brand-integrity failure on every admin page. Fix: update `seed-data.ts:2` to `name: "ARCA Rx"` and correct the hardcoded footer string.

---

## Detailed Findings

### Pillar 1: Visual Hierarchy (3/4)

**What works well:**
- `PageHeader` component (`src/components/shell/PageHeader.tsx`) establishes a strong, consistent visual anchor. The eyebrow pill + 34px/44px `metric-numeral` heading creates unambiguous page identity on calendar, scribe, photo-reviews, and charts.
- Dashboard KPI grid (`dashboard.tsx:201–219`) correctly uses size, weight, and sparkline miniaturization to create three levels of scan-order: large numeral → delta badge → sparkline.
- Waiting Room card (`dashboard.tsx:48–116`) uses color-coded borders (emerald/amber/red) and status icons effectively to triage attention without overwhelming.
- Photo Reviews `DetailPanel` uses a sticky right rail with clear section hierarchy (header / compare slider / notes / action footer).

**Issues:**

- **WARNING** `dashboard.tsx` skips `PageHeader` and builds its own inline header (`flex flex-col gap-4`). The "Good morning." heading uses `text-3xl md:text-[34px]` but the eyebrow is a raw `<p>` not the pill component. This is inconsistent with every other admin page that uses `PageHeader` — two heading patterns exist for the same role. `dashboard.tsx:171–192`.

- **WARNING** In `patients.$id.tsx`, the left card has three CTAs: "Book visit" (gradient), "Charge / POS" (outline), and 10 tab buttons. With no visual separation between the CTA block and the tab row, the primary action is not obvious at a glance. The tab strip at `line 165` (`flex flex-wrap gap-1 border-b pb-2`) puts 10 equal-weight buttons immediately adjacent to action buttons. A visual divider or spacer between action block and tab strip would clarify the jump between "do something" and "navigate within record". `patients.$id.tsx:157–174`.

- **WARNING** `charts.tsx` is a stub. The left panel is a bare `<button>` list with no visual treatment (no status badges, no date prominence, no grouping). The "recent charts" list provides no scan hierarchy — all 20 entries render at identical visual weight. `charts.tsx:27–35`.

- **WARNING** Calendar week-view mode renders as a toggle (`viewMode` state at `calendar.tsx:43`) but the grid content never changes — the same day-view renders regardless of selection. The visual affordance (a segmented control) promises a behavior that does not exist. This creates hierarchy confusion: the user believes they are in a different mode. `calendar.tsx:82–84`.

---

### Pillar 2: Typography (3/4)

**Scale in use across audited files:**
- Micro labels: `text-[10px]`, `text-[11px]` (both)
- Body small: `text-xs` (12px), `text-sm` (14px)
- Body / card titles: `text-sm font-semibold`
- Page headings: `text-2xl`, `text-3xl`, `text-[34px]`, `text-[44px]` via `metric-numeral`
- Modal headings: `text-lg font-semibold` (`text-xl` once in `BookingModal.tsx:399`)

**What works well:**
- Two-size micro label system (`text-[10px] uppercase tracking-wider` for section eyebrows, `text-[11px]` for supporting data) is used consistently as a convention across admin routes.
- The `metric-numeral` utility correctly applies serif + tabular-nums to KPI values.
- `BookingModal.tsx` uses a clean `text-lg` heading per step, with `text-sm text-muted-foreground` sub-copy — correct hierarchy for a 2-column modal.

**Issues:**

- **WARNING** The micro-size proliferation is excessive. In practice the codebase has 8 distinct sizes in active use: `[10px]`, `[11px]`, `xs`, `sm`, `base` (rare), `lg`, `2xl`, `3xl/[34px]/[44px]`. The gap between `text-[10px]` and `text-[11px]` is 1px — these two sizes are visually indistinguishable and should collapse to a single `text-[10px]` convention. See `dashboard.tsx:55` (`text-[10px]` badge) vs `dashboard.tsx:108` (`text-[11px]` provider name) — no semantic difference justifies the split.

- **WARNING** Portal routes skip the `PageHeader` component, losing the `metric-numeral` 44px heading. `portal.visits.tsx:29` uses `text-2xl font-semibold tracking-tight` inline — fine, but inconsistent with admin at the same viewport. The portal and admin should share a heading convention even if visually styled differently.

- **WARNING** `patients.$id.tsx:213` — `OverviewTab` and several other tab components accept `{ patient, encounters, ... }: any`. `any` typed props on components with active rendering logic means TypeScript cannot catch rendering regressions. This is a convention deviation from the documented pattern (typed props). Not a visual failure per se, but it erodes the contract that keeps the typography system intentional.

- **MINOR** `BookingModal.tsx:399` uses `text-xl font-semibold` for "You're booked!" while every other step uses `text-lg`. The inconsistency is not meaningful enough to break the flow, but it is unintentional — the DoneStep was likely added separately. Align to `text-lg`.

---

### Pillar 3: Color & Contrast (2/4)

**Token usage analysis:**

The design system defines teal, navy, risk-low/med/high, data-pos/neg, and glass surface tokens via CSS variables. Usage across audited files mixes token-based and hardcoded approaches:

**Token-compliant usage (correct):**
- `text-[color:var(--teal)]` for accent text and links — consistent.
- `badge-risk-*`, `badge-active`, `delta-up/down` — semantic utilities used correctly.
- `gradient-brand` on all primary CTAs — consistent.
- Recharts tooltips use `var(--card)` and `var(--border)` — correct.

**Hardcoded hex violations:**

| File | Line | Value | Issue |
|------|------|-------|-------|
| `dashboard.tsx` | 137–138 | `#a78bfa`, `#fbbf24`, `#94a3b8` | PIE_COLORS array — chart colors outside token system |
| `dashboard.tsx` | 264 | `style={{ background: PIE_COLORS[i] }}` | Legend dots inherit same hardcoded values |
| `patients.$id.tsx` | 251 | `"#fbbf24"` | Biomarker sparkline degradation color |
| `patients.$id.tsx` | 274 | `"#a78bfa"` | Diastolic BP chart line |
| `patients.$id.tsx` | 471 | `"var(--success, #4ade80)"`, `"#f87171"`, `"#fbbf24"` | Lab result range dot — mixed token fallback + hex |
| `scribe.tsx` | 71 | `"#f87171"`, `"#fbbf24"`, `"#4ade80"` | Sparkline Spark component |

**Impact:** These violet and amber values (`#a78bfa`, `#fbbf24`) appear in 3 different files for unrelated purposes (membership tiers, chart lines, sparkline flags). If the brand shifts these accent hues or a dark-mode inversion is applied, these hardcoded values will not update. They should be `var(--chart-violet)`, `var(--chart-amber)`, `var(--chart-green)` defined in `styles.css`.

**Additional issues:**

- **WARNING** `AppSidebar.tsx:229` has the footer user role as "Practice Admin · Apex Group" — hardcoded string using a wrong practice name. Not a hex-color issue but a brand-color-adjacent problem (the app identity is wrong at the entry point of every admin session).

- **WARNING** `portal.messages.tsx:33` uses `color-mix(in_oklab,var(--teal)_12%,transparent)` for the active thread highlight. `portal.index.tsx:167` uses the same pattern for quick-action hover. This is Pattern B (verbose escape hatch) per the conventions doc, which notes Pattern A (semantic Tailwind classes) is preferred. The color-mix approach is correct in spirit but signals the token system is incomplete — there is no `bg-teal-muted` semantic class for low-opacity teal fills.

- **WARNING** `photo-reviews.tsx:50–57` defines `PROTOCOL_COLORS` with 7 different hue-coded badge styles (violet, pink, rose, emerald, blue, amber, muted). The protocol color system is ad-hoc and not derived from any token. Adding an eighth protocol would require an eighth color decision with no design token guidance.

---

### Pillar 4: Spacing & Layout (3/4)

**Shell padding:** All admin routes use `p-4 md:p-8` — consistent. Portal routes use the same pattern (`portal.index.tsx:22`, `portal.visits.tsx:24`). `portal.messages.tsx:20` uses `p-4 md:p-8` with a custom height calculation (`h-[calc(100vh-3.5rem-5rem)]`) for the split-pane layout — appropriate.

**Card content padding:** `p-4` and `p-5` are used across `CardContent` — a minor inconsistency but within acceptable variance. `patients.$id.tsx:105` uses `p-5` for the sidebar card; `dashboard.tsx:204` uses `p-4` for KPI cards. Not a visual problem.

**Grid system:** KPI grids use `grid-cols-2 gap-4 lg:grid-cols-4` consistently. Chart area uses `lg:grid-cols-3` with `lg:col-span-2` for the main chart — correct.

**Issues:**

- **WARNING** `patients.$id.tsx:464` — the lab results grid uses `grid-cols-[160px_1fr_80px_60px]` — a fixed-width arbitrary column layout. At narrow viewports, this will overflow the card since no responsive breakpoint adjusts the column sizes. The `min-w-[640px]` workaround on the calendar grid (`calendar.tsx:117`) is the explicit acknowledgement that horizontal overflow exists in the grid layout.

- **WARNING** `scribe.tsx:268` uses `lg:grid-cols-12` with `lg:col-span-4`, `lg:col-span-5`, `lg:col-span-3` — a 12-column grid is unusual in this codebase (everything else uses 2/3/4). The 3-panel scribe layout works but deviates from the system. On 1024–1280px viewport widths, the three panels compress to uncomfortable widths before the responsive fallback stacks them.

- **WARNING** `BookingModal.tsx:68` — `StepIndicator` uses `gap-0` between steps with manually sized `mx-3 h-px w-6` connector lines. The connector line is a fixed `w-6` — on narrow modal widths (mobile, where the modal fills the viewport), the step labels truncate but the connector lines stay at 24px, breaking the proportional alignment. No responsive adjustment exists.

- **MINOR** `portal.visits.tsx:44–47` — the date mini-block uses `h-12 w-12` with two lines of text at `text-[10px]` and `text-sm`. This is a unique spacing pattern not seen elsewhere in the portal — it is not a `Card` or `Badge` primitive but an inline `<div>`. It works visually but is a bespoke component that could be a reusable `DateChip` utility.

---

### Pillar 5: Interaction Design (1/4)

This is the most critical failing surface. The CONCERNS.md already catalogues many of these, but the UX impact must be scored against the rendered UI.

**BLOCKER — Portal visits buttons with no handlers:**
`portal.visits.tsx:60–61` — both "Reschedule" and "Cancel" on every upcoming visit card render without `onClick`. The "Join" button (`line 63`) for video visits has no telehealth URL either. A patient navigating to their visit list sees three actionable buttons per card and none of them work.

**BLOCKER — Portal messages Send button:**
`portal.messages.tsx:88` — `<Button disabled={!draft.trim()}>` enables when text is typed but has no `onClick`. The user types a message, the button enables, they click it, nothing happens. The draft is not cleared. The message is not appended to the thread. This is a complete task failure at the most trust-sensitive interaction in a clinical portal.

**BLOCKER — Portal home "Join visit":**
`portal.index.tsx:53` — the hero CTA on the portal home is a gradient `<Button>` with the `<Video>` icon and label "Join visit." No `onClick`, no `href`. The most prominent CTA on the entire portal entry screen is decorative.

**BLOCKER — Patient "Cancel" membership action:**
`patients.$id.tsx:692` — `<Button className="text-red-400 ...">Cancel</Button>` — no `onClick`, no confirmation dialog. A destructive membership action with no guard and no handler.

**BLOCKER — Patient "Pause membership":**
`patients.$id.tsx:691` — same: no handler. Two adjacent destructive actions with no confirmation and no wiring.

**WARNING — Dashboard "New appointment" and "Chart" buttons:**
`dashboard.tsx:190` — "New appointment" (gradient CTA) has no `onClick`. `dashboard.tsx:300` — every row in Today's schedule has a "Chart" ghost button with no handler. Same in `calendar.tsx:203`.

**WARNING — Calendar navigation:**
`calendar.tsx:88,90` — `ChevronLeft` and `ChevronRight` date navigation buttons render via shadcn `<Button variant="outline">` with no `onClick`. A user cannot navigate to a past or future date. The "Today" button (`line 89`) similarly has no handler.

**WARNING — Zero loading states on portal routes:**
`portal.visits.tsx`, `portal.index.tsx`, `portal.messages.tsx` — all three import directly from `mockData.ts` with no React Query hooks. There are no loading skeletons, no error boundaries for failed fetches, no empty states tied to async state. When Supabase is wired, these will render blank until the hook resolves — there is no skeleton infrastructure to fall back on. The admin routes do this correctly with `Skeleton` components keyed to `isLoading`.

**WARNING — "Approve" in photo-reviews updates local component state only:**
`photo-reviews.tsx:221–223` — `approve(id)` calls `setSets(...)` which mutates the local array. The approval does not persist — a page refresh reverts all approvals. The UX shows a green "Approved by" banner that implies persistence but there is none.

**WARNING — Scribe "Push to chart" button:**
`scribe.tsx:182–185` — clicking "Push to chart" sets `pushed = true` and shows a green badge ("Encounter draft saved to chart"). Nothing is actually saved. The SOAP note, orders, and differential disappear on page navigation. The success confirmation is false.

**WARNING — "Regenerate" SOAP button:**
`scribe.tsx:307` — `<Button variant="ghost" size="sm">Regenerate</Button>` has no `onClick`. A provider who wants to regenerate the SOAP note after correcting the transcript is stuck.

**MINOR — BookingModal confirmation step shows hardcoded location:**
`BookingModal.tsx:365` — the "Austin Flagship · 123 Main St" address is hardcoded for all in-person appointments regardless of which provider or location was displayed during selection. A patient who books at a Dallas location will see Austin Flagship on their confirmation. `DoneStep` at `line 415` repeats the same hardcoded string.

---

### Pillar 6: Consistency (2/4)

**Inconsistencies found:**

**BLOCKER — Sidebar practice name is wrong:**
`AppSidebar.tsx:169` — location switcher renders `{activeLoc.name}` where `activeLoc` comes from `practice.locations` in `seed-data.ts`. `seed-data.ts:2` has `name: "Apex Aesthetics Group"` — a copy-pasted placeholder from a previous project. The footer at `AppSidebar.tsx:229` hardcodes "Apex Group". Every admin session opens with the wrong practice identity. Fix: `seed-data.ts` practice name → "ARCA Rx", footer subtitle → "Practice Admin · ARCA Rx".

**WARNING — PageHeader used inconsistently:**
Admin routes using PageHeader: `calendar.tsx`, `scribe.tsx`, `photo-reviews.tsx`, `charts.tsx`. Admin routes NOT using PageHeader: `dashboard.tsx` (custom inline header), `patients.$id.tsx` (no page-level header at all — profile card doubles as the heading). Portal routes: none use PageHeader; `portal.visits.tsx:28` and `portal.index.tsx:28` build inline heading blocks. The result is three distinct heading patterns across the product.

**WARNING — Two heading type scales for the same role:**
- Dashboard: `text-3xl md:text-[34px] font-semibold tracking-tight` (dashboard.tsx:175)
- PageHeader pages: `metric-numeral text-[34px] md:text-[44px]` (PageHeader.tsx:25)
- Portal: `text-2xl font-semibold tracking-tight` (portal.visits.tsx:29)

Three heading treatments for the same "page title" role across one product. Admin dashboard and admin PageHeader pages are already inconsistent with each other.

**WARNING — Provider name truncation inconsistency:**
In the dashboard schedule (`dashboard.tsx:77`), provider names are shown via `prov?.name?.replace("Dr. ", "")` to strip the title. In the calendar list view (`calendar.tsx:193`), the full name with title is shown via `prov?.name`. In the patient profile encounters tab (`patients.$id.tsx:323`), `prov?.name` is shown in full. Same data, three different display formats.

**WARNING — Status badge pattern diverges between admin and portal:**
Admin uses `badge-risk-*` utilities and `statusStyle` record objects with inline `bg-color/10 text-color border-color/20` patterns. Portal uses inline conditional class strings. Neither uses a shared `<StatusBadge>` component. Every new status value must be styled in every file that renders it.

**WARNING — Portal "Book visit" CTA goes to three different places:**
- `portal.index.tsx:160` — "Book visit" quick action links to `/portal/visits` (navigation, no modal)
- `portal.visits.tsx:31` — "Book visit" opens `BookingModal` (modal)
- `portal.index.tsx:53` — "Join visit" has no handler (does nothing)

The booking entry point is inconsistent: sometimes it opens a modal, sometimes it navigates. These should be the same affordance.

**MINOR — Icon for the same concept varies:**
`Stethoscope` is used for both "Charts / EMR" and "Protocols" in `AppSidebar.tsx:37,38`. Both items render with identical icons in the nav, making them visually indistinguishable in collapsed sidebar state.

---

## Files Audited

**Admin routes:**
- `/Users/omni/Desktop/ArcaRX/src/routes/admin/dashboard.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/admin/patients.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/admin/patients.$id.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/admin/photo-reviews.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/admin/calendar.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/admin/scribe.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/admin/charts.tsx`

**Portal routes:**
- `/Users/omni/Desktop/ArcaRX/src/routes/portal.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/portal.visits.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/portal.index.tsx`
- `/Users/omni/Desktop/ArcaRX/src/routes/portal.messages.tsx`

**Components:**
- `/Users/omni/Desktop/ArcaRX/src/components/shell/AppSidebar.tsx`
- `/Users/omni/Desktop/ArcaRX/src/components/portal/BookingModal.tsx`
- `/Users/omni/Desktop/ArcaRX/src/components/shell/PageHeader.tsx`

**Reference:**
- `/Users/omni/Desktop/ArcaRX/.planning/codebase/ARCHITECTURE.md`
- `/Users/omni/Desktop/ArcaRX/.planning/codebase/CONCERNS.md`
- `/Users/omni/Desktop/ArcaRX/.planning/codebase/CONVENTIONS.md`
