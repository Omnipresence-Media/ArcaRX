import { useSyncExternalStore } from "react";
import { programs as seedPrograms, sampleWeek, mealPlans as seedMealPlans, sampleMeals, fitClients } from "@/lib/fit-seed";
import { protocolFor } from "@/features/coaching/protocolSeed";

// The real program/meal-plan builder store. Coaches build detailed, custom
// workout programs and diet plans here; clients' portals render the assigned
// content and log completions. localStorage-backed so everything a coach
// builds survives navigation and reload. Swap internals for Supabase later -
// the hook surface stays the same.

export type BuilderExercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  sets: number;
  reps: string;
  rpe: number;
  rest: string;
  notes?: string;
};

// One station inside a circuit: either a reps-based exercise or a timed
// interval (e.g. "Battle Bike · 30s"). The coach names every station.
export type CircuitStation = {
  id: string;
  name: string;
  kind: "reps" | "time";
  reps?: string; // kind === "reps", e.g. "12" or "10-12"
  seconds?: number; // kind === "time", e.g. 30
  note?: string;
};

// A HIIT/CrossFit-style circuit: a named set of stations performed for N
// rounds, with rest between rounds. A session can hold several circuits.
export type Circuit = {
  id: string;
  name: string;
  rounds: number;
  restBetweenRounds: number; // seconds
  stations: CircuitStation[];
};

export type BuilderDay = {
  id: string;
  day: string;
  title: string;
  exercises: BuilderExercise[];
  circuits?: Circuit[];
};

export type BuilderProgram = {
  id: string;
  name: string;
  weeks: number;
  daysPerWeek: number;
  level: string;
  focus: string;
  days: BuilderDay[];
  // Set when this program is a client-specific copy: edits stay tailored to
  // that client and never touch the global template.
  tailoredFor?: { clientId: string; clientName: string };
};

// One supplement row in a client's protocol (coach-editable, per client).
export type Supplement = { id: string; name: string; dose: string; timing: string };

export type FoodItem = { id: string; name: string; grams: number; kcal: number; p: number; c: number; f: number };
export type BuilderMeal = { id: string; name: string; time: string; items: FoodItem[] };

export type BuilderMealPlan = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: BuilderMeal[];
};

export type Assignment = { programId?: string; mealPlanId?: string };

// One logged set: the weight used, reps completed, and whether it's locked in.
export type SetLog = { weight: number; reps: number; done: boolean };

// Per-client daily log: per-exercise set logs, meals checked off, protocol
// regimen steps, and circuit stations completed (keyed by
// `${circuitId}:${round}:${stationId}`) today.
export type DayLog = { sets: Record<string, SetLog[]>; meals: Record<string, boolean>; steps?: Record<string, boolean>; circuit?: Record<string, boolean> };

type StoreShape = {
  programs: BuilderProgram[];
  mealPlans: BuilderMealPlan[];
  assignments: Record<string, Assignment>;
  logs: Record<string, DayLog>; // key: `${clientId}:${dateKey}`
  // Per-client protocol supplements. Absent key = fall back to the protocol
  // seed for that client; first edit copies the seed in and owns it.
  clientSupplements?: Record<string, Supplement[]>;
};

const STORAGE_KEY = "arca_builder_v2";

let uid = 0;
const nid = (p: string) => `${p}-${Date.now().toString(36)}-${(uid++).toString(36)}`;

// One example circuit on the first training day so the demo shows the
// HIIT/circuit experience out of the box. Stable ids keep SSR + client and
// the client's completion log consistent.
const SEED_CIRCUIT: Circuit = {
  id: "cir-seed-1",
  name: "Finisher · Metcon",
  rounds: 4,
  restBetweenRounds: 45,
  stations: [
    { id: "st-seed-1", name: "Goblet Squat", kind: "reps", reps: "15" },
    { id: "st-seed-2", name: "Push-ups", kind: "reps", reps: "12" },
    { id: "st-seed-3", name: "Kettlebell Swing", kind: "reps", reps: "15" },
    { id: "st-seed-4", name: "Battle Bike", kind: "time", seconds: 30 },
  ],
};

function seedDays(): BuilderDay[] {
  return sampleWeek.map((d, i) => ({
    id: `day-${i}`,
    day: d.day,
    title: d.title,
    exercises: d.exercises.map((e) => ({ ...e, id: `${e.id}-${i}` })),
    circuits: i === 0 ? [JSON.parse(JSON.stringify(SEED_CIRCUIT))] : undefined,
  }));
}

