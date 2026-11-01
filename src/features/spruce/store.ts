import { useSyncExternalStore } from "react";
import { SETTINGS, priceCart, rxCoverage, shippingFor, tierPct, visitTypeFor } from "./rules";

// Spruce Micro prototype store. Everything is mock, synthetic, and
// localStorage backed so the whole demo survives navigation and reload.
// Real adapters (payments, doctor network, pharmacy, shipping) replace the
// "demo" actions later without touching the screens.

// ---------------------------------------------------------------- types

export type MembershipType = "in_clinic" | "virtual";
export type OnboardingStatus = "account_created" | "pending_review" | "changes_requested" | "approved" | "rejected";
export type MembershipStatus = "incomplete" | "active" | "past_due" | "paused" | "cancelled";
export type Card = { brand: string; last4: string; exp: string };

export type Patient = {
  id: string;
  code: string; // PHI-free short id used in alerts, e.g. "#7F3A"
  name: string;
  email: string;
  state: string; // US state code
  membershipType: MembershipType | null;
  onboarding: OnboardingStatus;
  membership: MembershipStatus;
  practitionerId: string | null;
  consentSigned: boolean;
  idUploaded: boolean;
  photosUploaded: number; // baseline photos, virtual members need 3
  card: Card | null;
  anchorDay: number;
  nextRenewal: string;
  graceDaysLeft?: number;
  changesReason?: string;
  // Set when the member cancelled: access continues until nextRenewal.
  cancelAtPeriodEnd?: boolean;
  createdLabel: string;
};

export type Practitioner = { id: string; name: string };

export type CheckInStatus = "scheduled" | "open" | "submitted" | "missed" | "reviewed" | "cancelled";
export type CheckIn = {
  id: string;
  patientId: string;
  dueLabel: string; // always a Friday
  opensLabel: string; // the Monday before
  status: CheckInStatus;
  answers?: Record<string, string>;
  photos?: number;
  submittedLabel?: string;
};

export type Protocol = { id: string; patientId: string; title: string; uploadedLabel: string; checkInId?: string };

export type Message = { id: string; patientId: string; from: "patient" | "practitioner"; body: string; at: string; photos: number; overdue?: boolean };
export type Emergency = { id: string; patientId: string; body: string; status: "open" | "acknowledged" | "resolved"; at: string };
export type Ticket = {
  id: string;
  patientId: string;
  topic: "pharmacy_order" | "billing" | "technical" | "other";
  body: string;
  status: "open" | "in_progress" | "closed";
  orderId?: string;
  at: string;
};

export type ProductType = "rx" | "non_rx";
export type Product = {
  id: string;
  sku: string;
  name: string;
  type: ProductType;
  priceCents: number;
  blurb: string;
  education: string;
  videoId?: string; // YouTube id, embedded via youtube-nocookie.com
  active: boolean;
  tone: string; // tailwind gradient classes for the placeholder image
};
export type Promo = { id: string; code: string; percentOff: number; active: boolean; endsLabel: string; redemptions: number };

export type Prescription = {
  id: string;
  patientId: string;
  productId: string;
  status: "active" | "exhausted" | "expired";
  fillsAllowed: number;
  fillsUsed: number;
  expiresLabel: string;
};

export type CartLine = { productId: string; qty: number };
export type RxLineStatus = "not_rx" | "covered" | "needs_visit" | "approved" | "declined";
export type OrderLine = { productId: string; qty: number; type: ProductType; unitCents: number; discountCents: number; rx: RxLineStatus };
export type ShipmentStatus = "pending" | "held_for_rx" | "submitted" | "shipped" | "delivered" | "cancelled";
export type Shipment = { id: string; channel: "clinic_shipping" | "pharmacy"; status: ShipmentStatus; carrier?: string; tracking?: string };
export type OrderStatus = "awaiting_doctor" | "processing" | "partially_shipped" | "shipped" | "delivered" | "cancelled";
export type Order = {
  id: string;
  patientId: string;
  createdLabel: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotalCents: number;
  discountCents: number;
  discountSource: "auto_tier" | "promo";
  promoCode?: string;
  shippingCents: number;
  doctorFeeCents: number;
  totalCents: number;
  heldCents: number; // authorized but not captured (RX waiting on the doctor)
  capturedCents: number;
  releasedCents: number; // authorization released after a declined visit
  shipments: Shipment[];
  visitId?: string;
};

export type VisitStatus = "awaiting_patient" | "in_review" | "approved" | "declined";
export type Visit = {
  id: string;
  patientId: string;
  orderId: string;
  type: "form" | "video";
  status: VisitStatus;
  feeCents: number;
  productIds: string[];
  answers?: Record<string, string>;
  videoName?: string;
};

// Everything the system "would have sent". PHI-free by construction.
export type OutboxItem = { id: string; channel: "email" | "sms" | "slack"; to: string; text: string; at: string };

export type Scenario = "new" | "pending" | "changes" | "active" | "past_due" | "paused";

type State = {
  meId: string;
  scenario: Scenario;
  patients: Patient[];
  practitioners: Practitioner[];
  checkIns: CheckIn[];
  protocols: Protocol[];
  messages: Message[];
  emergencies: Emergency[];
  tickets: Ticket[];
  products: Product[];
  promos: Promo[];
  prescriptions: Prescription[];
  cart: CartLine[];
  orders: Order[];
  visits: Visit[];
  outbox: OutboxItem[];
};

// ---------------------------------------------------------------- static content

