import { useSyncExternalStore } from "react";

// Which product build the user is in:
//   rx  = ARCA Rx  (medical: Clinic back office + Patient portal)
//   pro = ARCA Pro (coaching: Coach back office + Client portal)
// The 4-way ViewToggle sets this; the shells read it to pick nav + branding
// and to hide the medical modules in Pro. localStorage-backed for the demo;
// swap for the auth user's plan when the real backend lands.

export type ProductMode = "rx" | "pro";

const STORAGE_KEY = "arca_product_mode";
const DEFAULT: ProductMode = "rx";

let mode: ProductMode = DEFAULT;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "rx" || raw === "pro") mode = raw;
  } catch {
    /* keep default */
  }
}

function emit() {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  hydrate();
  listeners.add(l);
  return () => listeners.delete(l);
}

export function setProductMode(next: ProductMode) {
  hydrate();
  if (mode === next) return;
  mode = next;
  emit();
}

export function getProductMode(): ProductMode {
  hydrate();
  return mode;
}

export function useProductMode(): ProductMode {
  return useSyncExternalStore(subscribe, () => (hydrate(), mode), () => DEFAULT);
}
