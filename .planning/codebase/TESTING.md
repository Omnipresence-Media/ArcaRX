# Testing Patterns

**Analysis Date:** 2026-07-02

## Test Framework

**Runner:** None installed.

No test framework, test runner, or assertion library is present in `package.json` (neither `vitest`, `jest`, `playwright`, `@testing-library/react`, nor any equivalent). There are zero test files (`.test.tsx`, `.spec.ts`, etc.) anywhere in the repository.

**Run Commands:**
```bash
# No test commands exist. Current scripts:
bun run dev         # development server
bun run typecheck   # tsc --noEmit (the only quality gate)
bun run lint        # eslint .
bun run format      # prettier --write .
bun run build       # tsc + vite build
```

The only automated quality gate is TypeScript type checking (`tsc --noEmit`) run as part of `bun run build`.

## Current State

**Test coverage: 0%.** No tests of any kind exist in the codebase.

**What exists instead:**
- Static mock/seed data in `src/lib/seed-data.ts`, `src/lib/data/`, `src/features/portal/mockData.ts`, `src/features/ascend/mockData.ts`
- All hooks in `src/hooks/queries/` simulate async via `sleep(120)` against in-memory arrays - they are pure functions of the seed data, which makes them highly testable
- TypeScript strict mode provides type-level correctness checking only

## What Should Be Tested (Priority Order)

### 1. Data hooks - highest value, lowest friction

The hooks in `src/hooks/queries/` are the cleanest testable units. They are pure async functions with no external dependencies (no real network calls, no DOM). Each wraps `@tanstack/react-query` and filters seed data.

Files:
- `src/hooks/queries/usePatients.ts` - filter logic by location, provider, search, risk, tier
- `src/hooks/queries/useAppointments.ts` - today's schedule by location
- `src/hooks/queries/useEncounters.ts`, `useInvoices.ts`, `useLabs.ts`, `usePrescriptions.ts`

What to test:
```typescript
// Example: usePatients filter correctness
it("filters patients by locationId", async () => {
  const { result } = renderHook(() => usePatients({ locationId: "loc-atx" }), {
    wrapper: queryClientWrapper,
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.every(p => p.locationId === "loc-atx")).toBe(true);
});
```

### 2. Pure utility/helper functions - zero-friction unit tests

Helper functions defined inline in route files should be extracted to `src/lib/utils.ts` or co-located utility modules and tested:

- `waitMinutes(checkInTime: string, now: Date): number` - in `src/routes/admin/dashboard.tsx:29`
- `riskBadge(r: string)` - in `src/routes/admin/patients.index.tsx:21`
- `memberBadge(tier: string)` - in `src/routes/admin/patients.index.tsx:25`
- `modalityIcon(m: string)` - in `src/routes/portal.visits.tsx:15`

These are trivial to unit test with no framework overhead.

### 3. Reusable shell components

Components in `src/components/shell/` that take typed props and render predictable output:

- `src/components/shell/PageHeader.tsx` - renders eyebrow, title, description, actions slots
- `src/components/shell/ViewToggle.tsx` - toggle between view modes
- `src/components/shell/MobileTabBar.tsx` - tab navigation

These are pure presentational components with no side effects - ideal for `@testing-library/react` snapshot or behavior tests.

### 4. Navigation configuration correctness

`src/components/shell/AppSidebar.tsx` contains `primarySections` and `extraSections` - arrays of nav items with URLs and labels. These could be tested to:
- Verify all URLs match actual routes
- Verify no duplicate URLs
- Verify required fields exist (title, url, icon)

### 5. Portal patient-facing flows

`src/routes/portal.visits.tsx`, `src/routes/portal.billing.tsx`, `src/routes/portal.meds.tsx` are patient-visible and higher business risk than internal admin views. These should be integration tested for:
- Correct rendering of upcoming vs past visits
- BookingModal opening/closing on button click
- Cart behavior in `src/features/portal/cart.ts`

## Recommended Testing Setup

**Recommended stack:**
```
vitest           # fast, Vite-native, zero config delta
@testing-library/react
@testing-library/user-event
msw              # mock service worker (for when real API replaces seed data)
```

**Install:**
```bash
bun add -D vitest @testing-library/react @testing-library/user-event jsdom @vitejs/plugin-react
```

**`vite.config.ts` addition:**
```typescript
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: ["./src/test/setup.ts"],
}
```

**QueryClient wrapper for hook tests:**
```typescript
// src/test/utils.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function queryClientWrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
```

## Test File Organization

**Recommended location:** Co-located next to source files.
```
src/
  hooks/queries/
    usePatients.ts
    usePatients.test.ts       ← co-located
  components/shell/
    PageHeader.tsx
    PageHeader.test.tsx       ← co-located
  lib/
    utils.ts
    utils.test.ts
```

**Naming:** `[filename].test.ts` for pure logic, `[filename].test.tsx` for components.

## Test Types

**Unit Tests:**
- All `src/lib/` utility functions
- Filter logic inside `src/hooks/queries/` hooks
- Inline helper functions extracted to utilities

**Integration Tests:**
- Hook + QueryClient combinations via `renderHook`
- Component + mock data via `render` + `userEvent`
- Portal flows: booking, cart operations

**E2E Tests:** Not set up. Playwright would be the natural choice given TanStack Start's SSR. Not recommended until unit/integration coverage exists first.

## Coverage Gaps (All gaps - nothing is tested)

**Critical (patient-visible, business risk):**
- Portal booking flow (`src/components/portal/BookingModal.tsx`) - untested
- Portal shop cart (`src/features/portal/cart.ts`) - untested, has real state mutations
- Patient data filtering (`src/hooks/queries/usePatients.ts`) - zero coverage

**High (admin clinical data):**
- All admin route pages render correctly with loading/empty/data states - untested
- Treatment track panel routing (`src/components/shell/TreatmentPanel.tsx`) - untested

**Medium:**
- Navigation link correctness in `src/components/shell/AppSidebar.tsx`
- Dark mode rendering (marketing site uses filter:invert - fragile)

---

*Testing analysis: 2026-07-02*