export const CHECKIN_QUESTIONS = [
  { id: "overall", prompt: "How is your skin feeling overall this week?", type: "scale" as const },
  { id: "irritation", prompt: "Any new redness, irritation or peeling?", type: "yes_no" as const },
  { id: "products", prompt: "Which products did you use?", type: "multi" as const, options: ["Cleanser", "Serum", "Moisturizer", "SPF", "Retinoid"] },
  { id: "needling", prompt: "How many times did you microneedle?", type: "single" as const, options: ["0", "1", "2", "3 or more"] },
  { id: "sun", prompt: "Sun exposure this week", type: "single" as const, options: ["Minimal", "Moderate", "High"] },
  { id: "notes", prompt: "Anything you want your practitioner to know?", type: "long" as const },
];

export const VISIT_QUESTIONS = [
  { id: "allergies", prompt: "Do you have any known allergies?", type: "yes_no" as const },
  { id: "pregnant", prompt: "Are you pregnant, nursing or planning a pregnancy?", type: "yes_no" as const },
  { id: "meds", prompt: "List any medications you currently take.", type: "long" as const },
  { id: "history", prompt: "Describe your skin concerns and what you have tried so far.", type: "long" as const },
];

// Check-in due dates are always Fridays. The picker only offers these.
export const FRIDAYS = [
  { due: "Fri, Nov 6", opens: "Mon, Nov 2" },
  { due: "Fri, Nov 13", opens: "Mon, Nov 9" },
  { due: "Fri, Nov 20", opens: "Mon, Nov 16" },
  { due: "Fri, Nov 27", opens: "Mon, Nov 23" },
  { due: "Fri, Dec 4", opens: "Mon, Nov 30" },
  { due: "Fri, Dec 11", opens: "Mon, Dec 7" },
];

export type Article = { slug: string; title: string; category: "microneedling" | "general"; summary: string; body: string[]; videoId?: string };

export const ARTICLES: Article[] = [
  {
    slug: "microneedling-rules",
    title: "Microneedling rules: the essentials",
    category: "microneedling",
    summary: "What to do before, during and after every session.",
    body: [
      "Start with clean hands and a clean face. Never needle over active breakouts, sunburn, cuts or irritated skin.",
      "Always use a fresh or properly sanitized device. Replace roller heads on the schedule your practitioner gave you.",
      "Pause retinoids and exfoliating acids for 3 days before and after a session.",
      "Keep sessions to the frequency in your protocol. More is not better.",
      "Apply SPF every morning, especially during the week after needling.",
      "If you see lasting redness, swelling or anything unusual, message your practitioner.",
    ],
  },
  {
    slug: "microneedling-tutorial",
    title: "Microneedling tutorial: step by step",
    category: "microneedling",
    summary: "A full walkthrough of technique, pressure and direction.",
    videoId: "aqz-KE-bpKQ",
    body: [
      "Section the face into zones and work one zone at a time.",
      "Use light, even pressure and roll in three directions: vertical, horizontal and diagonal.",
      "Lift and reposition the device between passes instead of dragging it.",
      "Finish with a calming serum and no actives for the rest of the evening.",
    ],
  },
  {
    slug: "evening-routine",
    title: "Building your evening routine",
    category: "general",
    summary: "Order of operations for the products in your protocol.",
    body: [
      "Cleanse first, then apply treatment products from thinnest to thickest.",
      "Prescription products go on dry skin, then a moisturizer to buffer.",
      "Introduce one new product at a time so you can tell what is working.",
    ],
  },
];

// ---------------------------------------------------------------- seed

const CARD: Card = { brand: "Visa", last4: "4242", exp: "09/28" };

function mkPatient(p: Partial<Patient> & Pick<Patient, "id" | "code" | "name" | "email">): Patient {
  return {
    state: "IL",
    membershipType: "virtual",
    onboarding: "approved",
    membership: "active",
    practitionerId: "pr1",
    consentSigned: true,
    idUploaded: true,
    photosUploaded: 3,
    card: CARD,
    anchorDay: 15,
    nextRenewal: "Nov 15",
    createdLabel: "Sep 2026",
    ...p,
  };
}

