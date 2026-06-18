// Apex Aesthetics Group — front-end prototype seed
export type Trend = "up" | "down" | "flat";

export const practice = {
  name: "Apex Aesthetics Group",
  tagline: "Health Optimization · Aesthetics · Wellness",
  locations: [
    { id: "atx", name: "Austin Flagship", city: "Austin, TX", members: 412, mrr: 24180 },
    { id: "dal", name: "Dallas Uptown", city: "Dallas, TX", members: 268, mrr: 15890 },
    { id: "nsh", name: "Nashville Gulch", city: "Nashville, TN", members: 167, mrr: 8209 },
  ],
  activeLocationId: "atx",
};

export const kpis = [
  { label: "Today's Revenue", value: "$4,280", delta: "+18.2%", trend: "up" as Trend, spark: [2800, 3100, 2950, 3400, 3680, 3920, 4100, 4280] },
  { label: "Appointments", value: "14", delta: "+3", trend: "up" as Trend, spark: [8, 10, 9, 11, 12, 13, 13, 14] },
  { label: "Active Members", value: "847", delta: "+24 MTD", trend: "up" as Trend, spark: [780, 795, 808, 815, 824, 832, 840, 847] },
  { label: "Monthly Recurring", value: "$48,279", delta: "+6.4%", trend: "up" as Trend, spark: [38000, 39800, 41200, 43100, 44800, 46100, 47200, 48279] },
];

export const revenueSeries = Array.from({ length: 30 }, (_, i) => {
  const base = 3800 + Math.sin(i / 2.5) * 900 + i * 60;
  const weekend = (i % 7 === 0 || i % 7 === 6) ? -1200 : 0;
  return {
    day: `${i + 1}`,
    revenue: Math.max(1800, Math.round(base + weekend)),
    target: 4200,
  };
});

export const mrrSeries = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"][i],
  mrr: Math.round(28000 + i * 1700 + Math.sin(i) * 600),
  members: Math.round(540 + i * 26 + Math.sin(i) * 8),
}));

export const providers = [
  { id: "p1", name: "Dr. Amelia Chen, MD",   role: "Medical Director · Aesthetics",  utilization: 94, revenue: 41200, patients: 38, status: "active" },
  { id: "p2", name: "Dr. Marcus Patel, MD",  role: "Hormone Optimization",            utilization: 88, revenue: 36800, patients: 31, status: "active" },
  { id: "p3", name: "Sara Whitfield, NP",    role: "Injectables · Lasers",            utilization: 82, revenue: 28400, patients: 34, status: "active" },
  { id: "p4", name: "Jonah Reeves, PA-C",    role: "Weight & Metabolic",              utilization: 76, revenue: 22900, patients: 29, status: "active" },
  { id: "p5", name: "Maya Okonkwo, RN",      role: "IV Therapy · Boosters",           utilization: 71, revenue: 14200, patients: 41, status: "active" },
  { id: "p6", name: "Devon Hart, LE",        role: "Skin · Facials",                  utilization: 64, revenue:  9800, patients: 22, status: "leave"  },
];

export const patients = [
  { id: "u1", name: "Eliana Ruiz",      mrn: "APX-10293", lastVisit: "2 days ago", risk: "high", balance: 312, tag: "Platinum Member", ltv: 18420 },
  { id: "u2", name: "Owen Pham",        mrn: "APX-10288", lastVisit: "Today",      risk: "low",  balance: 0,   tag: "Gold Member",     ltv: 9240  },
  { id: "u3", name: "Naomi Carter",     mrn: "APX-10271", lastVisit: "1 wk ago",   risk: "med",  balance: 84,  tag: "Hormone Plan",    ltv: 12180 },
  { id: "u4", name: "Yusuf Aydin",      mrn: "APX-10260", lastVisit: "3 wk ago",   risk: "med",  balance: 0,   tag: "Post-op",         ltv: 6890  },
  { id: "u5", name: "Harper Nakamura",  mrn: "APX-10254", lastVisit: "Today",      risk: "low",  balance: 0,   tag: "New",             ltv: 480   },
  { id: "u6", name: "Imani Brooks",     mrn: "APX-10241", lastVisit: "Yesterday",  risk: "low",  balance: 0,   tag: "Platinum Member", ltv: 22100 },
];

export const services = [
  { id: "s1", name: "Neurotoxin · per unit",       price: 14,   category: "Injectables" },
  { id: "s2", name: "Dermal Filler · syringe",     price: 850,  category: "Injectables" },
  { id: "s3", name: "Semaglutide · monthly",       price: 399,  category: "Weight" },
  { id: "s4", name: "Testosterone Optimization",   price: 289,  category: "Hormones" },
  { id: "s5", name: "Morpheus8 · full face",       price: 1850, category: "Lasers" },
  { id: "s6", name: "NAD+ IV · 500mg",             price: 425,  category: "IV Therapy" },
  { id: "s7", name: "HydraFacial Platinum",        price: 325,  category: "Skin" },
  { id: "s8", name: "Apex Platinum Membership",    price: 299,  category: "Membership" },
  { id: "s9", name: "Apex Gold Membership",        price: 149,  category: "Membership" },
];

