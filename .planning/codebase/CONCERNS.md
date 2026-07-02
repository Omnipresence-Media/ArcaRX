# Codebase Concerns

**Analysis Date:** 2026-07-02

---

## 1. Security Concerns

### [CRITICAL] No Authentication System Anywhere

**Risk:** Every route — admin and portal — is publicly accessible with no auth gate.
**Files:** `src/routes/admin/route.tsx`, `src/routes/portal.tsx`, `src/routes/__root.tsx`
**Detail:** The admin layout (`src/routes/admin/route.tsx:10`) has no `beforeLoad`, `loader`, or auth check. Any user who types `/admin/dashboard` is inside the practice management system. The patient portal (`src/routes/portal.tsx`) is similarly wide open. The `__root.tsx` has no session provider or redirect logic. Supabase Auth is installed but never called.
**Fix approach:** Add a Supabase Auth session check in `beforeLoad` on both `/admin` and `/portal` route guards. Redirect unauthenticated users to a login route. Create `src/routes/login.tsx`.

### [CRITICAL] Supabase Client Exists but Is Never Used

**Risk:** The app ships a Supabase client (`src/lib/supabase.ts`) that is imported by zero files in `src/`. The entire data layer uses in-memory TypeScript arrays. Any Supabase RLS policies written for production have not been tested in the app because the app never calls Supabase.
**Files:** `src/lib/supabase.ts` (defined but never imported), all `src/hooks/queries/use*.ts` files
**Detail:** Every query hook (`usePatients`, `useAppointments`, `useLabs`, etc.) calls `await sleep(120)` then returns from a local array. Supabase Row Level Security policies do not exist — there are no SQL migrations in the repo.
**Fix approach:** Replace each hook's `queryFn` body with `supabase.from('patients').select(...)` calls. Write migrations.

### [HIGH] Hardcoded PHI in Source Code

**Risk:** Real-looking patient names, DOBs, phone numbers, emails, MRNs, insurance IDs, and medical data (allergies, diagnoses) are committed to source as TypeScript constants.
**Files:** `src/lib/data/patients.ts` (20 patients), `src/features/portal/mockData.ts` (full patient record), `src/lib/seed-data.ts`
**Detail:** Even though these are fictional, any future copy-paste into a real deployment could inadvertently expose template data. More critically, the production path is unclear: when the DB is wired, this seed data could be accidentally seeded into a live database.
**Fix approach:** Move all seed data into a `scripts/seed.ts` file that is explicitly excluded from production builds. Never import from `src/lib/data/*` or `src/lib/seed-data.ts` in components — use query hooks only.

---

## 2. Broken / Non-Functional Features

### [HIGH] Booking Modal Completes with a `setTimeout` Fake

**Risk:** The entire booking flow shows a confirmation screen after a 1.2-second fake delay. No appointment is created anywhere.
**Files:** `src/components/portal/BookingModal.tsx:439–441`
**Detail:**
```tsx
function handleConfirm() {
  setLoading(true);
  setTimeout(() => { setLoading(false); setStep("done"); }, 1200);
}
```
The confirmation screen (`DoneStep`) shows "You're booked!" but nothing is persisted. The admin calendar will not reflect this booking.
**Fix approach:** Replace `setTimeout` with a `createServerFn` or Supabase insert. Post-confirm, invalidate the appointments query cache.

### [HIGH] Portal Messages Send Button Does Nothing

**Risk:** Users can type a message and click "Send" — the message is never appended to the thread, never persisted, never delivered.
**Files:** `src/routes/portal.messages.tsx:84–91`
**Detail:** The `Send` button has `disabled={!draft.trim()}` but no `onClick` handler. The `Input` updates `draft` state but there is no `handleSend` function wired anywhere.
**Fix approach:** Add an `onSend` handler that appends to the local thread state as an optimistic update, then calls a Supabase insert.

### [HIGH] Admin Messages "Reply to client" Input Is Unwired

**Risk:** Same gap on the admin side — the reply input is a raw `<input>` with only a placeholder.
**Files:** `src/routes/admin/fit.clients.$id.tsx:208`
**Detail:** `<input placeholder="Reply to client…" className="..." />` — no state binding, no send button, no handler.

### [HIGH] All "Reschedule" and "Cancel" Buttons on Portal Visits Are Decorative