function seed(): StoreShape {
  const programs: BuilderProgram[] = seedPrograms.map((p) => ({
    id: p.id,
    name: p.name,
    weeks: p.weeks,
    daysPerWeek: p.daysPerWeek,
    level: p.level,
    focus: p.focus,
    days: seedDays(),
  }));

  const mealPlans: BuilderMealPlan[] = seedMealPlans.map((m) => ({
    id: m.id,
    name: m.name,
    calories: m.calories,
    protein: m.protein,
    carbs: m.carbs,
    fat: m.fat,
    meals: sampleMeals.map((sm, i) => ({
      id: `meal-${m.id}-${i}`,
      name: sm.meal,
      time: sm.time,
      items: sm.items.map((it, j) => ({ id: `item-${m.id}-${i}-${j}`, ...it })),
    })),
  }));

  // Default assignments: match each client's seed program name; first meal plan.
  const assignments: Record<string, Assignment> = {};
  for (const c of fitClients) {
    const prog = programs.find((p) => p.name === c.program) ?? programs[0];
    assignments[c.id] = { programId: prog.id, mealPlanId: mealPlans[0].id };
  }

  return { programs, mealPlans, assignments, logs: {} };
}

let store: StoreShape = seed();
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreShape;
      if (parsed && Array.isArray(parsed.programs) && parsed.programs.length) {
        store = { ...parsed, clientSupplements: parsed.clientSupplements ?? {} };
      }
    }
  } catch {
    /* keep seed */
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  hydrate();
  listeners.add(l);
  return () => listeners.delete(l);
}

// ---- selectors (stable snapshots) -----------------------------------------

const serverSeed = seed();

export function usePrograms(): BuilderProgram[] {
  return useSyncExternalStore(subscribe, () => (hydrate(), store.programs), () => serverSeed.programs);
}

export function useProgram(id: string | undefined): BuilderProgram | undefined {
  return useSyncExternalStore(
    subscribe,
    () => (hydrate(), store.programs.find((p) => p.id === id) ?? store.programs[0]),
    () => serverSeed.programs.find((p) => p.id === id) ?? serverSeed.programs[0],
  );
}

export function useMealPlans(): BuilderMealPlan[] {
  return useSyncExternalStore(subscribe, () => (hydrate(), store.mealPlans), () => serverSeed.mealPlans);
}

export function useAssignment(clientId: string): Assignment {
  return useSyncExternalStore(
    subscribe,
    () => (hydrate(), store.assignments[clientId] ?? serverSeed.assignments[clientId] ?? {}),
    () => serverSeed.assignments[clientId] ?? {},
  );
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const EMPTY_LOG: DayLog = { sets: {}, meals: {} };

export function useDayLog(clientId: string): DayLog {
  const key = `${clientId}:${todayKey()}`;
  return useSyncExternalStore(
    subscribe,
    () => (hydrate(), store.logs[key] ?? EMPTY_LOG),
    () => EMPTY_LOG,
  );
}

// ---- mutations -------------------------------------------------------------

function mutateProgram(id: string, fn: (p: BuilderProgram) => BuilderProgram) {
  store = { ...store, programs: store.programs.map((p) => (p.id === id ? fn(p) : p)) };
  emit();
}

export function renameProgram(id: string, name: string) {
  mutateProgram(id, (p) => ({ ...p, name }));
}

export function createProgram(fromId?: string): string {
  hydrate();
  const src = fromId ? store.programs.find((p) => p.id === fromId) : undefined;
  const id = nid("prog");
  const fresh: BuilderProgram = src
    ? { ...JSON.parse(JSON.stringify(src)), id, name: `${src.name} (copy)` }
    : { id, name: "New program", weeks: 8, daysPerWeek: 4, level: "Intermediate", focus: "Custom", days: seedDays().map((d) => ({ ...d, exercises: [], circuits: [] })) };
  store = { ...store, programs: [fresh, ...store.programs] };
  emit();
  return id;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function addSession(programId: string, day?: string, title?: string) {
  mutateProgram(programId, (p) => {
    // Default the day label to the first weekday not already used, so a
    // deleted Monday can simply be added back.
    const used = new Set(p.days.map((d) => d.day));
    const nextDay = day ?? WEEKDAYS.find((w) => !used.has(w)) ?? `Day ${p.days.length + 1}`;
    return {
      ...p,
      days: [...p.days, { id: nid("day"), day: nextDay, title: title ?? "New session", exercises: [] }],
    };
  });
}

export function removeSession(programId: string, dayId: string) {
  mutateProgram(programId, (p) => ({ ...p, days: p.days.filter((d) => d.id !== dayId) }));
}

// Re-insert a previously removed session at its old position (delete undo).
export function insertSessionAt(programId: string, day: BuilderDay, index: number) {
  mutateProgram(programId, (p) => {
    const days = [...p.days];
    days.splice(Math.min(Math.max(index, 0), days.length), 0, day);
    return { ...p, days };
  });
}

// Drag-and-drop reorder of sessions within a program.
export function moveSession(programId: string, fromIdx: number, toIdx: number) {
  mutateProgram(programId, (p) => {
    if (fromIdx === toIdx || fromIdx < 0 || fromIdx >= p.days.length) return p;
    const days = [...p.days];
    const [moved] = days.splice(fromIdx, 1);
    days.splice(Math.min(Math.max(toIdx, 0), days.length), 0, moved);
    return { ...p, days };
  });
}

export function renameSession(programId: string, dayId: string, title: string) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) => (d.id === dayId ? { ...d, title } : d)),
  }));
}

