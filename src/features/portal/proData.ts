import type { Visit, MessageThread } from "./mockData";

// ARCA Pro (Client) portal data. The Client is the coach's client, not the
// clinic's patient: sessions are training sessions with the coach, messages
// go to the coaching team, and there is no medical layer (no providers, no
// meds, no labs, no insurance).

export const clientProfile = {
  coach: "Mara Ellis, CSCS",
  coachHandle: "@coachmara",
  team: "Team Ellis · Austin",
  package: "Elite Coaching · Monthly",
  clientSince: "Jan 2024",
  nextRenewal: "Aug 1, 2026",
};

export const upcomingSessions: Visit[] = [
  {
    id: "s-301",
    date: "2026-07-06",
    dateLabel: "Today",
    time: "5:30 PM",
    type: "1:1 Training · Lower body",
    modality: "in-person",
    provider: "Mara Ellis, CSCS",
    location: "Iron Works Gym · Austin",
    status: "soon",
  },
  {
    id: "s-302",
    date: "2026-07-09",
    dateLabel: "Jul 9",
    time: "8:00 AM",
    type: "Weekly check-in call",
    modality: "video",
    provider: "Mara Ellis, CSCS",
    location: "Video call",
    status: "upcoming",
  },
  {
    id: "s-303",
    date: "2026-07-14",
    dateLabel: "Jul 14",
    time: "6:00 PM",
    type: "Form review · Squat + hinge",
    modality: "video",
    provider: "Diego Ramos, CPT",
    location: "Video call",
    status: "upcoming",
  },
];

export const pastSessions: Visit[] = [
  {
    id: "s-288",
    date: "2026-07-02",
    dateLabel: "Jul 2",
    time: "5:30 PM",
    type: "1:1 Training · Upper body",
    modality: "in-person",
    provider: "Mara Ellis, CSCS",
    location: "Iron Works Gym · Austin",
    status: "completed",
    summary: "Bench moved up 5 lb - bar speed looked strong. Keep rows strict this block; we add a top set next week.",
  },
  {
    id: "s-276",
    date: "2026-06-28",
    dateLabel: "Jun 28",
    time: "8:00 AM",
    type: "Weekly check-in call",
    modality: "video",
    provider: "Mara Ellis, CSCS",
    location: "Video call",
    status: "completed",
    summary: "Weight trending down 0.6 lb/wk - right on target. Sleep dipped to 6.2h avg; wind-down alarm set for 9:45 PM.",
  },
  {
    id: "s-262",
    date: "2026-06-21",
    dateLabel: "Jun 21",
    time: "9:00 AM",
    type: "InBody scan + measurements",
    modality: "in-person",
    provider: "Diego Ramos, CPT",
    location: "Iron Works Gym · Austin",
    status: "completed",
    summary: "Lean mass +1.8 lb since April scan. Body fat 24.1% -> 22.9%. Next scan in 6 weeks.",
  },
];

export const coachThreads: MessageThread[] = [
  {
    id: "ct-1",
    with: "Mara Ellis",
    role: "Head coach",
    initials: "ME",
    unread: 1,
    lastAt: "8:12 AM",
    preview: "Big session today - go into it fed. Carbs at lunch…",
    messages: [
      { from: "me", at: "Yesterday 7:44 PM", text: "Squats felt heavy today but I hit all the sets. Left hip was a little tight on the last two." },
      { from: "them", at: "Yesterday 8:15 PM", text: "All sets at that RPE is exactly where we want you. Add the 90/90 hip stretch to your warm-up tomorrow - 2 min per side." },
      { from: "them", at: "8:12 AM", text: "Big session today - go into it fed. Carbs at lunch, and bring your belt for the top set." },
    ],
  },
  {
    id: "ct-2",
    with: "Diego Ramos",
    role: "Assistant coach · Form review",
    initials: "DR",
    unread: 0,
    lastAt: "Thu",
    preview: "Reviewed your deadlift clip - lockout looks much better.",
    messages: [
      { from: "me", at: "Wed 6:20 PM", text: "Uploaded a new deadlift set from today - can you check my lockout?" },
      { from: "them", at: "Thu 9:05 AM", text: "Reviewed your deadlift clip - lockout looks much better. Keep the lats set before you pull and we're there." },
    ],
  },
  {
    id: "ct-3",
    with: "Team Ellis",
    role: "Billing & scheduling",
    initials: "TE",
    unread: 0,
    lastAt: "Jun 30",
    preview: "Your July coaching invoice is paid. See you Monday!",
    messages: [
      { from: "them", at: "Jun 30", text: "Your July coaching invoice is paid. See you Monday!" },
    ],
  },
];

// Booking options for the Client: coaching sessions, not medical services.
export const proServices = [
  { id: "pt-60",      label: "1:1 Training Session",      duration: "60 min", category: "Training",   description: "Coached session at the gym - programmed lifts with hands-on form coaching." },
  { id: "pt-30",      label: "Express Training Session",  duration: "30 min", category: "Training",   description: "Short focused block - one main lift plus accessories." },
  { id: "checkin",    label: "Weekly Check-in Call",      duration: "20 min", category: "Coaching",   description: "Review the week: adherence, weight trend, sleep, and next week's plan." },
  { id: "form",       label: "Form Review",               duration: "30 min", category: "Coaching",   description: "Live technique review of your uploaded lift videos with cues to fix." },
  { id: "nutrition",  label: "Nutrition Consult",         duration: "30 min", category: "Coaching",   description: "Dial in your meal plan, macros, and eating around training." },
  { id: "scan",       label: "InBody Scan + Measurements", duration: "15 min", category: "Assessment", description: "Body composition scan, tape measurements, and progress photos." },
  { id: "goal",       label: "Goal-setting Session",      duration: "45 min", category: "Assessment", description: "Quarterly deep-dive: review the block, reset targets, plan the next phase." },
];

export const proCategories = ["Training", "Coaching", "Assessment"];

export const proProviders = [
  { id: "mara",  name: "Mara Ellis, CSCS",  role: "Head coach",       modalities: ["video", "in-person"] as const },
  { id: "diego", name: "Diego Ramos, CPT",  role: "Assistant coach",  modalities: ["video", "in-person"] as const },
  { id: "kai",   name: "Kai Chen, PN1",     role: "Nutrition coach",  modalities: ["video"] as const },
];

// Client-facing agreements (replaces the medical consents card).
export const waivers = [
  { name: "Liability Waiver & Release",   signedOn: "Jan 8, 2024", current: true },
  { name: "PAR-Q Health Screening",       signedOn: "Jan 8, 2024", current: true },
  { name: "Coaching Services Agreement",  signedOn: "Jan 8, 2024", current: true },
  { name: "Photo & Progress Media Consent", signedOn: "Jan 8, 2024", current: true },
];

export const proPlans = ["Foundation Coaching", "Elite Coaching", "Concierge Coaching"];
