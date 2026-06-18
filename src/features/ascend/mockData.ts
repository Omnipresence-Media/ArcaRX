// All mock data for the Ascend prototype. Centralised for easy demo tweaks.

export const ascendIndex = {
  total: 742,
  delta: 18,
  weakest: "Business",
  pillars: [
    { key: "fitness", label: "Fitness", score: 88, color: "var(--asc-teal)" },
    { key: "looks", label: "Looks", score: 76, color: "var(--asc-teal)" },
    { key: "life", label: "Life", score: 71, color: "var(--asc-amber)" },
    { key: "business", label: "Business", score: 54, color: "var(--asc-coral)" },
    { key: "status", label: "Status", score: 68, color: "var(--asc-amber)" },
    { key: "coach", label: "Coach", score: 90, color: "var(--asc-teal)" },
  ],
};

export const notifications = [
  { icon: "MessageCircle", text: "Marcus replied to your check-in", time: "12m" },
  { icon: "Trophy", text: "New bench PR — 185 × 6", time: "2h" },
  { icon: "Flame", text: "21-day sunlight streak unlocked", time: "5h" },
];

export const workouts = [
  {
    id: "w1",
    name: "Push A — Upper Hypertrophy",
    duration: "52 min",
    focus: "Chest, Shoulders, Triceps",
    tags: ["Chest", "Shoulders"],
    exercises: [
      {
        name: "Bench Press",
        cues: ["Retract scapula", "Drive through mid-foot", "Controlled eccentric"],
        sets: [
          { weight: 185, reps: 6, rpe: 8, done: true },
          { weight: 185, reps: 6, rpe: 8, done: true },
          { weight: 185, reps: 5, rpe: null, done: false },
          { weight: 185, reps: 5, rpe: null, done: false },
        ],
        ai: "Based on RPE 8 last week, stay at 185 today and focus on speed.",
      },
      {
        name: "Incline DB Press",
        cues: ["Slight arch", "Elbows under wrists", "Pause at chest"],
        sets: [
          { weight: 70, reps: 10, rpe: 7, done: true },
          { weight: 70, reps: 10, rpe: 8, done: true },
          { weight: 70, reps: 9, rpe: null, done: false },
        ],
        ai: "Bump to 72.5 next week if RPE stays at 8.",
      },
      {
        name: "Cable Fly",
        cues: ["Slight bend at elbow", "Squeeze at midline"],
        sets: [
          { weight: 30, reps: 12, rpe: null, done: false },
          { weight: 30, reps: 12, rpe: null, done: false },
          { weight: 30, reps: 12, rpe: null, done: false },
        ],
        ai: "Last set to failure for the metabolic finisher.",
      },
    ],
  },
  { id: "w2", name: "Pull B — Back & Biceps", duration: "48 min", focus: "Back, Biceps", tags: ["Back", "Biceps"], exercises: [] },
  { id: "w3", name: "Legs — Quad Focus", duration: "62 min", focus: "Quads, Glutes", tags: ["Legs"], exercises: [] },
];

export const program = {
  name: "Hypertrophy Block 2",
  week: 3,
  totalWeeks: 8,
  phase: "Intensification",
  days: [
    { label: "M", state: "done" },
    { label: "T", state: "done" },
    { label: "W", state: "done" },
    { label: "T", state: "today" },
    { label: "F", state: "upcoming" },
    { label: "S", state: "upcoming" },
    { label: "S", state: "upcoming" },
  ],
  phases: [
    { name: "Accumulation", weeks: [1, 2, 3], color: "var(--asc-teal)" },
    { name: "Intensification", weeks: [4, 5, 6], color: "var(--asc-amber)" },
    { name: "Deload", weeks: [7, 8], color: "var(--asc-muted)" },
  ],
};

export const macros = {
  protein: { current: 156, target: 195, unit: "g" },
  carbs: { current: 210, target: 280, unit: "g" },
  fat: { current: 58, target: 70, unit: "g" },
  calories: { current: 1840, target: 2400, unit: "" },
};