// Rename the day chip itself (Mon, Tue, "Day 5"...).
export function renameSessionDay(programId: string, dayId: string, day: string) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) => (d.id === dayId ? { ...d, day } : d)),
  }));
}

// Clone a program as a client-specific copy and assign it, so the coach can
// tailor it for one client without touching the global template.
export function forkProgramForClient(clientId: string, clientName: string, programId: string): string {
  hydrate();
  const src = store.programs.find((p) => p.id === programId);
  if (!src) return programId;
  const id = nid("prog");
  const fresh: BuilderProgram = {
    ...(JSON.parse(JSON.stringify(src)) as BuilderProgram),
    id,
    name: src.tailoredFor ? src.name : `${src.name} · ${clientName.split(" ")[0]}`,
    tailoredFor: { clientId, clientName },
  };
  const current = store.assignments[clientId] ?? {};
  store = {
    ...store,
    programs: [fresh, ...store.programs],
    assignments: { ...store.assignments, [clientId]: { ...current, programId: id } },
  };
  emit();
  return id;
}

export function addExercise(programId: string, dayId: string, ex: { name: string; muscle: string; equipment: string }) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) =>
      d.id === dayId
        ? { ...d, exercises: [...d.exercises, { id: nid("ex"), sets: 3, reps: "8-10", rpe: 8, rest: "2:00", ...ex }] }
        : d,
    ),
  }));
}

export function updateExercise(programId: string, dayId: string, exId: string, patch: Partial<BuilderExercise>) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) =>
      d.id === dayId ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, ...patch } : e)) } : d,
    ),
  }));
}

export function removeExercise(programId: string, dayId: string, exId: string) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) => (d.id === dayId ? { ...d, exercises: d.exercises.filter((e) => e.id !== exId) } : d)),
  }));
}

// ---- circuit (HIIT/CrossFit) mutations -------------------------------------

function mutateCircuit(programId: string, dayId: string, circuitId: string, fn: (c: Circuit) => Circuit) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) =>
      d.id === dayId ? { ...d, circuits: (d.circuits ?? []).map((c) => (c.id === circuitId ? fn(c) : c)) } : d,
    ),
  }));
}

export function addCircuit(programId: string, dayId: string) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) =>
      d.id === dayId
        ? {
            ...d,
            circuits: [
              ...(d.circuits ?? []),
              { id: nid("cir"), name: `Circuit ${(d.circuits?.length ?? 0) + 1}`, rounds: 4, restBetweenRounds: 60, stations: [] },
            ],
          }
        : d,
    ),
  }));
}

export function updateCircuit(programId: string, dayId: string, circuitId: string, patch: Partial<Pick<Circuit, "name" | "rounds" | "restBetweenRounds">>) {
  mutateCircuit(programId, dayId, circuitId, (c) => ({ ...c, ...patch }));
}

export function removeCircuit(programId: string, dayId: string, circuitId: string) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) => (d.id === dayId ? { ...d, circuits: (d.circuits ?? []).filter((c) => c.id !== circuitId) } : d)),
  }));
}

export function addStation(programId: string, dayId: string, circuitId: string, kind: "reps" | "time", init?: Partial<Pick<CircuitStation, "name" | "reps" | "seconds">>) {
  mutateCircuit(programId, dayId, circuitId, (c) => ({
    ...c,
    stations: [
      ...c.stations,
      kind === "time"
        ? { id: nid("st"), name: init?.name ?? "Battle Bike", kind: "time", seconds: init?.seconds ?? 30 }
        : { id: nid("st"), name: init?.name ?? "New exercise", kind: "reps", reps: init?.reps ?? "12" },
    ],
  }));
}

