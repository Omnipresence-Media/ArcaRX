// Protocol program content — skincare & clinical regimens, supplements, and
// dosing schedules a provider can assign to a coaching client.

export type RegimenStep = {
  step: number;
  time: "AM" | "PM" | "Weekly";
  product: string;
  detail: string;
};

export type SupplementItem = {
  name: string;
  dose: string;
  timing: string;
};

export type DoseEntry = {
  med: string;
  schedule: string;
  route: string;
};

export type ProtocolTemplate = {
  id: string;
  name: string;
  category: "Skincare" | "HRT" | "Weight loss" | "Longevity";
  summary: string;
  durationWeeks: number;
  regimen: RegimenStep[];
  supplements: SupplementItem[];
  dosing: DoseEntry[];
};

export const PROTOCOL_LIBRARY: ProtocolTemplate[] = [
  {
    id: "pr-skin-brighten",
    name: "Brightening & Anti-Aging Skincare",
    category: "Skincare",
    summary: "Retinoid-led evening routine with morning antioxidant + SPF for tone, texture, and fine lines.",
    durationWeeks: 12,
    regimen: [
      { step: 1, time: "AM", product: "Gentle gel cleanser", detail: "Lukewarm water, pat dry." },
      { step: 2, time: "AM", product: "Vitamin C 15% serum", detail: "3-4 drops, full face and neck." },
      { step: 3, time: "AM", product: "Moisturizer + SPF 30+", detail: "Reapply midday if outdoors." },
      { step: 4, time: "PM", product: "Double cleanse", detail: "Oil cleanser then gel cleanser." },
      { step: 5, time: "PM", product: "Tretinoin 0.025%", detail: "Pea-sized, 3x/week to start, titrate up." },
      { step: 6, time: "PM", product: "Ceramide moisturizer", detail: "Buffer over retinoid to reduce irritation." },
    ],
    supplements: [
      { name: "Collagen peptides", dose: "10 g", timing: "Daily, AM" },
      { name: "Omega-3 (EPA/DHA)", dose: "2 g", timing: "With food" },
      { name: "Zinc", dose: "15 mg", timing: "Daily" },
    ],
    dosing: [],
  },
  {
    id: "pr-hrt-female",
    name: "Female HRT Optimization",
    category: "HRT",
    summary: "Estradiol + progesterone balance with symptom tracking and quarterly labs.",
    durationWeeks: 24,
    regimen: [
      { step: 1, time: "AM", product: "Estradiol patch", detail: "Apply to lower abdomen, rotate sites." },
      { step: 2, time: "PM", product: "Progesterone capsule", detail: "Take at bedtime for sleep benefit." },
      { step: 3, time: "Weekly", product: "Symptom check-in", detail: "Log energy, sleep, mood, hot flashes." },
    ],
    supplements: [
      { name: "Vitamin D3", dose: "5,000 IU", timing: "Daily with fat" },
      { name: "Magnesium glycinate", dose: "300 mg", timing: "PM" },
      { name: "Vitamin B-complex", dose: "1 cap", timing: "AM" },
    ],
    dosing: [
      { med: "Estradiol", schedule: "0.05 mg/day patch, change 2x/week", route: "Transdermal" },
      { med: "Progesterone", schedule: "100 mg nightly", route: "Oral" },
    ],
  },
  {
    id: "pr-glp1-weightloss",
    name: "GLP-1 Weight Management",
    category: "Weight loss",
    summary: "Semaglutide titration with protein-forward nutrition guardrails and side-effect management.",
    durationWeeks: 16,
    regimen: [
      { step: 1, time: "Weekly", product: "Semaglutide injection", detail: "Same day each week, rotate injection site." },
      { step: 2, time: "AM", product: "Protein target", detail: "Aim 100-130 g/day to preserve lean mass." },
      { step: 3, time: "Weekly", product: "Weight + waist log", detail: "Same conditions each week." },
    ],
    supplements: [
      { name: "Electrolytes", dose: "1 serving", timing: "Daily" },
      { name: "Fiber (psyllium)", dose: "5 g", timing: "AM with water" },
      { name: "Vitamin B12", dose: "1,000 mcg", timing: "Weekly" },
    ],
    dosing: [
      { med: "Semaglutide", schedule: "0.25 mg wk 1-4 → 0.5 mg wk 5-8 → titrate to effect", route: "Subcutaneous" },
    ],
  },
  {
    id: "pr-longevity",
    name: "Longevity & Recovery",
    category: "Longevity",
    summary: "Foundational supplement stack with sleep and recovery emphasis.",
    durationWeeks: 12,
    regimen: [
      { step: 1, time: "AM", product: "Creatine", detail: "5 g in water or shake." },
      { step: 2, time: "PM", product: "Sleep routine", detail: "Screens off 60 min before bed." },
    ],
    supplements: [
      { name: "Creatine monohydrate", dose: "5 g", timing: "Daily" },
      { name: "Omega-3", dose: "2 g", timing: "With food" },
      { name: "Magnesium threonate", dose: "144 mg", timing: "PM" },
      { name: "Vitamin D3 + K2", dose: "5,000 IU / 100 mcg", timing: "AM" },
    ],
    dosing: [],
  },
];

// Default assigned protocol per client id (fallback shown when Protocol is
// enabled but nothing chosen yet). Keyed loosely; falls back to first.
export const DEFAULT_ASSIGNED: Record<string, string> = {
  c1: "pr-glp1-weightloss",
  c4: "pr-glp1-weightloss",
  c7: "pr-glp1-weightloss",
  c9: "pr-skin-brighten",
  c11: "pr-hrt-female",
  c14: "pr-skin-brighten",
};

export function protocolFor(clientId: string): ProtocolTemplate {
  const id = DEFAULT_ASSIGNED[clientId] ?? "pr-skin-brighten";
  return PROTOCOL_LIBRARY.find((p) => p.id === id) ?? PROTOCOL_LIBRARY[0];
}