export const meals = [
  { time: "7:30am", name: "Breakfast", items: "Eggs, Rice, Avocado", cal: 520, source: "scan" },
  { time: "12:15pm", name: "Lunch", items: "Grilled Chicken Bowl", cal: 680, source: "scan" },
  { time: "4:00pm", name: "Pre-workout", items: "Protein Shake + Banana", cal: 340, source: "manual" },
];

export const scanResult = {
  items: [
    { name: "Grilled Chicken Breast", grams: 210, confidence: 0.87, p: 46, c: 0, f: 6, cal: 230 },
    { name: "Jasmine Rice", grams: 185, confidence: 0.91, p: 4, c: 62, f: 1, cal: 290 },
    { name: "Broccoli", grams: 95, confidence: 0.94, p: 3, c: 7, f: 0, cal: 35 },
  ],
  total: { cal: 740, p: 68, c: 82, f: 12 },
};

export const readiness = {
  score: 79,
  hrv: 84,
  sleep: 76,
  soreness: 82,
  load: 73,
  rec: "Push hard today. HRV is strong.",
};

export const habits = [
  { name: "Cold Exposure", emoji: "🧊", streak: 14, done: true },
  { name: "AM Sunlight", emoji: "☀️", streak: 21, done: true },
  { name: "30min Reading", emoji: "📚", streak: 8, done: false },
  { name: "No Alcohol", emoji: "🚫", streak: 45, done: true },
  { name: "Meditation", emoji: "🧘", streak: 4, done: false },
  { name: "Journal", emoji: "✍️", streak: 6, done: false },
];

export const styleToday = {
  outfit: "Navy Slim Chinos + White Oxford + White Sneakers",
  weather: "72°F Sunny",
  calendar: "Client Call 2pm — Business Casual",
};

export const coachNote = {
  coach: "Marcus R.",
  initials: "MR",
  role: "Strength Coach",
  note: "Great session yesterday. Push the bench today — I want to see 185 for 6.",
};

export const tomorrow = [
  { icon: "Dumbbell", label: "Pull B workout" },
  { icon: "Users", label: "Team standup 9am" },
  { icon: "Shirt", label: "Navy suit look" },
];

export const faceMetrics = {
  overall: 74,
  cards: [
    { name: "Symmetry", score: 81, trend: "up", desc: "Slightly improved month-over-month" },
    { name: "Golden Ratio", score: 68, trend: "up", desc: "Midface ratio approaching ideal" },
    { name: "Skin Quality", score: 72, trend: "up", desc: "Less redness in cheek zones" },
    { name: "Eye Area", score: 76, trend: "down", desc: "Under-eye darkness up slightly" },
    { name: "Jaw Definition", score: 69, trend: "up", desc: "Body fat reduction visible" },
    { name: "Overall", score: 74, trend: "up", desc: "Composite face score" },
  ],
  treatments: [
    { type: "Microneedling", when: "30 days ago" },
    { type: "Botox", when: "90 days ago" },
    { type: "Laser", when: "6 months ago" },
  ],
};

export const hair = {
  norwood: 1.5,
  density: 72,
  regimen: [
    { name: "Minoxidil 5%", route: "Topical, 1ml/night", adherence: 94, streak: "187 days" },
    { name: "Finasteride 1mg", route: "Oral, daily", adherence: 98, streak: "211 days" },
    { name: "Microneedling 1.5mm", route: "Weekly", adherence: 78, streak: "14 weeks" },
  ],
};

export const skin = {
  am: [
    { step: "Gentle Cleanser", wait: 0 },
    { step: "Vitamin C Serum", wait: 5 },
    { step: "Niacinamide", wait: 0 },
    { step: "SPF 50", wait: 0 },
  ],
  pm: [
    { step: "Oil Cleanser", wait: 0 },
    { step: "Water Cleanser", wait: 0 },
    { step: "BHA Toner", wait: 5 },
    { step: "Tretinoin 0.05%", wait: 20 },
    { step: "Moisturizer", wait: 0 },
  ],
  uv: 7,
};