**Risk:** Patients can see these buttons but clicking them has zero effect — no modal, no confirmation, no mutation.
**Files:** `src/routes/portal.visits.tsx:60–61`
**Detail:**
```tsx
<Button variant="outline" size="sm">Reschedule</Button>
<Button variant="outline" size="sm">Cancel</Button>
```
Neither has an `onClick`. "Join" button for telehealth visits is also missing a link/handler.

### [HIGH] "Join visit" Button on Portal Home Has No Telehealth URL

**Risk:** The hero card on the patient portal dashboard shows "Join visit" with a gradient CTA — clicking it does nothing because there is no `onClick` or `href`.
**Files:** `src/routes/portal.index.tsx:53`

### [HIGH] Portal "Notes" Button on Past Visits Is Decorative

**Risk:** The "Notes" button on each past visit card renders a `FileText` icon but has no handler, no modal, and no encounter notes are loaded.
**Files:** `src/routes/portal.visits.tsx:94–96`

### [HIGH] Medication Checkboxes Are Read-Only

**Risk:** On both `/portal` home and `/portal/meds`, the taken/not-taken medication status is hardcoded in `mockData.ts` and renders as a static icon. Patients cannot log that they took a medication.
**Files:** `src/routes/portal.meds.tsx:44–50`, `src/routes/portal.index.tsx:75–84`
**Detail:** `takenToday` is a static boolean on each `Medication` object with no setter.

### [HIGH] "Log weight" and "Upload" (Progress Photos) Do Nothing

**Risk:** Key engagement features on the progress page are entirely non-functional buttons.
**Files:** `src/routes/portal.progress.tsx:85` ("Log weight"), line 85 ("Upload" photo button)
**Detail:** Both buttons render with `variant="outline"` and no `onClick`.

### [MEDIUM] Admin "Chart" Buttons on Dashboard and Calendar Are Non-Functional

**Risk:** Each appointment row in the schedule has a "Chart" ghost button that does nothing.
**Files:** `src/routes/admin/dashboard.tsx:300`, `src/routes/admin/calendar.tsx`
**Detail:** These should open the patient's chart. Currently render as `<Button size="sm" variant="ghost">Chart</Button>` with no navigation or modal.

### [MEDIUM] Admin "New appointment" Button Does Nothing

**Files:** `src/routes/admin/dashboard.tsx:190`, `src/routes/admin/calendar.tsx`
**Detail:** `<Button size="sm" className="gradient-brand text-white">New appointment</Button>` — no `onClick`, no booking modal wired on the admin side.

### [MEDIUM] Admin Calendar "Book" Hover and Week-View Mode Are Decorative

**Files:** `src/routes/admin/calendar.tsx`
**Detail:** The week-view toggle renders `viewMode` state but the grid always shows today's data regardless of selected mode. The hover "Book" button on empty calendar cells has no handler.

### [MEDIUM] Portal Notification Bell Has No Functionality

**Files:** `src/features/portal/PortalShell.tsx:97–100`
**Detail:** The bell button with its red dot indicator renders but has no `onClick`. No notification drawer or panel exists.

### [MEDIUM] Portal Billing "Manage plan" and "Update" (Insurance) Buttons Are Decorative

**Files:** `src/routes/portal.billing.tsx`
**Detail:** `<Button variant="outline">Manage plan</Button>` and `<Button variant="ghost">Update</Button>` (insurance section) have no handlers.

### [MEDIUM] Portal Account "Edit" and "Logout" Buttons Are Non-Functional

**Files:** `src/routes/portal.account.tsx`
**Detail:** Edit profile, update insurance, and the logout button all render without `onClick` handlers.

### [MEDIUM] OnboardingChecklist Is Static

**Files:** `src/components/shell/OnboardingChecklist.tsx`, `src/lib/seed-data.ts`
**Detail:** Checklist items have `done: boolean` hardcoded in seed data. Clicking a task item does nothing — no mutation, no state toggle.

### [MEDIUM] Admin Products "Edit" and "Analytics" Buttons Are Non-Functional

**Files:** `src/routes/admin/products.tsx`
**Detail:** Every product card has `<Button>Edit</Button>` and `<Button>Analytics</Button>` with no `onClick`.

### [MEDIUM] Admin Protocols "+ New Protocol" and Edit Flows Missing

**Files:** `src/routes/admin/protocols.tsx`
**Detail:** "+ New protocol" button has no handler. Protocol cards have no edit/view actions.

### [LOW] Shop "Shop the stack" Bundle CTA Does Nothing

**Files:** `src/routes/portal.shop.index.tsx`
**Detail:** The hero banner "Shop the stack" button renders without a navigation target or `onClick`.

