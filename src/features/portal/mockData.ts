export const patient = {
  name: "Eliana Ruiz",
  firstName: "Eliana",
  mrn: "MRN-04821",
  dob: "Aug 14, 1989",
  email: "eliana@email.com",
  phone: "(512) 555-0118",
  membership: "Optimize · Annual",
  memberSince: "Jan 2024",
  nextRenewal: "Jan 12, 2027",
  primaryProvider: "Dr. Lena Chen",
  carePod: "Pod A · Austin",
  insurance: { payer: "Aetna PPO", id: "W852-4421-09", group: "ARC-7782" },
  streak: 12,
  avatarInitials: "ER",
};

export type Visit = {
  id: string;
  date: string;
  dateLabel: string;
  time: string;
  type: string;
  modality: "video" | "in-person" | "phone";
  provider: string;
  location: string;
  status: "upcoming" | "soon" | "completed" | "cancelled";
  summary?: string;
};

export const upcomingVisits: Visit[] = [
  {
    id: "v-201",
    date: "2026-06-08",
    dateLabel: "Today",
    time: "2:30 PM",
    type: "Hormone follow-up",
    modality: "video",
    provider: "Dr. Lena Chen",
    location: "Telehealth",
    status: "soon",
  },
  {
    id: "v-202",
    date: "2026-06-22",
    dateLabel: "Jun 22",
    time: "10:00 AM",
    type: "Lab draw + vitals",
    modality: "in-person",
    provider: "RN Marcus Kim",
    location: "Austin · Downtown",
    status: "upcoming",
  },
  {
    id: "v-203",
    date: "2026-07-14",
    dateLabel: "Jul 14",
    time: "3:15 PM",
    type: "Quarterly review",
    modality: "video",
    provider: "Dr. Lena Chen",
    location: "Telehealth",
    status: "upcoming",
  },
];

export const pastVisits: Visit[] = [
  {
    id: "v-188",
    date: "2026-05-12",
    dateLabel: "May 12",
    time: "2:00 PM",
    type: "Hormone follow-up",
    modality: "video",
    provider: "Dr. Lena Chen",
    location: "Telehealth",
    status: "completed",
    summary: "Continue current protocol. Recheck labs in 6 weeks. Vit D 5000 IU daily.",
  },
  {
    id: "v-176",
    date: "2026-04-02",
    dateLabel: "Apr 2",
    time: "11:00 AM",
    type: "New patient intake",
    modality: "in-person",
    provider: "Dr. Lena Chen",
    location: "Austin · Downtown",
    status: "completed",
    summary: "Comprehensive intake. Baseline labs ordered. Start titration protocol.",
  },
  {
    id: "v-162",
    date: "2026-03-08",
    dateLabel: "Mar 8",
    time: "9:30 AM",
    type: "Consultation",
    modality: "phone",
    provider: "RN Marcus Kim",
    location: "Phone",
    status: "completed",
    summary: "Initial consult. Reviewed goals and program options.",
  },
];

export type Medication = {
  id: string;
  name: string;
  dose: string;
  schedule: string;
  refillsLeft: number;
  nextRefill: string;
  shipStatus: "delivered" | "in_transit" | "scheduled";
  shipEta: string;
  takenToday: boolean;
  prescriber: string;
};

export const medications: Medication[] = [
  {
    id: "rx-1",
    name: "Estradiol",
    dose: "0.5 mg",
    schedule: "1 patch · twice weekly (Mon/Thu)",
    refillsLeft: 2,
    nextRefill: "Jul 02",
    shipStatus: "delivered",
    shipEta: "Delivered May 28",
    takenToday: true,
    prescriber: "Dr. Lena Chen",
  },
  {
    id: "rx-2",
    name: "Progesterone",
    dose: "100 mg",
    schedule: "1 capsule nightly",
    refillsLeft: 3,
    nextRefill: "Jul 18",
    shipStatus: "in_transit",
    shipEta: "Arrives Jun 11",
    takenToday: false,
    prescriber: "Dr. Lena Chen",
  },
  {
    id: "rx-3",
    name: "Vitamin D3",
    dose: "5,000 IU",
    schedule: "1 softgel daily with food",
    refillsLeft: 5,
    nextRefill: "Aug 02",
    shipStatus: "delivered",
    shipEta: "Delivered May 30",
    takenToday: true,
    prescriber: "Dr. Lena Chen",
  },
  {
    id: "rx-4",
    name: "Methylated B-Complex",
    dose: "1 capsule",
    schedule: "Daily with breakfast",
    refillsLeft: 0,
    nextRefill: "Refill needed",
    shipStatus: "scheduled",
    shipEta: "Awaiting refill request",
    takenToday: false,
    prescriber: "RN Marcus Kim",
  },
];

