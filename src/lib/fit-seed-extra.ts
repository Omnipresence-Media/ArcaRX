// Arca Fit - extended prototype seed (intelligence, programming, nutrition, business)
import { fitClients } from "./fit-seed";

// ---------- 1. Risk & intelligence ----------
export type RiskLevel = "Low" | "Watch" | "At-risk";

function scoreFor(id: string, adherence: number, lastCheckIn: string): { score: number; level: RiskLevel } {
  const stale = lastCheckIn.includes("d ago") ? parseInt(lastCheckIn) || 0 : 0;
  const seed = id.charCodeAt(1) || 0;
  const raw = Math.max(0, Math.min(100, 100 - adherence + stale * 6 + (seed % 12)));
  const level: RiskLevel = raw < 22 ? "Low" : raw < 50 ? "Watch" : "At-risk";
  return { score: raw, level };
}

export const clientRisk = Object.fromEntries(
  fitClients.map((c) => [c.id, scoreFor(c.id, c.adherence, c.lastCheckIn)])
);

export const interventionQueue = fitClients
  .map((c) => ({ client: c, ...clientRisk[c.id] }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 6)
  .map((row, i) => ({
    ...row,
    reason: [
      "Missed 2 sessions this week",
      "Weight stalled 14 days",
      "Sleep average dropped to 5.8h",
      "No photos uploaded for cycle",
      "Skipped weekly check-in",
      "Sentiment trending negative",
    ][i % 6],
    nudge: [
      "Quick form-check video?",
      "Refeed day this Saturday - sound good?",
      "Let's regroup on a 15-min call.",
      "Pick a new playlist + send sweaty selfie 💪",
      "Need me to adjust the program?",
      "Proud of you - keep the streak.",
    ][i % 6],
  }));

// ---------- 2. Habits ----------
export const habitTypes = ["Sleep", "Steps", "Stress", "Soreness", "Hydration"] as const;
export type HabitType = (typeof habitTypes)[number];

export const habitMatrix = habitTypes.map((h, hi) => ({
  habit: h,
  // 8 weeks of weekly average, normalized 0-100 (higher = better; stress/soreness inverted)
  weeks: Array.from({ length: 8 }, (_, w) => {
    const base = [78, 64, 70, 58, 82][hi];
    return Math.max(30, Math.min(100, Math.round(base + Math.sin(w * 0.9 + hi) * 14)));
  }),
}));

export const habitCorrelations = [
  { insight: "Adherence drops 18% on weeks with <6.5h sleep", tone: "neg" as const },
  { insight: "Steps >9k correlates with +12% session completion", tone: "pos" as const },
  { insight: "Soreness spikes follow heavy lower days by 36h", tone: "neutral" as const },
];

// ---------- 3. 1RM history ----------
export type OneRMLift = "Squat" | "Bench" | "Deadlift" | "OHP";
export const oneRMHistory: { lift: OneRMLift; series: { week: string; weight: number }[] }[] = [
  { lift: "Squat",    series: Array.from({ length: 12 }, (_, i) => ({ week: `W${i + 1}`, weight: 315 + i * 4 + Math.round(Math.sin(i) * 3) })) },
  { lift: "Bench",    series: Array.from({ length: 12 }, (_, i) => ({ week: `W${i + 1}`, weight: 225 + i * 2.5 + Math.round(Math.sin(i + 1) * 2) })) },
  { lift: "Deadlift", series: Array.from({ length: 12 }, (_, i) => ({ week: `W${i + 1}`, weight: 405 + i * 5 + Math.round(Math.sin(i + 2) * 4) })) },
  { lift: "OHP",      series: Array.from({ length: 12 }, (_, i) => ({ week: `W${i + 1}`, weight: 135 + i * 1.5 + Math.round(Math.sin(i + 3) * 1.5) })) },
];

// ---------- 4. Volume heatmap (muscle × week) ----------
export const muscleGroups = ["Chest","Back","Quads","Hamstrings","Glutes","Shoulders","Arms","Core"] as const;
export const volumeHeatmap = muscleGroups.map((m, mi) => ({
  muscle: m,
  weeks: Array.from({ length: 8 }, (_, w) => {
    const base = [14, 16, 18, 12, 14, 10, 12, 8][mi];
    const deload = w === 3 || w === 7 ? 0.55 : 1;
    return Math.round((base + Math.sin(w + mi) * 2) * deload);
  }),
}));

// ---------- 5. Substitutions ----------
export const exerciseSubstitutions: Record<string, { name: string; equipment: string; reason: string }[]> = {
  "Barbell Bench Press": [
    { name: "Dumbbell Bench Press",  equipment: "Dumbbell", reason: "Shoulder-friendly · same pattern" },
    { name: "Machine Chest Press",   equipment: "Machine",  reason: "Fixed path · lower CNS cost" },
    { name: "Push-Up (weighted)",    equipment: "Bodyweight", reason: "No equipment · scapular freedom" },
  ],
  "Back Squat": [
    { name: "Front Squat",       equipment: "Barbell",  reason: "More upright · easier on low back" },
    { name: "Hack Squat",        equipment: "Machine",  reason: "Quad-biased · stabilized" },
    { name: "Goblet Squat",      equipment: "Dumbbell", reason: "Teaching variation · light load" },
  ],
  "Romanian Deadlift": [
    { name: "Single-Leg RDL",    equipment: "Dumbbell", reason: "Unilateral · stability work" },
    { name: "45° Back Extension",equipment: "Machine",  reason: "Pure hip hinge · less spinal load" },
    { name: "Cable Pull-Through",equipment: "Cable",    reason: "Light · pattern reinforcement" },
  ],
};

// ---------- 6. Program templates ----------
export const programTemplates = [
  { id: "t1", name: "Hybrid Athlete · 12wk", tag: "Hybrid",      sessions: 5, focus: "Lift + run + zone-2",    uses: 23 },
  { id: "t2", name: "GLP-1 Recomp · 16wk",   tag: "GLP-1",       sessions: 4, focus: "Protein protect + LISS", uses: 41 },
  { id: "t3", name: "Prenatal Strength",     tag: "Prenatal",    sessions: 3, focus: "Pelvic floor safe",      uses: 12 },
  { id: "t4", name: "5/3/1 Power",           tag: "Strength",    sessions: 4, focus: "Top-set + jokers",       uses: 67 },
  { id: "t5", name: "Glute Hypertrophy",     tag: "Hypertrophy", sessions: 4, focus: "Hip thrust priority",    uses: 89 },
  { id: "t6", name: "Marathon Build",        tag: "Endurance",   sessions: 6, focus: "Base + tempo + long",    uses: 18 },
];

// ---------- 7. Nutrition ----------
export const supplementProtocol = [
  { time: "AM",    items: ["Creatine 5g", "Vitamin D3 4000 IU", "Omega-3 2g"] },
  { time: "Pre",   items: ["Caffeine 200mg", "Beta-alanine 3g", "Citrulline 6g"] },
  { time: "Intra", items: ["EAAs 10g", "Electrolytes"] },
  { time: "Post",  items: ["Whey isolate 40g", "Carbs 60g"] },
  { time: "PM",    items: ["Magnesium glycinate 400mg", "Casein 30g"] },
];

export const recipeLibrary = [
  { id: "r1", name: "High-Protein Breakfast Bowl", kcal: 520, p: 48, c: 52, f: 14, cost: 3.20, servings: 1, aisle: "Dairy/Eggs" },
  { id: "r2", name: "Tuna Power Wrap",             kcal: 420, p: 38, c: 36, f: 14, cost: 2.10, servings: 1, aisle: "Pantry" },
  { id: "r3", name: "Steak & Sweet Potato",        kcal: 680, p: 52, c: 58, f: 22, cost: 6.80, servings: 1, aisle: "Meat" },
  { id: "r4", name: "Greek Chicken Bowl",          kcal: 590, p: 58, c: 48, f: 18, cost: 4.40, servings: 1, aisle: "Meat" },
  { id: "r5", name: "Overnight Oats · PB Banana",  kcal: 460, p: 28, c: 62, f: 12, cost: 1.80, servings: 1, aisle: "Pantry" },
  { id: "r6", name: "Salmon Teriyaki + Rice",      kcal: 640, p: 46, c: 64, f: 18, cost: 7.20, servings: 1, aisle: "Seafood" },
];

export const groceryList = [
  { aisle: "Produce",   items: ["Spinach 200g", "Blueberries 300g", "Bananas x6", "Sweet potatoes 1kg", "Asparagus 400g"] },
  { aisle: "Meat",      items: ["Chicken breast 1.4kg", "Sirloin steak 600g", "Ground turkey 500g"] },
  { aisle: "Seafood",   items: ["Wild salmon 600g", "Tuna packs x4"] },
  { aisle: "Dairy/Eggs",items: ["Egg whites 1L", "Whole eggs x18", "Greek yogurt 0% 1kg", "Cottage cheese 500g"] },
  { aisle: "Pantry",    items: ["Jasmine rice 2kg", "Steel-cut oats 1kg", "Whey isolate", "Olive oil EVOO"] },
];

// ---------- 8. Business ops ----------
export const businessKpis = {
  mrr: 18960,
  mrrSeries: [12.4, 13.1, 13.8, 14.6, 15.1, 15.9, 16.7, 17.3, 17.9, 18.4, 18.6, 18.96],
  ltv: 2840,
  churnPct: 4.2,
  trialConvPct: 38,
  arpu: 403,
  activeSubs: 47,
};

export const packageCatalog = [
  { id: "pk1", name: "1:1 Coaching · Monthly",      price: 399, period: "/mo",   includes: ["Custom programming","Weekly video reviews","Unlimited messaging"], active: 22 },
  { id: "pk2", name: "Hybrid · 8-Pack",              price: 720, period: "/8wk", includes: ["8 sessions","Macro plan","2 form reviews"],                     active: 14 },
  { id: "pk3", name: "Online Group · Quarterly",     price: 297, period: "/3mo", includes: ["Group program","Weekly Q&A","Slack community"],                 active: 31 },
  { id: "pk4", name: "VIP Concierge · Annual",       price: 6800,period: "/yr",  includes: ["Everything in 1:1","Quarterly retreat","Phone access"],          active: 3 },
];

export const invoices = [
  { id: "inv-3412", client: "Alex Rivera",     pkg: "1:1 Monthly",     amount: 399,  status: "Paid",    when: "Today" },
  { id: "inv-3411", client: "Priya Shah",      pkg: "1:1 Monthly",     amount: 399,  status: "Paid",    when: "Today" },
  { id: "inv-3410", client: "Marcus Webb",     pkg: "Hybrid 8-Pack",   amount: 720,  status: "Paid",    when: "Yesterday" },
  { id: "inv-3409", client: "Sienna Park",     pkg: "1:1 Monthly",     amount: 399,  status: "Failed",  when: "Yesterday" },
  { id: "inv-3408", client: "Diego Romero",    pkg: "VIP Concierge",   amount: 6800, status: "Paid",    when: "2d ago" },
  { id: "inv-3407", client: "Hana Nakamura",   pkg: "Online Group",    amount: 297,  status: "Paid",    when: "3d ago" },
  { id: "inv-3406", client: "Jonah Patel",     pkg: "1:1 Monthly",     amount: 399,  status: "Refunded",when: "4d ago" },
  { id: "inv-3405", client: "Sloane Vega",     pkg: "1:1 Monthly",     amount: 399,  status: "Paid",    when: "5d ago" },
];

// ---------- 9. Calendar ----------
export const calendarWeek = [
  { day: "Mon", date: 9,  sessions: [
    { id: "s1", client: "Alex Rivera",   time: "7:00 AM",  type: "Lift",       len: 60, room: "Zoom" },
    { id: "s2", client: "Priya Shah",    time: "12:00 PM", type: "Check-in",   len: 30, room: "Google Meet" },
    { id: "s3", client: "Diego Romero",  time: "5:30 PM",  type: "Lift",       len: 75, room: "In-person" },
  ]},
  { day: "Tue", date: 10, sessions: [
    { id: "s4", client: "Hana Nakamura", time: "8:00 AM",  type: "Onboarding", len: 60, room: "Zoom" },
    { id: "s5", client: "Sloane Vega",   time: "6:00 PM",  type: "Lift",       len: 60, room: "In-person" },
  ]},
  { day: "Wed", date: 11, sessions: [
    { id: "s6", client: "Marcus Webb",   time: "10:00 AM", type: "Form review",len: 30, room: "Async" },
    { id: "s7", client: "Theo Lindqvist",time: "3:00 PM",  type: "Lift",       len: 60, room: "Zoom" },
    { id: "s8", client: "Naomi Carter",  time: "5:00 PM",  type: "Run review", len: 45, room: "Zoom" },
  ]},
  { day: "Thu", date: 12, sessions: [
    { id: "s9",  client: "Owen Pham",    time: "7:30 AM",  type: "Lift",       len: 60, room: "Zoom" },
    { id: "s10", client: "Imani Brooks", time: "12:30 PM", type: "Check-in",   len: 30, room: "Phone" },
  ]},
  { day: "Fri", date: 13, sessions: [
    { id: "s11", client: "Alex Rivera",  time: "7:00 AM",  type: "Lift",       len: 60, room: "Zoom" },
    { id: "s12", client: "Jonah Patel",  time: "11:00 AM", type: "Regroup",    len: 45, room: "Zoom" },
    { id: "s13", client: "Yusuf Aydin",  time: "4:00 PM",  type: "Lift",       len: 60, room: "In-person" },
  ]},
  { day: "Sat", date: 14, sessions: [
    { id: "s14", client: "Group · Sat AM", time: "9:00 AM", type: "Group class",len: 60, room: "In-person" },
  ]},
  { day: "Sun", date: 15, sessions: [] },
];

// ---------- 10. Leads pipeline ----------
export type LeadStage = "Inquiry" | "Consult" | "Onboarding" | "Active";
export const leadStages: LeadStage[] = ["Inquiry", "Consult", "Onboarding", "Active"];

export const leads = [
  { id: "L01", name: "Sarah Chen",      stage: "Inquiry" as LeadStage,    source: "Instagram",  value: 399,  age: "2h"  },
  { id: "L02", name: "Mike Torres",     stage: "Inquiry" as LeadStage,    source: "Referral",   value: 720,  age: "5h"  },
  { id: "L03", name: "Aisha Brown",     stage: "Inquiry" as LeadStage,    source: "Google",     value: 297,  age: "1d"  },
  { id: "L04", name: "Ben Walker",      stage: "Consult" as LeadStage,    source: "Instagram",  value: 399,  age: "2d"  },
  { id: "L05", name: "Lena Park",       stage: "Consult" as LeadStage,    source: "TikTok",     value: 6800, age: "3d"  },
  { id: "L06", name: "Tomas Klein",     stage: "Onboarding" as LeadStage, source: "Referral",   value: 399,  age: "5d"  },
  { id: "L07", name: "Maya Rodriguez",  stage: "Onboarding" as LeadStage, source: "Podcast",    value: 720,  age: "6d"  },
  { id: "L08", name: "Eli Friedman",    stage: "Active" as LeadStage,     source: "Referral",   value: 399,  age: "12d" },
  { id: "L09", name: "Zoe Martins",     stage: "Active" as LeadStage,     source: "Instagram",  value: 297,  age: "14d" },
];

// ---------- 11. Challenges & leaderboards ----------
export const challenges = [
  { id: "ch1", name: "October Squat 100 Club",   participants: 28, daysLeft: 11, prize: "Custom hoodie",      progress: 64 },
  { id: "ch2", name: "10k Steps · 30 Days",      participants: 41, daysLeft: 18, prize: "Free month",         progress: 38 },
  { id: "ch3", name: "Protein Streak · 21 Days", participants: 33, daysLeft: 6,  prize: "Recipe ebook",       progress: 78 },
];

export const leaderboard = [
  { rank: 1, client: "Diego Romero",  streak: 64, prs: 8, points: 1840 },
  { rank: 2, client: "Sloane Vega",   streak: 52, prs: 6, points: 1670 },
  { rank: 3, client: "Alex Rivera",   streak: 48, prs: 7, points: 1610 },
  { rank: 4, client: "Imani Brooks",  streak: 41, prs: 5, points: 1490 },
  { rank: 5, client: "Marcus Webb",   streak: 38, prs: 4, points: 1380 },
  { rank: 6, client: "Priya Shah",    streak: 32, prs: 3, points: 1260 },
  { rank: 7, client: "Theo Lindqvist",streak: 28, prs: 5, points: 1210 },
  { rank: 8, client: "Naomi Carter",  streak: 26, prs: 2, points: 1140 },
];

// ---------- 12. Form-check video reviews ----------
export const formReviews = [
  { id: "fr1", client: "Alex Rivera",     lift: "Bench Press",   submitted: "2h ago",  status: "Pending review" as const, thumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=480&q=70", durationSec: 18 },
  { id: "fr2", client: "Sienna Park",     lift: "RDL",           submitted: "5h ago",  status: "Pending review" as const, thumb: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=480&q=70", durationSec: 24 },
  { id: "fr3", client: "Jonah Patel",     lift: "Back Squat",    submitted: "1d ago",  status: "Reviewed"      as const, thumb: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=480&q=70", durationSec: 32 },
  { id: "fr4", client: "Imani Brooks",    lift: "Hip Thrust",    submitted: "2d ago",  status: "Reviewed"      as const, thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=480&q=70", durationSec: 20 },
  { id: "fr5", client: "Marcus Webb",     lift: "Weighted Pull", submitted: "3d ago",  status: "Reviewed"      as const, thumb: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=480&q=70", durationSec: 14 },
];

// ---------- 13. AI assistant canned prompts ----------
export const aiSuggestions = [
  "Draft Sarah's next mesocycle based on the last 4 weeks",
  "Summarize Mike Torres' progress for his check-in call",
  "Who needs outreach today?",
  "Rewrite this week's meal plan to hit 220g protein under 2200 kcal",
  "Find 3 substitute exercises for Jonah's knee flare-up",
  "Draft a refeed protocol for clients stalling on a cut",
];

export const aiSampleResponse = [
  { kind: "intent", text: "Drafting mesocycle for Sarah Chen - 4-week upper/lower split, +5% volume on push, deload week 4." },
  { kind: "block",  text: "Week 1 · Push · Bench 4×6 @ RPE 7 · OHP 3×8 @ RPE 7 · DB Row 4×10 · Cable Lateral 4×12" },
  { kind: "block",  text: "Week 2 · Push · Bench 4×6 @ RPE 8 (+2.5%) · OHP 3×8 @ RPE 8 · DB Row 4×10 · Cable Lateral 4×12" },
  { kind: "block",  text: "Week 3 · Push · Bench 5×5 @ RPE 8 · OHP 4×6 @ RPE 8 · DB Row 4×8 heavier · Cable Lateral 4×15" },
  { kind: "block",  text: "Week 4 · DELOAD · all top sets ×3 reps, accessory volume −40%" },
  { kind: "cite",   text: "Sourced from: last 4 check-ins · bench 1RM trend +6% · adherence 91%" },
];

// ---------- 14. Program assignments (library page) ----------
export const programAssignments = [
  { id: "pa1", client: "Alex Rivera",     program: "Cut Phase 12wk",  week: 8,  total: 12, adherence: 94, next: "Mon 7:00 AM" },
  { id: "pa2", client: "Priya Shah",      program: "Hypertrophy 8wk", week: 5,  total: 8,  adherence: 88, next: "Tue 12:00 PM" },
  { id: "pa3", client: "Marcus Webb",     program: "Lean Mass 16wk",  week: 12, total: 16, adherence: 91, next: "Wed 10:00 AM" },
  { id: "pa4", client: "Sienna Park",     program: "Cut Phase 12wk",  week: 6,  total: 12, adherence: 72, next: "Today 5:30 PM" },
  { id: "pa5", client: "Diego Romero",    program: "Powerbuilding",   week: 9,  total: 12, adherence: 96, next: "Today 5:30 PM" },
  { id: "pa6", client: "Hana Nakamura",   program: "Hypertrophy 8wk", week: 3,  total: 8,  adherence: 84, next: "Tue 8:00 AM" },
  { id: "pa7", client: "Jonah Patel",     program: "Cut Phase 12wk",  week: 10, total: 12, adherence: 58, next: "Fri 11:00 AM" },
  { id: "pa8", client: "Imani Brooks",    program: "Glute Focus 10wk",week: 9,  total: 10, adherence: 93, next: "Thu 12:30 PM" },
];

// ---------- 15. Exercise library (builder left rail) ----------
export const exerciseLibrary = [
  { id: "x1",  name: "Barbell Bench Press",    muscle: "Chest",     equipment: "Barbell"   },
  { id: "x2",  name: "Incline DB Press",       muscle: "Chest",     equipment: "Dumbbell"  },
  { id: "x3",  name: "Machine Chest Press",    muscle: "Chest",     equipment: "Machine"   },
  { id: "x4",  name: "Weighted Pull-Up",       muscle: "Back",      equipment: "Bodyweight"},
  { id: "x5",  name: "Chest-Supported Row",    muscle: "Back",      equipment: "Machine"   },
  { id: "x6",  name: "Lat Pulldown",           muscle: "Back",      equipment: "Cable"     },
  { id: "x7",  name: "Back Squat",             muscle: "Quads",     equipment: "Barbell"   },
  { id: "x8",  name: "Hack Squat",             muscle: "Quads",     equipment: "Machine"   },
  { id: "x9",  name: "Bulgarian Split Squat",  muscle: "Quads",     equipment: "Dumbbell"  },
  { id: "x10", name: "Romanian Deadlift",      muscle: "Hamstrings",equipment: "Barbell"   },
  { id: "x11", name: "Seated Leg Curl",        muscle: "Hamstrings",equipment: "Machine"   },
  { id: "x12", name: "Hip Thrust",             muscle: "Glutes",    equipment: "Barbell"   },
  { id: "x13", name: "Cable Lateral Raise",    muscle: "Shoulders", equipment: "Cable"     },
  { id: "x14", name: "OHP",                    muscle: "Shoulders", equipment: "Barbell"   },
  { id: "x15", name: "Face Pull",              muscle: "Rear Delt", equipment: "Cable"     },
  { id: "x16", name: "Hammer Curl",            muscle: "Biceps",    equipment: "Dumbbell"  },
  { id: "x17", name: "Tricep Rope Pushdown",   muscle: "Triceps",   equipment: "Cable"     },
  { id: "x18", name: "Standing Calf Raise",    muscle: "Calves",    equipment: "Machine"   },
];