---

## 3. Data Layer Gaps

### [CRITICAL] Two Parallel Patient Datasets with No Relationship

**Risk:** The app has two entirely separate patient records for the same fictional patients, using different ID schemes, which will create confusion when wiring real data.
**Files:**
- `src/lib/data/patients.ts` — 20 patients, IDs `pat-1` through `pat-20`, used by `usePatients` hooks and all admin routes
- `src/lib/seed-data.ts` — 6 patients, IDs `u1` through `u6`, used by `CommandPalette`, `AppSidebar`, `TopBar`, dashboard charts
**Detail:** `src/routes/admin/dashboard.tsx:16` imports both `revenueSeries` from `seed-data` AND `usePatients` from the `lib/data` layer. The KPI "Active Members" is computed from `lib/data` patients but the revenue/MRR charts use entirely different `seed-data` arrays. These will diverge and produce nonsensical metrics.
**Fix approach:** Delete `seed-data.ts` patient/provider arrays. Derive all metrics from `lib/data` (then from Supabase).

### [HIGH] Three Separate Provider Arrays

**Files:**
- `src/lib/data/providers.ts` — IDs `prov-1` through `prov-5`, used by admin patient and appointment screens
- `src/lib/seed-data.ts` — IDs `p1` through `p6`, used by sidebar, command palette, coach performance
- `src/lib/fit-seed.ts` — fitness-specific trainer/coach records
**Detail:** Provider names differ between datasets (e.g. "Dr. Lena Chen" in portal mockData vs "Dr. Amelia Chen, MD" in seed-data). Any joined display of provider + patient data across the two layers will show mismatched names.

### [HIGH] Portal Data Entirely Separate from Admin Data

**Risk:** The portal (`src/features/portal/mockData.ts`) uses a hardcoded single patient ("Eliana Ruiz") that is not looked up from the admin `lib/data/patients.ts` array. The portal cannot be made multi-patient without a full rewrite of its data layer.
**Files:** `src/features/portal/PortalShell.tsx:8` imports `{ patient }` from `./mockData` — a singleton object.

### [HIGH] All Query Hooks Simulate Latency with `sleep()` and Return Local Arrays

**Files:** `src/hooks/queries/usePatients.ts`, `useAppointments.ts`, `useEncounters.ts`, `useLabs.ts`, `usePrescriptions.ts`, `useInvoices.ts`, `useAudit.ts`
**Detail:** Every hook has a pattern like:
```ts
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
queryFn: async () => { await sleep(120); return localArray; }
```
These look like real async queries but are pure in-memory returns. Supabase must replace the body of each `queryFn`.

### [MEDIUM] Appointment Data Uses a Different `getTodayAppointments` Date Filter That Always Returns the Same Records

**Files:** `src/lib/data/appointments.ts`, `src/hooks/queries/useAppointments.ts`
**Detail:** `getTodayAppointments()` filters by a hardcoded date string. As the real date moves past the mock appointment dates, the calendar and waiting room will show empty states.

### [MEDIUM] Shop Cart Does Not Persist Across Sessions

**Files:** `src/features/portal/cart.ts`
**Detail:** The cart is a module-level variable (`let cart: CartLine[] = []`). It resets on every page reload/refresh. No `localStorage` or Supabase persistence is wired.

### [MEDIUM] `example.functions.ts` Is Unused Boilerplate

**Files:** `src/lib/api/example.functions.ts`
**Detail:** Contains only a `getGreeting` server function used as a template example. Not called anywhere in the app. Can be deleted or replaced with real server functions.

---

## 4. Missing Features

### [CRITICAL] No Login / Auth Flow

No login page, no password reset, no magic link. Users accessing the app go directly to the marketing homepage. Navigating to `/admin/dashboard` or `/portal` works without credentials.

### [HIGH] No Patient Portal Login / Identity

The portal always shows a single hardcoded patient (`Eliana Ruiz`). There is no way to log in as a different patient. Multi-tenant portal functionality is absent.

### [HIGH] No Real Appointment Booking (Write Path)

The BookingModal completes a multi-step wizard but fakes the final write. No appointment is ever created in any data store. The calendar will not reflect portal bookings.

### [HIGH] No Prescription Refill Request Flow

The `/portal/meds` page shows medications and refill status but the "Request refill" action in the FAB navigates to `/portal/meds` without any form or submission capability.

### [HIGH] No Lab Result Delivery Flow