function seed(): State {
  const products: Product[] = [
    { id: "rx1", sku: "RX-TRET-025", name: "Tretinoin Cream 0.025%", type: "rx", priceCents: 6500, blurb: "Prescription retinoid for texture and fine lines.", education: "Apply a pea-sized amount to dry skin at night, 2 to 3 nights a week to start. Skip it the week of microneedling.", videoId: "aqz-KE-bpKQ", active: true, tone: "from-amber-100 to-orange-200" },
    { id: "rx2", sku: "RX-HQ-4", name: "Hydroquinone Cream 4%", type: "rx", priceCents: 7200, blurb: "Prescription brightener for uneven tone.", education: "Use on affected areas at night for up to 12 weeks at a time. Daily SPF is required while using it.", active: true, tone: "from-rose-100 to-pink-200" },
    { id: "rx3", sku: "RX-AZ-15", name: "Azelaic Acid Gel 15%", type: "rx", priceCents: 5800, blurb: "Prescription gel for redness and breakouts.", education: "Apply a thin layer twice daily after cleansing. Mild tingling at first is normal.", active: true, tone: "from-sky-100 to-cyan-200" },
    { id: "rx4", sku: "RX-CLIN-1", name: "Clindamycin Gel 1%", type: "rx", priceCents: 4400, blurb: "Prescription gel for breakout-prone skin.", education: "Apply once or twice daily to affected areas. Pair with a benzoyl-free moisturizer.", active: true, tone: "from-violet-100 to-purple-200" },
    { id: "n1", sku: "SP-CLEANSE", name: "Gentle Cleanser", type: "non_rx", priceCents: 3200, blurb: "Low-foam daily cleanser, 6 oz.", education: "Use morning and night with lukewarm water. Safe the day before and after microneedling.", active: true, tone: "from-emerald-100 to-teal-200" },
    { id: "n2", sku: "SP-HYDRA", name: "Hydrating Serum", type: "non_rx", priceCents: 5400, blurb: "Hyaluronic serum for post-needling recovery.", education: "Apply to damp skin after cleansing. Ideal immediately after microneedling.", videoId: "aqz-KE-bpKQ", active: true, tone: "from-blue-100 to-indigo-200" },
    { id: "n3", sku: "SP-SPF40", name: "Mineral SPF 40", type: "non_rx", priceCents: 3800, blurb: "Tinted zinc sunscreen, no white cast.", education: "Apply every morning and reapply every 2 hours in direct sun. Essential after any treatment.", active: true, tone: "from-yellow-100 to-amber-200" },
    { id: "n4", sku: "SP-BARRIER", name: "Barrier Repair Moisturizer", type: "non_rx", priceCents: 4600, blurb: "Ceramide cream to calm and protect.", education: "Use morning and night. Layer over prescription products to reduce dryness.", active: true, tone: "from-lime-100 to-green-200" },
    { id: "n5", sku: "SP-ROLLER", name: "Microneedling Roller 0.25mm", type: "non_rx", priceCents: 4200, blurb: "Home roller for your needling protocol.", education: "Sanitize before and after every use. Replace every 8 to 10 sessions. Read the microneedling rules first.", videoId: "aqz-KE-bpKQ", active: true, tone: "from-stone-100 to-neutral-300" },
    { id: "n6", sku: "SP-MASK", name: "Recovery Mask (4 pack)", type: "non_rx", priceCents: 3600, blurb: "Soothing sheet masks for post-treatment days.", education: "Leave on for 15 minutes, then pat in the remaining serum. Use up to twice a week.", active: true, tone: "from-teal-100 to-emerald-300" },
  ];

  const patients: Patient[] = [
    mkPatient({ id: "p-me", code: "#7F3A", name: "Taylor Reed", email: "taylor.reed@example.com", anchorDay: 31, nextRenewal: "Nov 30" }),
    mkPatient({ id: "p2", code: "#A21C", name: "Morgan Ellis", email: "morgan.ellis@example.com", onboarding: "pending_review", membership: "incomplete", practitionerId: null, createdLabel: "Today", nextRenewal: "-" }),
    mkPatient({ id: "p3", code: "#C9D0", name: "Casey Brooks", email: "casey.brooks@example.com", membershipType: "in_clinic", onboarding: "changes_requested", membership: "incomplete", practitionerId: null, idUploaded: false, photosUploaded: 0, changesReason: "Your photo ID was blurry. Please upload a clear photo of the front.", createdLabel: "Yesterday", nextRenewal: "-" }),
    mkPatient({ id: "p4", code: "#3B8E", name: "Riley Nguyen", email: "riley.nguyen@example.com" }),
    mkPatient({ id: "p5", code: "#D417", name: "Jamie Ortiz", email: "jamie.ortiz@example.com", membershipType: "in_clinic" }),
    mkPatient({ id: "p6", code: "#5E92", name: "Avery Stone", email: "avery.stone@example.com", membership: "past_due", graceDaysLeft: 3 }),
    mkPatient({ id: "p7", code: "#B60A", name: "Quinn Patel", email: "quinn.patel@example.com", membershipType: "in_clinic", membership: "paused" }),
    mkPatient({ id: "p8", code: "#E04F", name: "Drew Lin", email: "drew.lin@example.com", membership: "cancelled" }),
    mkPatient({ id: "p9", code: "#19CC", name: "Sam Hart", email: "sam.hart@example.com", practitionerId: "pr2" }),
  ];

  const checkIns: CheckIn[] = [
    { id: "c-me-now", patientId: "p-me", dueLabel: "Fri, Nov 6", opensLabel: "Mon, Nov 2", status: "scheduled" },
    { id: "c-me-old", patientId: "p-me", dueLabel: "Fri, Oct 23", opensLabel: "Mon, Oct 19", status: "reviewed", submittedLabel: "Oct 22", photos: 3, answers: { overall: "8", irritation: "No", products: "Cleanser, Serum, SPF", needling: "1", sun: "Minimal", notes: "Skin feels smoother. A little dry on my cheeks." } },
    { id: "c-p4", patientId: "p4", dueLabel: "Fri, Oct 30", opensLabel: "Mon, Oct 26", status: "submitted", submittedLabel: "Oct 29", photos: 3, answers: { overall: "6", irritation: "Yes", products: "Cleanser, Moisturizer, Retinoid", needling: "2", sun: "Moderate", notes: "Some peeling around my nose after the retinoid." } },
    { id: "c-p5", patientId: "p5", dueLabel: "Fri, Nov 6", opensLabel: "Mon, Nov 2", status: "scheduled" },
    { id: "c-p9", patientId: "p9", dueLabel: "Fri, Oct 23", opensLabel: "Mon, Oct 19", status: "missed" },
  ];

  const protocols: Protocol[] = [
    { id: "pr-me-1", patientId: "p-me", title: "Fall Reset Protocol", uploadedLabel: "Oct 24", checkInId: "c-me-old" },
  ];

  const messages: Message[] = [
    { id: "m1", patientId: "p-me", from: "practitioner", body: "Welcome Taylor! I reviewed your intake and your first protocol is on the way. Message me anytime.", at: "Oct 20, 9:12 AM", photos: 0 },
    { id: "m2", patientId: "p-me", from: "patient", body: "Thank you! Quick question: is it okay to use the serum the same night as my roller?", at: "Oct 21, 7:40 PM", photos: 0 },
    { id: "m3", patientId: "p-me", from: "practitioner", body: "Yes, the hydrating serum is ideal right after rolling. Skip any retinoid that night.", at: "Oct 22, 8:05 AM", photos: 0 },
    { id: "m4", patientId: "p4", from: "patient", body: "I have some peeling near my nose. Photo attached.", at: "Oct 29, 6:10 PM", photos: 1, overdue: true },
  ];

  return {
    meId: "p-me",
    scenario: "active",
    patients,
    practitioners: [
      { id: "pr1", name: "Sarah Whitfield, NP" },
      { id: "pr2", name: "Dr. Amy Chen" },
    ],
    checkIns,
    protocols,
    messages,
    emergencies: [{ id: "e1", patientId: "p9", body: "Sudden redness and swelling after my last session.", status: "open", at: "Today, 8:15 AM" }],
    tickets: [{ id: "t1", patientId: "p5", topic: "pharmacy_order", body: "My order has not shipped yet.", status: "open", at: "Yesterday" }],
    products,
    promos: [
      { id: "pm1", code: "WELCOME15", percentOff: 15, active: true, endsLabel: "Dec 31", redemptions: 12 },
      { id: "pm2", code: "SPRUCE25", percentOff: 25, active: true, endsLabel: "Nov 30", redemptions: 4 },
    ],
    prescriptions: [
      { id: "rxp1", patientId: "p-me", productId: "rx1", status: "active", fillsAllowed: 4, fillsUsed: 1, expiresLabel: "Oct 2027" },
      { id: "rxp2", patientId: "p-me", productId: "rx2", status: "exhausted", fillsAllowed: 3, fillsUsed: 3, expiresLabel: "Jun 2027" },
      { id: "rxp3", patientId: "p-me", productId: "rx3", status: "expired", fillsAllowed: 4, fillsUsed: 2, expiresLabel: "Aug 2026" },
    ],
    cart: [],
    orders: [
      {
        id: "ord-1001", patientId: "p-me", createdLabel: "Oct 12", status: "delivered",
        lines: [
          { productId: "n1", qty: 1, type: "non_rx", unitCents: 3200, discountCents: 640, rx: "not_rx" },
          { productId: "n3", qty: 1, type: "non_rx", unitCents: 3800, discountCents: 760, rx: "not_rx" },
        ],
        subtotalCents: 7000, discountCents: 1400, discountSource: "auto_tier", shippingCents: 895, doctorFeeCents: 0,
        totalCents: 6495, heldCents: 0, capturedCents: 6495, releasedCents: 0,
        shipments: [{ id: "s-1001", channel: "clinic_shipping", status: "delivered", carrier: "UPS", tracking: "1Z999AA10123456784" }],
      },
    ],
    visits: [],
    outbox: [],
  };
}