export const todaySchedule = [
  { time: "8:30",  patient: "Eliana Ruiz",      provider: "Dr. Chen",     type: "Neurotoxin · 40u",      status: "checked-in", duration: 30 },
  { time: "9:00",  patient: "Owen Pham",        provider: "S. Whitfield", type: "Filler · Lips 1mL",     status: "in-room",    duration: 45 },
  { time: "9:45",  patient: "Harper Nakamura",  provider: "Dr. Chen",     type: "New Consult",           status: "scheduled",  duration: 30 },
  { time: "10:30", patient: "Naomi Carter",     provider: "Dr. Patel",    type: "Hormone Follow-up",     status: "scheduled",  duration: 30 },
  { time: "11:15", patient: "Yusuf Aydin",      provider: "J. Reeves",    type: "Semaglutide Refill",    status: "scheduled",  duration: 20 },
  { time: "13:00", patient: "Mira Hollander",   provider: "Dr. Chen",     type: "Morpheus8 · Full Face", status: "scheduled",  duration: 90 },
  { time: "14:45", patient: "Imani Brooks",     provider: "M. Okonkwo",   type: "NAD+ IV 500mg",         status: "scheduled",  duration: 60 },
  { time: "16:00", patient: "Theo Lindqvist",   provider: "S. Whitfield", type: "Filler · Cheeks 2mL",   status: "scheduled",  duration: 60 },
];

export const alerts = [
  { id: "a1", kind: "inventory", severity: "high", title: "Botox 100u · 3 vials remaining", meta: "Reorder threshold breached · auto-PO ready" },
  { id: "a2", kind: "clinical",  severity: "med",  title: "9 members overdue for quarterly labs", meta: "Hormone & metabolic protocol" },
  { id: "a3", kind: "revenue",   severity: "low",  title: "4 unsigned encounters",        meta: "Dr. Patel · yesterday" },
  { id: "a4", kind: "growth",    severity: "med",  title: "12 new leads from Instagram",  meta: "Awaiting outreach · 8h SLA" },
];

export const onboardingTasks = [
  { id: "o1", label: "Connect Stripe & payment terminal", done: true },
  { id: "o2", label: "Import patient list",               done: true },
  { id: "o3", label: "Invite providers & staff",          done: true },
  { id: "o4", label: "Configure membership plans",        done: true },
  { id: "o5", label: "Set up online booking widget",      done: false },
  { id: "o6", label: "Launch first SMS campaign",         done: false },
];

export const quickActions = [
  { id: "qa1", label: "Add patient",        hint: "P" },
  { id: "qa2", label: "Book appointment",   hint: "S" },
  { id: "qa3", label: "Open POS",           hint: "$" },
  { id: "qa4", label: "Send SMS",           hint: "M" },
  { id: "qa5", label: "New encounter",      hint: "E" },
];

export const recentActivity = [
  { id: "ac1", who: "Sara Whitfield, NP", what: "completed encounter for Owen Pham",      when: "2m ago",  amount: 1280 },
  { id: "ac2", who: "Front Desk",         what: "checked in Eliana Ruiz",                  when: "8m ago",  amount: 0 },
  { id: "ac3", who: "Apex System",        what: "ran nightly billing · 47 invoices sent",  when: "6h ago",  amount: 14820 },
  { id: "ac4", who: "Dr. Marcus Patel",   what: "signed 3 lab orders",                     when: "Yesterday", amount: 0 },
  { id: "ac5", who: "Marketing",          what: "launched 'Summer Glow' email · 1,240 sent", when: "Yesterday", amount: 0 },
];

export const membershipMix = [
  { name: "Platinum", value: 218, color: "var(--chart-2)" },
  { name: "Gold",     value: 384, color: "var(--chart-1)" },
  { name: "Silver",   value: 245, color: "var(--chart-3)" },
];

export const leads = [
  { id: "l1", name: "Riley Tomás",  source: "Instagram", interest: "Semaglutide",  stage: "new",      value: 4788 },
  { id: "l2", name: "Sloane Vega",  source: "Google",    interest: "Filler",       stage: "contacted",value: 2400 },
  { id: "l3", name: "Cameron Day",  source: "Referral",  interest: "Morpheus8",    stage: "booked",   value: 5550 },
  { id: "l4", name: "Aiyana Roth",  source: "TikTok",    interest: "Membership",   stage: "new",      value: 3588 },
  { id: "l5", name: "Bex Halloran", source: "Website",   interest: "Testosterone", stage: "contacted",value: 3468 },
];

export const inventory = [
  { id: "i1", sku: "BTX-100",  name: "Botox 100u",            onHand: 3,  par: 12, supplier: "Allergan",   cost: 525 },
  { id: "i2", sku: "JUV-VOL",  name: "Juvederm Voluma XC",    onHand: 18, par: 20, supplier: "Allergan",   cost: 295 },
  { id: "i3", sku: "SEM-2.5",  name: "Semaglutide 2.5mg/mL",  onHand: 7,  par: 15, supplier: "Empower",    cost: 89  },
  { id: "i4", sku: "NAD-500",  name: "NAD+ 500mg vial",       onHand: 22, par: 30, supplier: "Olympia",    cost: 142 },
  { id: "i5", sku: "HF-SER",   name: "HydraFacial Serum Kit", onHand: 4,  par: 8,  supplier: "BeautyHlth", cost: 218 },
];