Labs are hardcoded in `mockData.ts`. No mechanism exists to receive lab results from an external lab system (e.g., LabCorp webhook) or for a provider to manually upload results.

### [MEDIUM] No Real Telehealth Integration

"Join visit" buttons exist but no video provider (Twilio, Daily.co, etc.) is integrated. Telehealth links are never generated.

### [MEDIUM] No Payment Processing

The portal billing page shows a credit card on file and invoices, but no Stripe (or other) integration exists. "Manage plan" and card management are non-functional.

### [MEDIUM] Admin Scribe Feature Has No AI Backend

`src/routes/admin/scribe.tsx` has a polished UI with a microphone button, transcript display, and SOAP note generation — but all content is static seed data. No Whisper/audio transcription or GPT summarization is wired.

### [MEDIUM] Admin AI Insights / "Sparkles" Buttons Are Decorative

Multiple Sparkles icon buttons appear throughout the admin UI (patient profile, scribe, fit overview) but none call any AI endpoint.

### [MEDIUM] No Email / SMS Delivery

`src/routes/admin/email-sms.tsx` exists as a route but message templates are static. No Twilio, SendGrid, or similar integration is wired. The booking confirmation ("A confirmation link will be sent to your email") never triggers.

### [LOW] Marketing Pages /customers, /partners, /demo, /about Are Stubs

**Files:** `src/routes/customers.tsx`, `src/routes/partners.tsx`, `src/routes/demo.tsx`, `src/routes/about.tsx`
**Detail:** All four render `<StubPage>` with a generic headline, subtitle, and a "Start Free Trial" link pointing to `/admin/dashboard`. No real content.

### [LOW] /blog and /features Routes Have No Real Content

**Files:** `src/routes/blog.tsx`, `src/routes/blog.$slug.tsx`, `src/routes/features.tsx`, `src/routes/features.$slug.tsx`
**Detail:** Render marketing layout shells but content is placeholder-level.

---

## 5. UI/UX Issues

### [HIGH] Portal Home Greeting Date Is Hardcoded

**Files:** `src/routes/portal.index.tsx:26`
**Detail:**
```tsx
<p className="text-[10px]...">Monday, June 8</p>
```
This is a literal string, not `new Date()`. The date shown will always read "Monday, June 8" regardless of the current date.

### [HIGH] Dashboard KPI Revenue Is Hardcoded

**Files:** `src/routes/admin/dashboard.tsx:156`
**Detail:**
```tsx
value: patientsLoading ? null : `$${(4280).toLocaleString()}`
```
The value `4280` is a literal number inside a ternary that appears to be dynamic. The comment/intent is to compute this from completed appointments, but the hardcoded value overrides the intent and will never change.

### [MEDIUM] Admin "Month" Navigation Arrows on Calendar Are Non-Functional

**Files:** `src/routes/admin/calendar.tsx`
**Detail:** The `<ChevronLeft>` and `<ChevronRight>` navigation buttons for date traversal have no `onClick` handlers — clicking them does nothing.

### [MEDIUM] Practice Name Is "Apex Aesthetics Group" in Seed-Data but "ARCA Rx" Everywhere Else

**Files:** `src/lib/seed-data.ts:2` (`name: "Apex Aesthetics Group"`), `src/components/shell/AppSidebar.tsx` (imports `practice.name` from seed-data)
**Detail:** The sidebar renders "Apex Aesthetics Group" as the practice name instead of "ARCA Rx". This is a leftover copy-paste from a previous project context.

### [MEDIUM] Location Confirmation in Booking Modal Shows Hardcoded "Austin Flagship · 123 Main St"

**Files:** `src/components/portal/BookingModal.tsx:365`
**Detail:** In-person appointment confirmation always shows "Austin Flagship · 123 Main St" regardless of which location was selected or which provider was chosen.

### [MEDIUM] Portal Mobile Tab Bar Shows Only 5 of 9 Nav Items

**Files:** `src/features/portal/PortalShell.tsx:144`
**Detail:** `NAV.slice(0, 5)` — Messages, Progress, Billing, and Account are inaccessible from mobile bottom nav. Users must use the desktop sidebar or manually navigate. No "More" tab exists.

### [MEDIUM] Admin Calendar Shows All Providers Regardless of Their Location

**Files:** `src/routes/admin/calendar.tsx`
**Detail:** `providers.filter(p => p.locationId === selectedLocation).slice(0, 4)` — the `providers` in `lib/data/providers.ts` have `locationId` values, but the `providers` in `lib/seed-data.ts` do not. The calendar imports from `lib/data` but the dashboard sidebar imports from `seed-data`. The two lists are inconsistent.