// ---------------------------------------------------------------- store core

const KEY = "arca_spruce_v1";
let state: State = seed();
let hydrated = false;
const listeners = new Set<() => void>();
const serverSeed = seed();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      // Merge over the seed so a stale saved shape can never crash on a missing key.
      if (parsed && Array.isArray(parsed.patients) && parsed.meId) state = { ...seed(), ...parsed } as State;
    }
  } catch {
    /* keep seed */
  }
}

// Re-read storage. Used by the ARCA review page, which drives the demo from
// outside the frame that may have mutated it.
export function reloadFromStorage() {
  hydrated = false;
  hydrate();
  listeners.forEach((l) => l());
}

function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
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

function mut(fn: (s: State) => Partial<State>) {
  hydrate();
  commit({ ...state, ...fn(state) });
}

let seq = 100;
const nid = (p: string) => `${p}${Date.now().toString(36)}${(seq++).toString(36)}`;
const note = (s: State, channel: OutboxItem["channel"], to: string, text: string): OutboxItem[] =>
  [{ id: nid("o"), channel, to, text, at: "Just now" }, ...s.outbox].slice(0, 30);
const patientOf = (s: State, id: string) => s.patients.find((p) => p.id === id);
const firstName = (full: string) => full.split(" ")[0];

// One place that decides an order's status, from its shipments. A held RX
// shipment keeps the order "awaiting_doctor" even if the clinic part shipped.
function deriveStatus(o: { shipments: Shipment[] }): OrderStatus {
  const live = o.shipments.filter((s) => s.status !== "cancelled");
  if (live.length === 0) return "cancelled";
  if (live.some((s) => s.status === "held_for_rx")) return "awaiting_doctor";
  if (live.every((s) => s.status === "delivered")) return "delivered";
  if (live.every((s) => s.status === "shipped" || s.status === "delivered")) return "shipped";
  if (live.some((s) => s.status === "shipped" || s.status === "delivered")) return "partially_shipped";
  return "processing";
}

export function useSpruce(): State {
  return useSyncExternalStore(subscribe, () => (hydrate(), state), () => serverSeed);
}

// The patient the portal is showing (the demo "logged in" user).
export function useMe(): Patient {
  const s = useSpruce();
  return s.patients.find((p) => p.id === s.meId) ?? s.patients[0];
}

export function practitionerName(s: State, id: string | null): string {
  return s.practitioners.find((p) => p.id === id)?.name ?? "Not assigned yet";
}

