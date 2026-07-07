import { useSyncExternalStore } from "react";
import { upcomingVisits, type Visit } from "./mockData";
import { upcomingSessions } from "./proData";
import { getProductMode, type ProductMode } from "@/lib/productMode";

// Lightweight client-side appointments store with localStorage persistence.
// Mode-aware: the Patient (rx) list holds medical visits, the Client (pro)
// list holds coaching sessions. All calls operate on the current product
// mode's list, so pages don't need to care which build they're in. When the
// real Supabase data layer lands, swap this store's internals for queries -
// the hook surface stays the same.

const STORAGE_KEYS: Record<ProductMode, string> = {
  rx: "arca_portal_appointments",
  pro: "arca_portal_sessions",
};

const SEEDS: Record<ProductMode, Visit[]> = {
  rx: upcomingVisits,
  pro: upcomingSessions,
};

const lists: Record<ProductMode, Visit[]> = {
  rx: [...upcomingVisits],
  pro: [...upcomingSessions],
};
const hydratedModes = new Set<ProductMode>();
const listeners = new Set<() => void>();

function persist(mode: ProductMode) {
  try {
    localStorage.setItem(STORAGE_KEYS[mode], JSON.stringify(lists[mode]));
  } catch {
    /* storage unavailable - keep in memory */
  }
}

function hydrate(mode: ProductMode) {
  if (hydratedModes.has(mode) || typeof window === "undefined") return;
  hydratedModes.add(mode);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[mode]);
    if (raw) {
      const parsed = JSON.parse(raw) as Visit[];
      if (Array.isArray(parsed)) lists[mode] = parsed;
    } else {
      persist(mode);
    }
  } catch {
    /* fall back to seed */
  }
}

function emit(mode: ProductMode) {
  persist(mode);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate(getProductMode());
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Visit[] {
  const mode = getProductMode();
  hydrate(mode);
  return lists[mode];
}

function getServerSnapshot(): Visit[] {
  return SEEDS.rx;
}

export function addVisit(v: Visit) {
  const mode = getProductMode();
  lists[mode] = [v, ...lists[mode]];
  emit(mode);
}

export function updateVisit(id: string, patch: Partial<Visit>) {
  const mode = getProductMode();
  lists[mode] = lists[mode].map((v) => (v.id === id ? { ...v, ...patch } : v));
  emit(mode);
}

export function removeVisit(id: string) {
  const mode = getProductMode();
  lists[mode] = lists[mode].filter((v) => v.id !== id);
  emit(mode);
}

export function getVisit(id: string): Visit | undefined {
  const mode = getProductMode();
  hydrate(mode);
  return lists[mode].find((v) => v.id === id);
}

export function useAppointments(): Visit[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