export const posture = [
  { name: "Anterior Pelvic Tilt", value: "14°", ideal: "< 10°", warn: true },
  { name: "Head Forward", value: "3.2cm", ideal: "< 2cm", warn: true },
  { name: "Shoulder Protraction L/R", value: "8° / 6°", ideal: "Symmetric", warn: false },
  { name: "Leg Length Difference", value: "4mm", ideal: "< 5mm", warn: false },
];

export const voiceMetrics = {
  pitchMedian: 118,
  resonance: 64,
  fry: 12,
  rate: 148,
  overall: 71,
  drills: [
    { name: "Lip Trills", desc: "3 sets × 30s with descending pitch" },
    { name: "Resonance Hum", desc: "Hum 'mmm' through scale, focus on chest buzz" },
    { name: "Diaphragmatic Breathing", desc: "Box breathing 4-4-4-4, 10 cycles" },
  ],
};

export const wardrobe = [
  { name: "White Oxford", cat: "Tops", color: "from-zinc-300 to-zinc-100" },
  { name: "Navy Chinos", cat: "Bottoms", color: "from-blue-900 to-blue-700" },
  { name: "White Sneakers", cat: "Shoes", color: "from-zinc-200 to-white" },
  { name: "Black Tee", cat: "Tops", color: "from-zinc-900 to-zinc-800" },
  { name: "Charcoal Suit", cat: "Outerwear", color: "from-zinc-700 to-zinc-600" },
  { name: "Cream Sweater", cat: "Tops", color: "from-amber-100 to-amber-200" },
  { name: "Olive Pants", cat: "Bottoms", color: "from-lime-900 to-lime-800" },
  { name: "Brown Boots", cat: "Shoes", color: "from-amber-900 to-amber-800" },
];

export const outfits = [
  { name: "Boardroom Navy", items: 4, lastWorn: "3d ago", rating: 5 },
  { name: "Saturday Casual", items: 3, lastWorn: "1w ago", rating: 4 },
  { name: "Client Dinner", items: 5, lastWorn: "2w ago", rating: 5 },
  { name: "Travel Day", items: 4, lastWorn: "1m ago", rating: 3 },
];

export const fragrances = [
  { name: "Aventus", brand: "Creed", today: true },
  { name: "Bleu de Chanel", brand: "Chanel", today: false },
  { name: "Sauvage Elixir", brand: "Dior", today: false },
];

export const colorPalette = ["#1B3A5C", "#2C5282", "#E8C9A0", "#C9956B", "#7A5C3E", "#1A1A1A", "#F0E6D2", "#8B6F4E"];

export const learning = [
  { name: "The 48 Laws of Power", type: "Reading", pct: 60, logged: "4h 20m" },
  { name: "YC Startup School", type: "Course", pct: 35, logged: "2h 10m" },
  { name: "Founders Podcast", type: "Podcast", pct: 0, logged: "Ongoing" },
];

export const flashcards = [
  { q: "What is the first law of power?", a: "Never outshine the master." },
  { q: "What founders did Charlie Munger study most?", a: "Buffett, Singleton, Rockefeller." },
  { q: "YC's core advice for early product?", a: "Make something people want." },
  { q: "Greene's principle on enemies?", a: "Use enemies to define yourself." },
  { q: "What is 'court attention at all cost'?", a: "Stand out — be more colorful." },
];