export function adminCounts(s: State) {
  const lastFrom = new Map<string, Message>();
  for (const m of s.messages) lastFrom.set(m.patientId, m);
  return {
    approvals: s.patients.filter((p) => p.onboarding === "pending_review").length,
    checkInsToReview: s.checkIns.filter((c) => c.status === "submitted").length,
    checkInsThisWeek: s.checkIns.filter((c) => c.status === "scheduled" || c.status === "open").length,
    openEmergencies: s.emergencies.filter((e) => e.status === "open").length,
    unanswered: [...lastFrom.values()].filter((m) => m.from === "patient").length,
    openTickets: s.tickets.filter((t) => t.status !== "closed").length,
    pastDue: s.patients.filter((p) => p.membership === "past_due").length,
    heldRx: s.orders.filter((o) => o.status === "awaiting_doctor").length,
  };
}

// ---------------------------------------------------------------- demo controls

export function resetDemo() {
  hydrate();
  commit(seed());
}

const SCENARIOS: Record<Scenario, Partial<Patient>> = {
  new: { membershipType: null, onboarding: "account_created", membership: "incomplete", consentSigned: false, idUploaded: false, photosUploaded: 0, card: null, practitionerId: null, changesReason: undefined, graceDaysLeft: undefined },
  pending: { membershipType: "virtual", onboarding: "pending_review", membership: "incomplete", consentSigned: true, idUploaded: true, photosUploaded: 3, card: CARD, practitionerId: null, changesReason: undefined, graceDaysLeft: undefined },
  changes: { membershipType: "virtual", onboarding: "changes_requested", membership: "incomplete", consentSigned: true, idUploaded: false, photosUploaded: 3, card: CARD, practitionerId: null, changesReason: "Your photo ID was blurry. Please upload a clear photo of the front.", graceDaysLeft: undefined },
  active: { membershipType: "virtual", onboarding: "approved", membership: "active", consentSigned: true, idUploaded: true, photosUploaded: 3, card: CARD, practitionerId: "pr1", changesReason: undefined, graceDaysLeft: undefined },
  past_due: { membershipType: "virtual", onboarding: "approved", membership: "past_due", consentSigned: true, idUploaded: true, photosUploaded: 3, card: CARD, practitionerId: "pr1", graceDaysLeft: 5 },
  paused: { membershipType: "virtual", onboarding: "approved", membership: "paused", consentSigned: true, idUploaded: true, photosUploaded: 3, card: CARD, practitionerId: "pr1", graceDaysLeft: undefined },
};

export function setScenario(sc: Scenario) {
  mut((s) => {
    const preApproval = sc === "new" || sc === "pending" || sc === "changes";
    let checkIns = s.checkIns;
    if (preApproval) checkIns = checkIns.filter((c) => !(c.patientId === s.meId && (c.status === "scheduled" || c.status === "open")));
    else if (!checkIns.some((c) => c.patientId === s.meId && (c.status === "scheduled" || c.status === "open"))) {
      checkIns = [{ id: nid("c"), patientId: s.meId, dueLabel: "Fri, Nov 6", opensLabel: "Mon, Nov 2", status: "scheduled" }, ...checkIns];
    }
    return { scenario: sc, checkIns, patients: s.patients.map((p) => (p.id === s.meId ? { ...p, ...SCENARIOS[sc] } : p)) };
  });
}

// "Time travel" to Monday: every scheduled check-in window opens.
export function advanceToMonday() {
  mut((s) => {
    const opening = s.checkIns.filter((c) => c.status === "scheduled");
    let outbox = s.outbox;
    for (const c of opening) {
      const p = patientOf(s, c.patientId);
      if (p) outbox = [{ id: nid("o"), channel: "email" as const, to: p.email, text: "Your check-in is open. Sign in to complete it before Friday.", at: "Just now" }, ...outbox];
    }
    return { checkIns: s.checkIns.map((c): CheckIn => (c.status === "scheduled" ? { ...c, status: "open" } : c)), outbox: outbox.slice(0, 30) };
  });
}

export function demoFailRenewal() {
  mut((s) => {
    const me = patientOf(s, s.meId);
    return {
      patients: s.patients.map((p) => (p.id === s.meId ? { ...p, membership: "past_due" as const, graceDaysLeft: 7 } : p)),
      outbox: me ? note(s, "email", me.email, "Your payment did not go through. Update your card to keep your membership active.") : s.outbox,
    };
  });
}

// ---------------------------------------------------------------- onboarding (patient)

export function updateMe(patch: Partial<Patient>) {
  mut((s) => ({ patients: s.patients.map((p) => (p.id === s.meId ? { ...p, ...patch } : p)) }));
}

// Returns false (and changes nothing) when a required step is missing.
export function submitOnboarding(): boolean {
  hydrate();
  const cur = patientOf(state, state.meId);
  if (!cur || !cur.membershipType || !cur.consentSigned || !cur.idUploaded || !cur.card) return false;
  if (cur.membershipType === "virtual" && cur.photosUploaded < 3) return false;
  mut((s) => {
    const me = patientOf(s, s.meId);
    return {
      patients: s.patients.map((p) => (p.id === s.meId ? { ...p, onboarding: "pending_review" as const, changesReason: undefined } : p)),
      outbox: me ? note(s, "slack", "#spruce-staff", `New patient waiting for approval. Patient ${me.code}. Open: /spruce/admin/approvals`) : s.outbox,
    };
  });
  return true;
}

// ---------------------------------------------------------------- approvals (staff)