export function updateStation(programId: string, dayId: string, circuitId: string, stationId: string, patch: Partial<CircuitStation>) {
  mutateCircuit(programId, dayId, circuitId, (c) => ({
    ...c,
    stations: c.stations.map((s) => (s.id === stationId ? { ...s, ...patch } : s)),
  }));
}

export function removeStation(programId: string, dayId: string, circuitId: string, stationId: string) {
  mutateCircuit(programId, dayId, circuitId, (c) => ({ ...c, stations: c.stations.filter((s) => s.id !== stationId) }));
}

// ---- meal plan mutations ----------------------------------------------------

function mutatePlan(id: string, fn: (m: BuilderMealPlan) => BuilderMealPlan) {
  store = { ...store, mealPlans: store.mealPlans.map((m) => (m.id === id ? fn(m) : m)) };
  emit();
}

export function createMealPlan(name: string, calories: number, protein: number, carbs: number, fat: number): string {
  hydrate();
  const id = nid("plan");
  store = {
    ...store,
    mealPlans: [
      { id, name, calories, protein, carbs, fat, meals: [{ id: nid("meal"), name: "Breakfast", time: "7:00", items: [] }] },
      ...store.mealPlans,
    ],
  };
  emit();
  return id;
}

export function updatePlanTargets(id: string, patch: Partial<Pick<BuilderMealPlan, "name" | "calories" | "protein" | "carbs" | "fat">>) {
  mutatePlan(id, (m) => ({ ...m, ...patch }));
}

export function addMeal(planId: string) {
  mutatePlan(planId, (m) => ({
    ...m,
    meals: [...m.meals, { id: nid("meal"), name: `Meal ${m.meals.length + 1}`, time: "12:00", items: [] }],
  }));
}

export function removeMeal(planId: string, mealId: string) {
  mutatePlan(planId, (m) => ({ ...m, meals: m.meals.filter((x) => x.id !== mealId) }));
}

export function renameMeal(planId: string, mealId: string, patch: { name?: string; time?: string }) {
  mutatePlan(planId, (m) => ({ ...m, meals: m.meals.map((x) => (x.id === mealId ? { ...x, ...patch } : x)) }));
}

export function addFoodItem(planId: string, mealId: string, item: Omit<FoodItem, "id">) {
  mutatePlan(planId, (m) => ({
    ...m,
    meals: m.meals.map((x) => (x.id === mealId ? { ...x, items: [...x.items, { id: nid("item"), ...item }] } : x)),
  }));
}

export function removeFoodItem(planId: string, mealId: string, itemId: string) {
  mutatePlan(planId, (m) => ({
    ...m,
    meals: m.meals.map((x) => (x.id === mealId ? { ...x, items: x.items.filter((i) => i.id !== itemId) } : x)),
  }));
}

// ---- assignment + client logs -----------------------------------------------

export function assignToClient(clientId: string, patch: Assignment) {
  hydrate();
  const current = store.assignments[clientId] ?? {};
  store = { ...store, assignments: { ...store.assignments, [clientId]: { ...current, ...patch } } };
  emit();
}

// Ensure the set array for an exercise exists at the right length, then patch
// one set entry (weight, reps, or done).
export function logSet(clientId: string, exId: string, totalSets: number, setIdx: number, patch: Partial<SetLog>, defaults: { weight: number; reps: number }) {
  hydrate();
  const key = `${clientId}:${todayKey()}`;
  const log = store.logs[key] ?? { sets: {}, meals: {} };
  const existing = log.sets[exId] ?? [];
  const sets: SetLog[] = Array.from({ length: Math.max(totalSets, existing.length) }, (_, i) =>
    existing[i] ?? { weight: defaults.weight, reps: defaults.reps, done: false },
  );
  sets[setIdx] = { ...sets[setIdx], ...patch };
  store = {
    ...store,
    logs: { ...store.logs, [key]: { ...log, sets: { ...log.sets, [exId]: sets } } },
  };
  emit();
}

// Most recent weight this client logged for an exercise (any day) - used to
// prefill the next session so the athlete picks up where they left off.
export function lastWeightFor(clientId: string, exId: string): number | undefined {
  hydrate();
  const keys = Object.keys(store.logs).filter((k) => k.startsWith(`${clientId}:`)).sort().reverse();
  for (const k of keys) {
    const sets = store.logs[k]?.sets?.[exId];
    const done = sets?.filter((s) => s.done && s.weight > 0);
    if (done && done.length) return done[done.length - 1].weight;
  }
  return undefined;
}