export type LabPanel = {
  id: string;
  name: string;
  collectedOn: string;
  status: "new" | "reviewed";
  flagged: number;
  markers: {
    name: string;
    value: number;
    unit: string;
    refLow: number;
    refHigh: number;
    flag: "low" | "ok" | "high";
    trend: number[];
  }[];
  interpretation: string;
};

export const labPanels: LabPanel[] = [
  {
    id: "lab-99",
    name: "Hormone & Metabolic Panel",
    collectedOn: "Jun 4, 2026",
    status: "new",
    flagged: 2,
    interpretation:
      "Your TSH is trending slightly above target — Dr. Chen will discuss this at your next visit. Vitamin D is below range; the new supplement should correct this within 12 weeks.",
    markers: [
      { name: "TSH", value: 3.8, unit: "mIU/L", refLow: 0.4, refHigh: 4.0, flag: "ok", trend: [2.1, 2.4, 2.8, 3.1, 3.5, 3.8] },
      { name: "Free T4", value: 1.2, unit: "ng/dL", refLow: 0.9, refHigh: 1.7, flag: "ok", trend: [1.1, 1.2, 1.2, 1.2, 1.2, 1.2] },
      { name: "Estradiol", value: 84, unit: "pg/mL", refLow: 30, refHigh: 120, flag: "ok", trend: [42, 58, 71, 78, 81, 84] },
      { name: "LDL-C", value: 142, unit: "mg/dL", refLow: 0, refHigh: 100, flag: "high", trend: [128, 134, 130, 138, 140, 142] },
      { name: "HDL-C", value: 58, unit: "mg/dL", refLow: 40, refHigh: 100, flag: "ok", trend: [54, 55, 56, 57, 58, 58] },
      { name: "Vitamin D", value: 22, unit: "ng/mL", refLow: 30, refHigh: 80, flag: "low", trend: [28, 26, 25, 24, 22, 22] },
    ],
  },
  {
    id: "lab-87",
    name: "Complete Blood Count",
    collectedOn: "Apr 12, 2026",
    status: "reviewed",
    flagged: 0,
    interpretation: "All values within normal range. No action needed.",
    markers: [
      { name: "Hemoglobin", value: 13.6, unit: "g/dL", refLow: 12.0, refHigh: 15.5, flag: "ok", trend: [13.2, 13.4, 13.5, 13.6, 13.6, 13.6] },
      { name: "WBC", value: 6.4, unit: "K/uL", refLow: 4.0, refHigh: 11.0, flag: "ok", trend: [6.1, 6.2, 6.3, 6.3, 6.4, 6.4] },
      { name: "Platelets", value: 248, unit: "K/uL", refLow: 150, refHigh: 400, flag: "ok", trend: [240, 242, 245, 246, 247, 248] },
    ],
  },
];

export type MessageThread = {
  id: string;
  with: string;
  role: string;
  initials: string;
  unread: number;
  lastAt: string;
  preview: string;
  messages: { from: "me" | "them"; at: string; text: string }[];
};