export function approvePatient(id: string) {
  mut((s) => {
    const p = patientOf(s, id);
    if (!p || p.onboarding !== "pending_review") return {};
    const hasUpcoming = s.checkIns.some((c) => c.patientId === id && (c.status === "scheduled" || c.status === "open"));
    return {
      patients: s.patients.map((x) => (x.id === id ? { ...x, onboarding: "approved" as const, membership: "active" as const, practitionerId: x.practitionerId ?? "pr1", anchorDay: 31, nextRenewal: "Nov 30", changesReason: undefined } : x)),
      checkIns: hasUpcoming ? s.checkIns : [{ id: nid("c"), patientId: id, dueLabel: "Fri, Nov 6", opensLabel: "Mon, Nov 2", status: "scheduled" as const }, ...s.checkIns],
      outbox: note(s, "email", p.email, "Welcome to Spruce Micro. Your membership is active. Sign in to get started."),
    };
  });
}

export function requestChanges(id: string, reason: string) {
  mut((s) => {
    const p = patientOf(s, id);
    return {
      patients: s.patients.map((x) => (x.id === id ? { ...x, onboarding: "changes_requested" as const, changesReason: reason } : x)),
      outbox: p ? note(s, "email", p.email, "We need a couple of updates to finish your approval. Sign in to see what to fix.") : s.outbox,
    };
  });
}

export function rejectPatient(id: string) {
  mut((s) => ({ patients: s.patients.map((x) => (x.id === id ? { ...x, onboarding: "rejected" as const } : x)) }));
}

export function createPatient(input: { name: string; email: string; membershipType: MembershipType }): string {
  const id = nid("p");
  mut((s) => ({
    patients: [
      { id, code: `#${id.slice(-4).toUpperCase()}`, name: input.name, email: input.email, state: "IL", membershipType: input.membershipType, onboarding: "account_created", membership: "incomplete", practitionerId: null, consentSigned: false, idUploaded: false, photosUploaded: 0, card: null, anchorDay: 0, nextRenewal: "-", createdLabel: "Today" },
      ...s.patients,
    ],
    outbox: note(s, "email", input.email, "Your Spruce Micro account is ready. Sign in with the temporary passcode 482913 and choose a new password."),
  }));
  return id;
}

export function assignPractitioner(patientId: string, practitionerId: string) {
  mut((s) => ({ patients: s.patients.map((p) => (p.id === patientId ? { ...p, practitionerId } : p)) }));
}

export function setMembershipType(patientId: string, membershipType: MembershipType) {
  mut((s) => ({ patients: s.patients.map((p) => (p.id === patientId ? { ...p, membershipType } : p)) }));
}

// An active member keeps full access until the period ends (cancelAtPeriodEnd).
// Past due or paused members have nothing left to protect, so they end now.
export function cancelMembership(patientId: string) {
  mut((s) => ({
    patients: s.patients.map((p) =>
      p.id !== patientId ? p : p.membership === "active" ? { ...p, cancelAtPeriodEnd: true } : { ...p, membership: "cancelled" as const, graceDaysLeft: undefined },
    ),
  }));
}

export function resumeMembership(patientId: string) {
  mut((s) => ({ patients: s.patients.map((p) => (p.id === patientId ? { ...p, cancelAtPeriodEnd: false } : p)) }));
}

export function reactivateMembership(patientId: string) {
  mut((s) => ({ patients: s.patients.map((p) => (p.id === patientId ? { ...p, membership: "active" as const, graceDaysLeft: undefined, cancelAtPeriodEnd: false } : p)) }));
}

// ---------------------------------------------------------------- billing (patient)

export function updateCard(card: Card) {
  mut((s) => ({
    patients: s.patients.map((p) =>
      p.id === s.meId
        ? { ...p, card, membership: p.membership === "past_due" || p.membership === "paused" || p.membership === "cancelled" ? ("active" as const) : p.membership, graceDaysLeft: undefined }
        : p,
    ),
  }));
}

// ---------------------------------------------------------------- check-ins and protocols

export function submitCheckIn(id: string, answers: Record<string, string>, photos: number) {
  mut((s) => {
    const c = s.checkIns.find((x) => x.id === id);
    const p = c ? patientOf(s, c.patientId) : undefined;
    return {
      checkIns: s.checkIns.map((x): CheckIn => (x.id === id ? { ...x, status: "submitted", answers, photos, submittedLabel: "Just now" } : x)),
      outbox: p ? note(s, "slack", "#spruce-staff", `New check-in submitted. Patient ${p.code}. Open: /spruce/admin/check-ins`) : s.outbox,
    };
  });
}

export function scheduleCheckIn(patientId: string, dueLabel: string, opensLabel: string) {
  mut((s) => {
    const p = patientOf(s, patientId);
    const dup = s.checkIns.some((c) => c.patientId === patientId && c.dueLabel === dueLabel && c.status !== "cancelled");
    if (!p || p.onboarding !== "approved" || dup) return {};
    return { checkIns: [{ id: nid("c"), patientId, dueLabel, opensLabel, status: "scheduled" as const }, ...s.checkIns] };
  });
}

export function cancelCheckIn(id: string) {
  mut((s) => ({ checkIns: s.checkIns.map((c): CheckIn => (c.id === id ? { ...c, status: "cancelled" } : c)) }));
}

export function uploadProtocol(patientId: string, title: string, checkInId?: string) {
  mut((s) => {
    const p = patientOf(s, patientId);
    return {
      protocols: [{ id: nid("pr"), patientId, title, uploadedLabel: "Just now", checkInId }, ...s.protocols],
      checkIns: checkInId ? s.checkIns.map((c): CheckIn => (c.id === checkInId ? { ...c, status: "reviewed" } : c)) : s.checkIns,
      outbox: p ? note(s, "email", p.email, "Your new protocol is ready. Sign in to view it.") : s.outbox,
    };
  });
}

// ---------------------------------------------------------------- messages, emergency, support

