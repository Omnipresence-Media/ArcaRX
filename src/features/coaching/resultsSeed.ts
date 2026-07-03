import { type FitClient } from "@/lib/fit-seed";

// Builds a per-client "results report" dataset: body-composition and clinical
// biomarker deltas plus measurements. Deterministic from the client's own
// data + adherence so every client has a credible, non-random report.

export type Biomarker = {
  label: string;
  before: number;
  current: number;
  unit: string;
  betterWhen: "lower" | "higher";
  category: "Body" | "Clinical";
};

export type Measurement = { site: string; start: number; current: number; unit: string };

export type ClientResults = {
  weeks: number;
  biomarkers: Biomarker[];
  measurements: Measurement[];
  summary: string;
  beforePhoto: string;
  afterPhoto: string;
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export function buildResults(c: FitClient): ClientResults {
  const weeks = Math.max(c.startedWeeksAgo, 1);
  // Adherence scales the magnitude of improvement (0.6–1.0).
  const factor = 0.6 + (c.adherence / 100) * 0.4;

  const startW = c.startWeight;
  const curW = c.currentWeight;

  // Body composition, partly derived from real weight data.
  const bfBefore = 26;
  const bfCurrent = round1(bfBefore - 6 * factor);
  const waistBefore = 36;
  const waistCurrent = round1(waistBefore - 4 * factor);
  const leanBefore = Math.round(startW * 0.62);
  const leanCurrent = Math.round(curW * 0.68);

  const biomarkers: Biomarker[] = [
    { label: "Weight", before: startW, current: curW, unit: "lb", betterWhen: "lower", category: "Body" },
    { label: "Body fat", before: bfBefore, current: bfCurrent, unit: "%", betterWhen: "lower", category: "Body" },
    { label: "Waist", before: waistBefore, current: waistCurrent, unit: "in", betterWhen: "lower", category: "Body" },
    { label: "Lean mass", before: leanBefore, current: leanCurrent, unit: "lb", betterWhen: "higher", category: "Body" },
    // Clinical markers — the coaching moat: biology, not just the scale.
    { label: "A1c", before: 5.9, current: round1(5.9 - 0.6 * factor), unit: "%", betterWhen: "lower", category: "Clinical" },
    { label: "LDL cholesterol", before: 141, current: Math.round(141 - 34 * factor), unit: "mg/dL", betterWhen: "lower", category: "Clinical" },
    { label: "Resting HR", before: 74, current: Math.round(74 - 13 * factor), unit: "bpm", betterWhen: "lower", category: "Clinical" },
    { label: "Vitamin D", before: 24, current: Math.round(24 + 28 * factor), unit: "ng/mL", betterWhen: "higher", category: "Clinical" },
  ];

  const measurements: Measurement[] = [
    { site: "Chest", start: 42, current: round1(42 - 2.5 * factor), unit: "in" },
    { site: "Waist", start: waistBefore, current: waistCurrent, unit: "in" },
    { site: "Hips", start: 40, current: round1(40 - 2 * factor), unit: "in" },
    { site: "Arm", start: 14, current: round1(14 + 0.8 * factor), unit: "in" },
    { site: "Thigh", start: 24, current: round1(24 - 1.2 * factor), unit: "in" },
  ];

  const lbLost = startW - curW;
  const summary =
    lbLost > 0
      ? `Over ${weeks} weeks, ${c.name.split(" ")[0]} dropped ${round1(lbLost)} lb and ${round1(bfBefore - bfCurrent)}% body fat while improving every clinical marker — A1c, cholesterol, resting heart rate, and vitamin D all moved in the right direction.`
      : `Over ${weeks} weeks, ${c.name.split(" ")[0]} added ${round1(curW - startW)} lb of quality mass with body fat and clinical markers improving across the board.`;

  return {
    weeks,
    biomarkers,
    measurements,
    summary,
    beforePhoto: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=480&q=70",
    afterPhoto: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=480&q=70",
  };
}

// Percentage change with sign relative to "before".
export function deltaPct(b: Biomarker): number {
  if (b.before === 0) return 0;
  return Math.round(((b.current - b.before) / b.before) * 100);
}

export function improved(b: Biomarker): boolean {
  return b.betterWhen === "lower" ? b.current < b.before : b.current > b.before;
}