export const threads: MessageThread[] = [
  {
    id: "t-1",
    with: "Dr. Lena Chen",
    role: "Primary provider",
    initials: "LC",
    unread: 1,
    lastAt: "9:42 AM",
    preview: "Your latest labs look good overall — let's chat at 2:30…",
    messages: [
      { from: "me", at: "Yesterday 4:18 PM", text: "Hi Dr. Chen, I've been feeling a bit more fatigued in the afternoons this week. Should I be concerned?" },
      { from: "them", at: "Yesterday 5:02 PM", text: "Thanks for letting me know. We'll review your TSH at tomorrow's visit — it ticked up slightly. In the meantime, prioritize sleep ≥7h." },
      { from: "them", at: "9:42 AM", text: "Your latest labs look good overall — let's chat at 2:30 about the TSH trend and a small protocol tweak." },
    ],
  },
  {
    id: "t-2",
    with: "Marcus Kim, RN",
    role: "Care team",
    initials: "MK",
    unread: 0,
    lastAt: "Tue",
    preview: "Your B-complex refill request is approved.",
    messages: [
      { from: "me", at: "Mon 9:10 AM", text: "Hi Marcus — could you process the B-complex refill?" },
      { from: "them", at: "Tue 8:33 AM", text: "Your B-complex refill request is approved. Ships today, ETA Friday." },
    ],
  },
  {
    id: "t-3",
    with: "Billing",
    role: "ARCA Rx",
    initials: "$",
    unread: 0,
    lastAt: "May 28",
    preview: "Your April invoice has been paid. Thank you!",
    messages: [
      { from: "them", at: "May 28", text: "Your April invoice has been paid. Thank you!" },
    ],
  },
];

export const checkIns = [
  { date: "Jun 7", energy: 7, mood: 8, sleep: 6.5, libido: 7 },
  { date: "May 31", energy: 6, mood: 7, sleep: 6.0, libido: 6 },
  { date: "May 24", energy: 7, mood: 7, sleep: 7.0, libido: 7 },
  { date: "May 17", energy: 5, mood: 6, sleep: 5.5, libido: 5 },
  { date: "May 10", energy: 6, mood: 7, sleep: 6.5, libido: 6 },
  { date: "May 3",  energy: 4, mood: 5, sleep: 5.0, libido: 4 },
];

export const weightLog = [
  { d: "Apr 7",  w: 168.2 },
  { d: "Apr 14", w: 167.4 },
  { d: "Apr 21", w: 166.1 },
  { d: "Apr 28", w: 165.0 },
  { d: "May 5",  w: 163.8 },
  { d: "May 12", w: 162.6 },
  { d: "May 19", w: 161.4 },
  { d: "May 26", w: 160.2 },
  { d: "Jun 2",  w: 159.1 },
];

export const photoSessions = [
  { id: "p1", label: "Baseline", date: "Apr 2", color: "from-slate-400 to-slate-600" },
  { id: "p2", label: "Week 4", date: "Apr 30", color: "from-teal-400 to-sky-600" },
  { id: "p3", label: "Week 8", date: "May 28", color: "from-emerald-400 to-teal-600" },
];

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "due" | "scheduled";
};

export const invoices: Invoice[] = [
  { id: "INV-3210", date: "Jun 1, 2026", description: "Membership · June",        amount: 289, status: "paid"      },
  { id: "INV-3155", date: "May 12, 2026", description: "Lab draw + processing",   amount:  84, status: "paid"      },
  { id: "INV-3140", date: "May 1, 2026",  description: "Membership · May",        amount: 289, status: "paid"      },
  { id: "INV-3299", date: "Jun 22, 2026", description: "Lab draw (scheduled)",    amount:  84, status: "scheduled" },
  { id: "INV-3301", date: "Jul 1, 2026",  description: "Membership · July",       amount: 289, status: "scheduled" },
];

export const balance = { outstanding: 0, nextCharge: 289, nextChargeDate: "Jul 1, 2026" };

export const consents = [
  { name: "HIPAA Notice of Privacy Practices", signedOn: "Apr 2, 2026", current: true },
  { name: "Telehealth Informed Consent",       signedOn: "Apr 2, 2026", current: true },
  { name: "Financial Responsibility",          signedOn: "Apr 2, 2026", current: true },
  { name: "Photography & Progress Tracking",   signedOn: "Apr 2, 2026", current: true },
];

export const devices = [
  { name: "Apple Health",     status: "connected", last: "synced 2 min ago" },
  { name: "Withings Scale",   status: "connected", last: "synced this morning" },
  { name: "Oura Ring",        status: "available", last: "tap to connect"  },
];