export function sendMessage(patientId: string, from: "patient" | "practitioner", body: string, photos = 0) {
  mut((s) => {
    const p = patientOf(s, patientId);
    const pract = s.practitioners.find((x) => x.id === p?.practitionerId);
    return {
      messages: [...s.messages, { id: nid("m"), patientId, from, body, at: "Just now", photos }],
      outbox: from === "patient" && p ? note(s, "slack", "#spruce-staff", `New patient message for ${firstName(pract?.name.replace("Dr. ", "") ?? "the team")}. Patient ${p.code}. Open: /spruce/admin/inbox`) : s.outbox,
    };
  });
}

export function createEmergency(body: string) {
  mut((s) => {
    const me = patientOf(s, s.meId);
    return {
      emergencies: [{ id: nid("e"), patientId: s.meId, body, status: "open" as const, at: "Just now" }, ...s.emergencies],
      outbox: me ? note(s, "slack", "#spruce-staff", `EMERGENCY request from patient ${me.code}. Emergency managers please respond. Open: /spruce/admin/inbox`) : s.outbox,
    };
  });
}

export function setEmergencyStatus(id: string, status: Emergency["status"]) {
  mut((s) => ({ emergencies: s.emergencies.map((e) => (e.id === id ? { ...e, status } : e)) }));
}

export function createTicket(topic: Ticket["topic"], body: string, orderId?: string) {
  mut((s) => ({ tickets: [{ id: nid("t"), patientId: s.meId, topic, body, orderId, status: "open" as const, at: "Just now" }, ...s.tickets] }));
}

export function setTicketStatus(id: string, status: Ticket["status"]) {
  mut((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, status } : t)) }));
}

// ---------------------------------------------------------------- catalog and promos (staff)

// Hiding or deleting a product also pulls it out of any open cart.
export function upsertProduct(p: Product) {
  mut((s) => ({
    products: s.products.some((x) => x.id === p.id) ? s.products.map((x) => (x.id === p.id ? p : x)) : [...s.products, p],
    cart: p.active ? s.cart : s.cart.filter((l) => l.productId !== p.id),
  }));
}

export function removeProduct(id: string) {
  mut((s) => ({ products: s.products.filter((p) => p.id !== id), cart: s.cart.filter((l) => l.productId !== id) }));
}

export function newProductId(): string {
  return nid("prd");
}

export function upsertPromo(p: Promo) {
  mut((s) => ({ promos: s.promos.some((x) => x.id === p.id) ? s.promos.map((x) => (x.id === p.id ? p : x)) : [p, ...s.promos] }));
}

export function removePromo(id: string) {
  mut((s) => ({ promos: s.promos.filter((p) => p.id !== id) }));
}

export function newPromoId(): string {
  return nid("pm");
}

// ---------------------------------------------------------------- cart and checkout (patient)

export function addToCart(productId: string, qty = 1) {
  mut((s) => {
    const has = s.cart.find((l) => l.productId === productId);
    return { cart: has ? s.cart.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l)) : [...s.cart, { productId, qty }] };
  });
}

export function setCartQty(productId: string, qty: number) {
  mut((s) => ({ cart: qty <= 0 ? s.cart.filter((l) => l.productId !== productId) : s.cart.map((l) => (l.productId === productId ? { ...l, qty } : l)) }));
}

export function clearCart() {
  mut(() => ({ cart: [] }));
}

// Splits the cart into clinic (non-RX) and pharmacy (RX) shipments, checks RX
// coverage, and creates ONE doctor visit (one fee) when anything needs it.
export function placeOrder(opts: { discount: "tier" | "promo"; promoCode?: string }): { orderId: string; visitId?: string } | null {
  hydrate();
  const s = state;
  if (s.cart.length === 0) return null;
  const me = patientOf(s, s.meId);
  if (!me) return null;

  // Hidden or deleted products can never be ordered, even from an old cart.
  const base = s.cart.flatMap((l) => {
    const p = s.products.find((x) => x.id === l.productId);
    return p && p.active ? [{ productId: p.id, qty: l.qty, type: p.type, unitCents: p.priceCents }] : [];
  });
  if (base.length === 0) return null;
  const subtotal = priceCart(base, 0).subtotalCents;
  const promo = opts.discount === "promo" ? s.promos.find((x) => x.active && x.code.toLowerCase() === (opts.promoCode ?? "").trim().toLowerCase()) : undefined;
  const pct = promo ? promo.percentOff : tierPct(subtotal);
  const priced = priceCart(base, pct);
  const rx = s.prescriptions.filter((r) => r.patientId === me.id);

  const lines: OrderLine[] = priced.lines.map((l) => ({
    productId: l.productId,
    qty: l.qty,
    type: l.type,
    unitCents: l.unitCents,
    discountCents: l.discountCents,
    rx: l.type === "non_rx" ? "not_rx" : rxCoverage(rx, l.productId) === "covered" ? "covered" : "needs_visit",
  }));

  const needsVisit = lines.some((l) => l.rx === "needs_visit");
  const types = lines.map((l) => l.type);
  const shippingCents = shippingFor(types);
  const doctorFeeCents = needsVisit ? SETTINGS.doctorVisitFeeCents : 0;
  const totalCents = priced.subtotalCents - priced.discountCents + shippingCents + doctorFeeCents;
  const heldCents = priced.lines.reduce((a, l, i) => (lines[i].rx === "needs_visit" ? a + l.lineCents - l.discountCents : a), 0);

  const orderId = nid("ord");
  const visitId = needsVisit ? nid("v") : undefined;

  // Covered RX ships right away. Only the lines that need a visit are held,
  // so a declined visit can never take covered items down with it.
  const shipments: Shipment[] = [];
  if (types.includes("non_rx")) shipments.push({ id: nid("s"), channel: "clinic_shipping", status: "submitted" });
  if (lines.some((l) => l.rx === "covered")) shipments.push({ id: nid("s"), channel: "pharmacy", status: "submitted" });
  if (needsVisit) shipments.push({ id: nid("s"), channel: "pharmacy", status: "held_for_rx" });

  const order: Order = {
    id: orderId,
    patientId: me.id,
    createdLabel: "Today",
    status: deriveStatus({ shipments }),
    lines,
    subtotalCents: priced.subtotalCents,
    discountCents: priced.discountCents,
    discountSource: promo ? "promo" : "auto_tier",
    promoCode: promo?.code,
    shippingCents,
    doctorFeeCents,
    totalCents,
    heldCents,
    capturedCents: totalCents - heldCents,
    releasedCents: 0,
    shipments,
    visitId,
  };
  const visit: Visit | undefined = visitId
    ? { id: visitId, patientId: me.id, orderId, type: visitTypeFor(me.state), status: "awaiting_patient", feeCents: doctorFeeCents, productIds: lines.filter((l) => l.rx === "needs_visit").map((l) => l.productId) }
    : undefined;

  mut((st) => ({
    orders: [order, ...st.orders],
    visits: visit ? [visit, ...st.visits] : st.visits,
    cart: [],
    // Every covered RX fill uses up one fill; the last one marks it exhausted.
    prescriptions: st.prescriptions.map((r) => {
      const usedNow = r.patientId === me.id && r.status === "active" && r.fillsUsed < r.fillsAllowed && lines.some((l) => l.rx === "covered" && l.productId === r.productId);
      if (!usedNow) return r;
      const fillsUsed = r.fillsUsed + 1;
      return { ...r, fillsUsed, status: fillsUsed >= r.fillsAllowed ? ("exhausted" as const) : r.status };
    }),
    promos: promo ? st.promos.map((p) => (p.id === promo.id ? { ...p, redemptions: p.redemptions + 1 } : p)) : st.promos,
    outbox: needsVisit ? note(st, "email", me.email, "Your order is placed and needs one more step. Sign in to continue.") : st.outbox,
  }));
  return { orderId, visitId };
}