export function toggleMealDone(clientId: string, mealId: string) {
  hydrate();
  const key = `${clientId}:${todayKey()}`;
  const log = store.logs[key] ?? { sets: {}, meals: {} };
  store = {
    ...store,
    logs: { ...store.logs, [key]: { ...log, meals: { ...log.meals, [mealId]: !log.meals[mealId] } } },
  };
  emit();
}

// Toggle one protocol regimen step (AM/PM routine item) done for today.
export function toggleStepDone(clientId: string, stepKey: string) {
  hydrate();
  const key = `${clientId}:${todayKey()}`;
  const log = store.logs[key] ?? { sets: {}, meals: {} };
  const steps = log.steps ?? {};
  store = {
    ...store,
    logs: { ...store.logs, [key]: { ...log, steps: { ...steps, [stepKey]: !steps[stepKey] } } },
  };
  emit();
}

// Toggle one circuit station done for a given round today. Key is
// `${circuitId}:${round}:${stationId}`.
export function toggleCircuitStation(clientId: string, key: string) {
  hydrate();
  const dk = `${clientId}:${todayKey()}`;
  const log = store.logs[dk] ?? { sets: {}, meals: {} };
  const circuit = log.circuit ?? {};
  store = {
    ...store,
    logs: { ...store.logs, [dk]: { ...log, circuit: { ...circuit, [key]: !circuit[key] } } },
  };
  emit();
}

// Force a circuit station to a value (used when a timed station's countdown
// finishes and auto-completes it). No-ops if already at that value.
export function setCircuitStation(clientId: string, key: string, value: boolean) {
  hydrate();
  const dk = `${clientId}:${todayKey()}`;
  const log = store.logs[dk] ?? { sets: {}, meals: {} };
  const circuit = log.circuit ?? {};
  if (!!circuit[key] === value) return;
  store = {
    ...store,
    logs: { ...store.logs, [dk]: { ...log, circuit: { ...circuit, [key]: value } } },
  };
  emit();
}

// ---- per-client protocol supplements ----------------------------------------

// Fallback: the client's protocol seed supplements, with generated ids.
// Cached so useSyncExternalStore gets a stable snapshot.
const suppSeedCache = new Map<string, Supplement[]>();
function seedSupplements(clientId: string): Supplement[] {
  let cached = suppSeedCache.get(clientId);
  if (!cached) {
    cached = protocolFor(clientId).supplements.map((s, i) => ({ id: `supp-seed-${clientId}-${i}`, ...s }));
    suppSeedCache.set(clientId, cached);
  }
  return cached;
}

function supplementsFor(clientId: string): Supplement[] {
  hydrate();
  return store.clientSupplements?.[clientId] ?? seedSupplements(clientId);
}

// Copy-on-write: the first edit materializes the seed list into the store so
// every row (seeded or custom) becomes editable and removable per client.
function ownSupplements(clientId: string): Supplement[] {
  return store.clientSupplements?.[clientId] ?? seedSupplements(clientId).map((s) => ({ ...s }));
}

function setSupplements(clientId: string, list: Supplement[]) {
  store = { ...store, clientSupplements: { ...(store.clientSupplements ?? {}), [clientId]: list } };
  emit();
}

export function useClientSupplements(clientId: string): Supplement[] {
  return useSyncExternalStore(
    subscribe,
    () => supplementsFor(clientId),
    () => seedSupplements(clientId),
  );
}

export function addClientSupplement(clientId: string, s: Omit<Supplement, "id">) {
  hydrate();
  setSupplements(clientId, [...ownSupplements(clientId), { id: nid("supp"), ...s }]);
}

export function updateClientSupplement(clientId: string, id: string, patch: Partial<Omit<Supplement, "id">>) {
  hydrate();
  setSupplements(clientId, ownSupplements(clientId).map((s) => (s.id === id ? { ...s, ...patch } : s)));
}

export function removeClientSupplement(clientId: string, id: string) {
  hydrate();
  setSupplements(clientId, ownSupplements(clientId).filter((s) => s.id !== id));
}

// ---- helpers -----------------------------------------------------------------

export function mealTotals(meal: BuilderMeal) {
  return meal.items.reduce(
    (a, i) => ({ kcal: a.kcal + i.kcal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );
}

export function planTotals(plan: BuilderMealPlan) {
  return plan.meals.reduce(
    (a, m) => {
      const t = mealTotals(m);
      return { kcal: a.kcal + t.kcal, p: a.p + t.p, c: a.c + t.c, f: a.f + t.f };
    },
    { kcal: 0, p: 0, c: 0, f: 0 },
  );
}
