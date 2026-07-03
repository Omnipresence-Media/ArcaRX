import { useSyncExternalStore } from "react";
import { programs as seedPrograms, sampleWeek, mealPlans as seedMealPlans, sampleMeals, fitClients } from "@/lib/fit-seed";

// The real program/meal-plan builder store. Coaches build detailed, custom
// workout programs and diet plans here; clients' portals render the assigned
// content and log completions. localStorage-backed so everything a coach
// builds survives navigation and reload. Swap internals for Supabase later —
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

export type BuilderDay = {
  id: string;
  day: string;
  title: string;
  exercises: BuilderExercise[];
};

export type BuilderProgram = {
  id: string;
  name: string;
  weeks: number;
  daysPerWeek: number;
  level: string;
  focus: string;
  days: BuilderDay[];
};

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

// Per-client daily log: which exercises and meals are checked off today.
export type DayLog = { exercises: Record<string, boolean>; meals: Record<string, boolean> };

type StoreShape = {
  programs: BuilderProgram[];
  mealPlans: BuilderMealPlan[];
  assignments: Record<string, Assignment>;
  logs: Record<string, DayLog>; // key: `${clientId}:${dateKey}`
};

const STORAGE_KEY = "arca_builder_v1";

let uid = 0;
const nid = (p: string) => `${p}-${Date.now().toString(36)}-${(uid++).toString(36)}`;

function seedDays(): BuilderDay[] {
  return sampleWeek.map((d, i) => ({
    id: `day-${i}`,
    day: d.day,
    title: d.title,
    exercises: d.exercises.map((e) => ({ ...e, id: `${e.id}-${i}` })),
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
      if (parsed && Array.isArray(parsed.programs) && parsed.programs.length) store = parsed;
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

const EMPTY_LOG: DayLog = { exercises: {}, meals: {} };

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
    : { id, name: "New program", weeks: 8, daysPerWeek: 4, level: "Intermediate", focus: "Custom", days: seedDays().map((d) => ({ ...d, exercises: [] })) };
  store = { ...store, programs: [fresh, ...store.programs] };
  emit();
  return id;
}

export function addSession(programId: string) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: [...p.days, { id: nid("day"), day: `Day ${p.days.length + 1}`, title: "New session", exercises: [] }],
  }));
}

export function removeSession(programId: string, dayId: string) {
  mutateProgram(programId, (p) => ({ ...p, days: p.days.filter((d) => d.id !== dayId) }));
}

export function renameSession(programId: string, dayId: string, title: string) {
  mutateProgram(programId, (p) => ({
    ...p,
    days: p.days.map((d) => (d.id === dayId ? { ...d, title } : d)),
  }));
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

export function toggleExerciseDone(clientId: string, exId: string) {
  hydrate();
  const key = `${clientId}:${todayKey()}`;
  const log = store.logs[key] ?? { exercises: {}, meals: {} };
  store = {
    ...store,
    logs: { ...store.logs, [key]: { ...log, exercises: { ...log.exercises, [exId]: !log.exercises[exId] } } },
  };
  emit();
}

export function toggleMealDone(clientId: string, mealId: string) {
  hydrate();
  const key = `${clientId}:${todayKey()}`;
  const log = store.logs[key] ?? { exercises: {}, meals: {} };
  store = {
    ...store,
    logs: { ...store.logs, [key]: { ...log, meals: { ...log.meals, [mealId]: !log.meals[mealId] } } },
  };
  emit();
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