// ---------------------------------------------------------------- doctor visits and fulfillment

export function submitVisit(visitId: string, data: { answers?: Record<string, string>; videoName?: string }) {
  mut((s) => ({ visits: s.visits.map((v): Visit => (v.id === visitId ? { ...v, status: "in_review", answers: data.answers, videoName: data.videoName } : v)) }));
}

// Mock doctor network decision. Approval creates prescriptions and releases
// the held RX capture; a decline releases the held amount (visit fee is kept).
export function decideVisit(visitId: string, decision: "approved" | "declined") {
  mut((s) => {
    const v = s.visits.find((x) => x.id === visitId);
    const order = v ? s.orders.find((o) => o.id === v.orderId) : undefined;
    const p = v ? patientOf(s, v.patientId) : undefined;
    // A decision only applies once, and only to a visit the patient has submitted.
    if (!v || !order || v.status !== "in_review") return {};
    const approved = decision === "approved";
    const lines: OrderLine[] = order.lines.map((l) => (l.rx === "needs_visit" ? { ...l, rx: approved ? "approved" : "declined" } : l));
    // Only the held shipment changes. Covered RX and clinic items are untouched.
    const shipments = order.shipments.map((sh): Shipment => (sh.status === "held_for_rx" ? { ...sh, status: approved ? "submitted" : "cancelled" } : sh));
    const nextOrder: Order = {
      ...order,
      lines,
      shipments,
      status: deriveStatus({ shipments }),
      capturedCents: approved ? order.totalCents : order.capturedCents,
      releasedCents: approved ? 0 : order.heldCents,
    };
    const newRx: Prescription[] = approved
      ? v.productIds.map((productId) => ({ id: nid("rxp"), patientId: v.patientId, productId, status: "active" as const, fillsAllowed: 4, fillsUsed: 1, expiresLabel: "Oct 2027" }))
      : [];
    return {
      visits: s.visits.map((x): Visit => (x.id === visitId ? { ...x, status: approved ? "approved" : "declined" } : x)),
      orders: s.orders.map((o) => (o.id === order.id ? nextOrder : o)),
      prescriptions: [...newRx, ...s.prescriptions.filter((r) => !(approved && r.patientId === v.patientId && v.productIds.includes(r.productId)))],
      outbox: p ? note(s, "email", p.email, approved ? "Your doctor visit is complete. Sign in to see your order update." : "Your doctor visit has been reviewed. Sign in to see the update.") : s.outbox,
    };
  });
}

// Mock fulfillment: everything submitted ships with tracking.
export function shipPending() {
  mut((s) => {
    let outbox = s.outbox;
    const orders = s.orders.map((o) => {
      if (!o.shipments.some((sh) => sh.status === "submitted")) return o;
      const shipments = o.shipments.map((sh): Shipment =>
        sh.status === "submitted" ? { ...sh, status: "shipped", carrier: sh.channel === "pharmacy" ? "FedEx" : "UPS", tracking: `1Z${Math.floor(1e9 + Math.random() * 9e9)}` } : sh,
      );
      const p = patientOf(s, o.patientId);
      if (p) outbox = [{ id: nid("o"), channel: "email" as const, to: p.email, text: "Part of your order has shipped. Sign in for tracking.", at: "Just now" }, ...outbox];
      return { ...o, shipments, status: deriveStatus({ shipments }) };
    });
    return { orders, outbox: outbox.slice(0, 30) };
  });
}