export const journalEntries = [
  { date: "Yesterday", first: "Had a hard conversation with David...", mood: "var(--asc-teal)" },
  { date: "2 days ago", first: "Lifting felt heavy but I pushed through...", mood: "var(--asc-amber)" },
  { date: "3 days ago", first: "Realized I've been avoiding the call with...", mood: "var(--asc-coral)" },
  { date: "4 days ago", first: "Strong morning. Sun, cold, coffee, then deep work...", mood: "var(--asc-teal)" },
  { date: "5 days ago", first: "Reading Greene again. The pattern is clear...", mood: "var(--asc-teal)" },
];

export const timeBlocks = [
  { time: "6:00am", label: "Training", color: "var(--asc-teal)" },
  { time: "9:00am", label: "Deep Work Block", color: "#3b82f6" },
  { time: "11:30am", label: "Client Call", color: "var(--asc-amber)" },
  { time: "1:00pm", label: "Lunch", color: "var(--asc-muted)" },
  { time: "2:30pm", label: "Deep Work Block", color: "#3b82f6" },
  { time: "5:00pm", label: "Free", color: "var(--asc-muted)" },
];

export const timePie = [
  { label: "Deep Work", hours: 4, color: "#3b82f6" },
  { label: "Meetings", hours: 2, color: "var(--asc-amber)" },
  { label: "Training", hours: 1, color: "var(--asc-teal)" },
  { label: "Admin", hours: 1.5, color: "var(--asc-coral)" },
  { label: "Other", hours: 3.5, color: "var(--asc-muted)" },
];

export const financialSnapshot = {
  mrr: { value: 18400, delta: "+12%" },
  cash: { value: 84200, runway: "4.6mo" },
  netWorth: { value: 312000, delta: "+8% YTD" },
  mrrSeries: [9400, 10200, 11800, 12100, 12900, 13500, 14200, 14900, 15800, 16400, 17600, 18400],
  accounts: { checking: 42000, savings: 28000, investments: 14000 },
  burn: 18200,
};

export const deals = [
  { id: "d1", company: "TechCorp Partnership", value: 45000, stage: "Lead", stale: false },
  { id: "d2", company: "Riviera Hotels", value: 28000, stage: "Qualified", stale: false },
  { id: "d3", company: "Atlas Media", value: 15000, stage: "Proposal", stale: false },
  { id: "d4", company: "Dune Creative", value: 9000, stage: "Proposal", stale: false },
  { id: "d5", company: "Nexus Group", value: 62000, stage: "Negotiation", stale: true },
  { id: "d6", company: "Spruce Micro", value: 24000, stage: "Won", stale: false },
];

export const dealStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won"];

export const tasks = {
  top3: [
    { name: "Finalize Ascend investor deck", tag: "Business", done: true },
    { name: "Review Spruce Micro ad creative", tag: "Client", done: false },
    { name: "Send Atlas Media contract", tag: "Deals", done: false },
  ],
  someday: [
    "Refactor onboarding flow",
    "Write Q3 personal essay",
    "Research voice coaches in NYC",
    "Audit subscriptions",
    "Outline new course module",
    "Call Mom",
  ],
};

export const contacts = [
  { name: "James L.", company: "Sequoia", days: 52, strength: "Strong", overdue: true },
  { name: "Sara K.", company: "Andreessen", days: 38, strength: "Warm", overdue: true },
  { name: "Marcus D.", company: "Founders Fund", days: 31, strength: "Strong", overdue: true },
  { name: "Priya N.", company: "Stripe", days: 12, strength: "Warm", overdue: false },
  { name: "Diego A.", company: "Vercel", days: 8, strength: "Strong", overdue: false },
  { name: "Hannah W.", company: "Linear", days: 21, strength: "Cold", overdue: false },
  { name: "Sam O.", company: "Notion", days: 4, strength: "Strong", overdue: false },
  { name: "Chen W.", company: "Figma", days: 17, strength: "Warm", overdue: false },
];

