import { useSyncExternalStore } from "react";
import { upcomingVisits, type Visit } from "./mockData";

// Lightweight client-side appointments store with localStorage persistence.
// This lets bookings/reschedules/cancels survive navigation and reload without
// a backend. When the real Supabase data layer lands, swap this store's
// internals for queries — the hook surface stays the same.

const STORAGE_KEY = "arca_portal_appointments";

let visits: Visit[] = [...upcomingVisits];
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch {
    /* storage unavailable — keep in memory */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Visit[];
      if (Array.isArray(parsed)) visits = parsed;
    } else {
      persist();
    }
  } catch {
    /* fall back to seed */
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

function getSnapshot(): Visit[] {
  hydrate();
  return visits;
}

function getServerSnapshot(): Visit[] {
  return upcomingVisits;
}

export function addVisit(v: Visit) {
  visits = [v, ...visits];
  emit();
}

export function updateVisit(id: string, patch: Partial<Visit>) {
  visits = visits.map((v) => (v.id === id ? { ...v, ...patch } : v));
  emit();
}

export function removeVisit(id: string) {
  visits = visits.filter((v) => v.id !== id);
  emit();
}

export function getVisit(id: string): Visit | undefined {
  hydrate();
  return visits.find((v) => v.id === id);
}

export function useAppointments(): Visit[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