### [LOW] Progress Photo Comparison Uses a CSS Slider That Has No Functional State Change

**Files:** `src/routes/portal.progress.tsx`
**Detail:** The slider (`useState(50)`) renders a visual split between two photo sessions but the photo "images" are gradient placeholder divs — no real images. The upload button exists but is non-functional.

### [LOW] Check-in Form on Progress Page Is Missing

**Files:** `src/routes/portal.progress.tsx`
**Detail:** A "Log check-in" quick action exists in the FAB and portal home, pointing to `/portal/progress`, but the progress page has no check-in input form. The `checkIns` array in `mockData.ts` is static.

### [LOW] Admin Locations Page Shows Hardcoded Data from `seed-data.practice.locations` not `lib/data/locations.ts`

**Files:** `src/routes/admin/locations.tsx:5`
**Detail:** Imports from `seed-data` (`practice.locations` with IDs `atx`, `dal`, `nsh`) while all appointment/patient data uses `lib/data/locations.ts` (IDs `loc-atx`, `loc-dal`, `loc-nsh`). The two datasets are inconsistent.

---

## 6. Dead Code / Unused Files

### [MEDIUM] `src/lib/api/example.functions.ts`

An example TanStack Start server function (`getGreeting`). Not imported anywhere in the app. Dead boilerplate that should be removed or replaced with real server functions.

### [MEDIUM] `src/lib/lovable-error-reporting.ts` and `src/lib/error-capture.ts`

Lovable platform-specific error reporters. `reportLovableError` is called in `__root.tsx` but the Lovable integration may not be relevant for production deployment. These files should be reviewed and replaced with a real error tracking solution (Sentry, etc.).

### [MEDIUM] `src/lib/error-page.ts`

Appears to exist alongside `src/routes/__root.tsx`'s inline `ErrorComponent`. Potential overlap — verify whether `error-page.ts` is actually used.

### [LOW] `src/features/sites/HrtSite.tsx` and `MedSpaSite.tsx`

Two full marketing site components exist in `src/features/sites/` but are not imported by any route. They appear to be earlier prototypes of the marketing homepage.
**Files:** `src/features/sites/HrtSite.tsx`, `src/features/sites/MedSpaSite.tsx`

### [LOW] `src/components/marketing/DashboardMock.tsx`

A marketing dashboard preview component. Check if this is referenced from the marketing homepage or is orphaned.

### [LOW] `src/features/ascend/` Entire Module May Be Out of Scope

The Ascend app (`/ascend` route) is a separate self-optimization OS product embedded in this codebase. It has its own `mockData.ts`, `theme.css`, and 6 tab components. It is accessible at `/ascend` but is not linked from the admin or portal navigation. Assess whether this belongs in ArcaRX or should be extracted.
**Files:** `src/features/ascend/` (entire directory)

---

## 7. Performance Issues

### [MEDIUM] Recharts Bundle on Every Admin Page

**Files:** `src/routes/admin/dashboard.tsx:7–12`
**Detail:** Imports `AreaChart`, `LineChart`, `PieChart`, `BarChart`, and all their sub-components from Recharts in one import block. These are large components. Dashboard and several other admin pages each import separately, potentially not benefiting from tree-shaking as intended.

### [LOW] `sleep()` Calls Add 80–120ms of Artificial Latency to Every Query

**Files:** All `src/hooks/queries/use*.ts` files
**Detail:** Every query hook artificially sleeps before returning data. This creates unnecessary loading skeletons on every page navigation, making the app feel slow. Remove before Supabase wiring.

### [LOW] Fit Seed Data Is Extensive and Always Loaded Eagerly

**Files:** `src/lib/fit-seed.ts`, `src/lib/fit-seed-extra.ts`
**Detail:** Both files are imported at the top of multiple fit routes. They are large arrays loaded synchronously at bundle evaluation time. Should be lazy-loaded or moved to query functions once Supabase is wired.

---

## 8. Test Coverage Gaps

### [HIGH] No Tests Exist

There are no test files (`.test.*` or `.spec.*`) anywhere in `src/`. No Jest, Vitest, Playwright, or Cypress configuration exists. The entire codebase has zero automated coverage.
**Risk:** Every refactor to replace mock data with Supabase calls, wire up action buttons, or add auth guards is unverified.
**Priority:** High — especially before adding auth and real write operations.

---

*Concerns audit: 2026-07-02*