export const objectives = [
  {
    name: "Grow agency MRR to $30k",
    pillar: "Business",
    pct: 61,
    krs: [
      { name: "MRR", current: 18400, target: 30000, unit: "$" },
      { name: "New deals/mo", current: 3, target: 5, unit: "" },
    ],
  },
  {
    name: "Ship Ascend prototype",
    pillar: "Business",
    pct: 80,
    krs: [
      { name: "Tabs complete", current: 5, target: 6, unit: "" },
      { name: "User tests", current: 4, target: 10, unit: "" },
    ],
  },
  {
    name: "Reach 10k Twitter followers",
    pillar: "Status",
    pct: 44,
    krs: [
      { name: "Followers", current: 4400, target: 10000, unit: "" },
      { name: "Posts/wk", current: 5, target: 7, unit: "" },
    ],
  },
];

export const socialSnapshot = {
  followers: 4400,
  engagementRate: 4.2,
  growth30d: 320,
};

export const coaches = [
  {
    id: "c1",
    name: "Marcus R.",
    initials: "MR",
    role: "Strength Coach",
    avail: "Mon-Fri 9am-6pm EST • Replies within 4h",
    messages: [
      { from: "coach", text: "Hey, saw your check-in. Strong week.", time: "Mon 9:02am" },
      { from: "me", text: "Thanks! Bench felt fast.", time: "Mon 9:14am" },
      { from: "coach", text: "Let's push 185×6 today.", time: "Mon 9:15am" },
      { from: "me", text: "On it.", time: "Mon 9:16am" },
      { from: "coach", text: "Send video of top set.", time: "Mon 9:17am" },
      { from: "me", text: "Will do after the session.", time: "Mon 9:18am" },
    ],
  },
  { id: "c2", name: "Elena V.", initials: "EV", role: "Nutrition Coach", avail: "Tue/Thu 10am-2pm EST", messages: [] },
  { id: "c3", name: "Coach AI", initials: "AI", role: "Always-on Assistant", avail: "24/7", messages: [] },
];

export const checkIn = {
  status: "Due in 3 days",
  last: {
    daysAgo: 7,
    adherence: { training: 95, nutrition: 88, sleep: 82, habits: 91 },
    wellbeing: [
      { name: "Energy", value: 8 },
      { name: "Mood", value: 7 },
      { name: "Stress", value: 4 },
      { name: "Soreness", value: 5 },
      { name: "Hunger", value: 6 },
      { name: "Libido", value: 8 },
    ],
    coachResponse: "Strong week. Bumping protein target — push for 195g/day.",
    update: "Your protein target was updated to 195g",
  },
};

export const reviews = [
  { exercise: "Bench Press", date: "2d ago", status: "Reviewed" },
  { exercise: "Squat", date: "5d ago", status: "Submitted" },
  { exercise: "Deadlift", date: "1w ago", status: "Reviewed" },
];

export const challenges = [
  { name: "30-Day 10k Steps Challenge", day: 18, rank: 3, of: 24 },
  { name: "March Bench PR Cycle", current: "195lb", target: "225lb" },
];

export const community = [
  { user: "Jess T.", icon: "Trophy", text: "New squat PR — 285×3!", reacts: 24, comments: 6 },
  { user: "Diego A.", icon: "Utensils", text: "Sharing my high-protein breakfast bowl recipe.", reacts: 41, comments: 12 },
  { user: "Sara M.", icon: "Image", text: "12 weeks of consistency.", reacts: 88, comments: 19 },
  { user: "Marcus R.", icon: "MessageCircle", text: "Remember: the work is the reward.", reacts: 132, comments: 8 },
];

export const fabActions = [
  { icon: "Camera", label: "Scan Food" },
  { icon: "Dumbbell", label: "Log Workout" },
  { icon: "Scale", label: "Log Weight" },
  { icon: "User", label: "Face Scan" },
  { icon: "Shirt", label: "Log Outfit" },
  { icon: "CheckSquare", label: "Check Habits" },
  { icon: "ListTodo", label: "Mark Task Done" },
  { icon: "DollarSign", label: "Money Snapshot" },
];
