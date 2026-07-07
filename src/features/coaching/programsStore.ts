import { useSyncExternalStore } from "react";

// Per-client coaching program enablement + assigned content.
// A provider toggles which of the three programs a client can access;
// the client portal shows only enabled programs. localStorage-backed so
// selections persist across navigation and reload.

export type ProgramKey = "fitness" | "health" | "protocol";

export type ClientPrograms = Record<ProgramKey, boolean>;

export const PROGRAM_META: Record<
  ProgramKey,
  { label: string; blurb: string; accent: string }
> = {
  fitness: {
    label: "Fitness",
    blurb: "Workouts, training splits, and form reviews.",
    accent: "var(--teal)",
  },
  health: {
    label: "Health",
    blurb: "Meal plans, macros, and diet templates.",
    accent: "var(--chart-emerald, #4ade80)",
  },
  protocol: {
    label: "Protocol",
    blurb: "Skincare & clinical regimens, supplements, dosing.",
    accent: "var(--chart-violet, #a78bfa)",
  },
};

export const PROGRAM_KEYS: ProgramKey[] = ["fitness", "health", "protocol"];

const STORAGE_KEY = "arca_coaching_programs";
const DEFAULT: ClientPrograms = { fitness: false, health: false, protocol: false };
const DEMO_ENABLED: ClientPrograms = { fitness: true, health: true, protocol: true };

// Clients that ship with programs pre-enabled so the no-login demo shows the
// coaching experience the moment someone clicks in - no coach toggle needed.
// c1 is the demo patient the portal maps to (DEMO_CLIENT_ID in portal.coaching).
const DEMO_CLIENTS = new Set(["c1"]);
function defaultFor(clientId: string): ClientPrograms {
  return DEMO_CLIENTS.has(clientId) ? DEMO_ENABLED : DEFAULT;
}

type Store = Record<string, ClientPrograms>;

let store: Store = {};
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) store = JSON.parse(raw) as Store;
  } catch {
    /* keep empty */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function programsFor(clientId: string): ClientPrograms {
  hydrate();
  return store[clientId] ?? defaultFor(clientId);
}

// Stable snapshot cache so useSyncExternalStore doesn't loop.
const snapshotCache = new Map<string, ClientPrograms>();
function getSnapshot(clientId: string): ClientPrograms {
  const current = programsFor(clientId);
  const cached = snapshotCache.get(clientId);
  if (
    cached &&
    cached.fitness === current.fitness &&
    cached.health === current.health &&
    cached.protocol === current.protocol
  ) {
    return cached;
  }
  snapshotCache.set(clientId, current);
  return current;
}

export function toggleProgram(clientId: string, key: ProgramKey) {
  const current = programsFor(clientId);
  store = { ...store, [clientId]: { ...current, [key]: !current[key] } };
  emit();
}

export function setProgram(clientId: string, key: ProgramKey, on: boolean) {
  const current = programsFor(clientId);
  store = { ...store, [clientId]: { ...current, [key]: on } };
  emit();
}

export function useClientPrograms(clientId: string): ClientPrograms {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(clientId),
    () => defaultFor(clientId),
  );
}

export function enabledCount(p: ClientPrograms): number {
  return PROGRAM_KEYS.filter((k) => p[k]).length;
}
