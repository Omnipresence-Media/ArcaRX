import type { Patient, Prescription, ProductType } from "./store";

// Pure business rules for the Spruce Micro prototype. UI calls these; it
// never reimplements them. Money is always integer cents.

export const SETTINGS = {
  doctorVisitFeeCents: 2500,
  nonRxShippingCents: 895,
  // Subtotal tiers. $0 to $349.99 earns 20%, $350 and up earns 30%.
  discountTiers: [
    { minCents: 0, pct: 20 },
    { minCents: 35000, pct: 30 },
  ],
  discountsApplyToRx: true,
};

const VIDEO_STATES = new Set(["TX", "CA", "FL"]);

// In production this comes from the doctor network. Default is a form visit.
export function visitTypeFor(stateCode: string): "form" | "video" {
  return VIDEO_STATES.has(stateCode) ? "video" : "form";
}

export function money(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function tierPct(subtotalCents: number): number {
  let pct = SETTINGS.discountTiers[0].pct;
  for (const t of SETTINGS.discountTiers) if (subtotalCents >= t.minCents) pct = t.pct;
  return pct;
}

const roundHalfUp = (n: number) => Math.floor(n + 0.5);

export type CartInput = { productId: string; qty: number; type: ProductType; unitCents: number };
export type PricedLine = CartInput & { lineCents: number; discountCents: number };

// Discount math is per line, rounded half up to the cent, then summed.
export function priceCart(lines: CartInput[], pct: number): { lines: PricedLine[]; subtotalCents: number; discountCents: number } {
  const priced: PricedLine[] = lines.map((l) => {
    const lineCents = l.unitCents * l.qty;
    const applies = l.type === "rx" ? SETTINGS.discountsApplyToRx : true;
    return { ...l, lineCents, discountCents: applies ? roundHalfUp((lineCents * pct) / 100) : 0 };
  });
  return {
    lines: priced,
    subtotalCents: priced.reduce((a, l) => a + l.lineCents, 0),
    discountCents: priced.reduce((a, l) => a + l.discountCents, 0),
  };
}

// The patient gets either the automatic tier discount or a promo code, never
// both. We preselect whichever saves more (ties go to the tier).
export function discountChoice(subtotalCents: number, promoPct: number | null): { tierPct: number; promoPct: number | null; best: "tier" | "promo" } {
  const t = tierPct(subtotalCents);
  return { tierPct: t, promoPct, best: promoPct !== null && promoPct > t ? "promo" : "tier" };
}

// RX only ships free. Any non-RX item adds one flat fee for the cart.
export function shippingFor(types: ProductType[]): number {
  return types.includes("non_rx") ? SETTINGS.nonRxShippingCents : 0;
}

export function rxCoverage(prescriptions: Prescription[], productId: string): "covered" | "needs_visit" {
  const ok = prescriptions.find((r) => r.productId === productId && r.status === "active" && r.fillsUsed < r.fillsAllowed);
  return ok ? "covered" : "needs_visit";
}

export type AccessLevel = "onboarding" | "full" | "restricted";

// onboarding: not approved yet, onboarding flow only.
// full: approved and active.
// restricted: approved but past due, paused or cancelled. Records, emergency,
// support, account and card update stay reachable.
export function accessLevel(p: Pick<Patient, "onboarding" | "membership">): AccessLevel {
  if (p.onboarding !== "approved") return "onboarding";
  return p.membership === "active" ? "full" : "restricted";
}

export const RESTRICTED_ALLOWED = [
  "/spruce/portal/account",
  "/spruce/portal/protocols",
  "/spruce/portal/emergency",
  "/spruce/portal/support",
];
