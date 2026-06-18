// Arca Fit — personal trainer prototype seed
export type Goal = "Cut" | "Recomp" | "Bulk" | "Perform";
export type Status = "On track" | "At risk" | "Stalled" | "New";

export const trainer = {
  name: "Coach Mara Ellis, CSCS",
  handle: "@coachmara",
  clients: 47,
  mrr: 18960,
};

const photo = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=240&q=70`;

export type FitClient = {
  id: string;
  name: string;
  avatar: string;
  goal: Goal;
  program: string;
  startedWeeksAgo: number;
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  adherence: number; // 0-100
  lastCheckIn: string;
  status: Status;
  weightTrend: number[];
  city: string;
};

export const fitClients: FitClient[] = [
  { id: "c1",  name: "Alex Rivera",      avatar: photo("1535713875002-d1d0cf377fde"), goal: "Cut",     program: "Cut Phase 12wk",  startedWeeksAgo: 8, startWeight: 198, currentWeight: 184, targetWeight: 178, adherence: 94, lastCheckIn: "Today",      status: "On track", weightTrend: [198,196,195,193,191,189,187,184], city: "Austin, TX" },
  { id: "c2",  name: "Priya Shah",       avatar: photo("1438761681033-6461ffad8d80"), goal: "Recomp",  program: "Hypertrophy 8wk", startedWeeksAgo: 5, startWeight: 142, currentWeight: 141, targetWeight: 138, adherence: 88, lastCheckIn: "Yesterday",  status: "On track", weightTrend: [142,143,142,141,141,141,140,141], city: "Seattle, WA" },
  { id: "c3",  name: "Marcus Webb",      avatar: photo("1500648767791-00dcc994a43e"), goal: "Bulk",    program: "Lean Mass 16wk",  startedWeeksAgo: 12, startWeight: 165, currentWeight: 178, targetWeight: 185, adherence: 91, lastCheckIn: "2d ago",     status: "On track", weightTrend: [165,168,170,172,173,175,176,178], city: "Brooklyn, NY" },
  { id: "c4",  name: "Sienna Park",      avatar: photo("1494790108377-be9c29b29330"), goal: "Cut",     program: "Cut Phase 12wk",  startedWeeksAgo: 6, startWeight: 158, currentWeight: 154, targetWeight: 145, adherence: 72, lastCheckIn: "4d ago",     status: "At risk",  weightTrend: [158,157,156,156,155,155,154,154], city: "Denver, CO" },
  { id: "c5",  name: "Diego Romero",     avatar: photo("1506794778202-cad84cf45f1d"), goal: "Perform", program: "Powerbuilding",   startedWeeksAgo: 20, startWeight: 192, currentWeight: 196, targetWeight: 200, adherence: 96, lastCheckIn: "Today",      status: "On track", weightTrend: [192,193,194,194,195,195,196,196], city: "Miami, FL" },
  { id: "c6",  name: "Hana Nakamura",    avatar: photo("1487412720507-e7ab37603c6f"), goal: "Recomp",  program: "Hypertrophy 8wk", startedWeeksAgo: 3, startWeight: 128, currentWeight: 128, targetWeight: 126, adherence: 84, lastCheckIn: "Yesterday",  status: "New",      weightTrend: [128,129,128,128,128,128,128,128], city: "San Jose, CA" },
  { id: "c7",  name: "Jonah Patel",      avatar: photo("1539571696357-5a69c17a67c6"), goal: "Cut",     program: "Cut Phase 12wk",  startedWeeksAgo: 10, startWeight: 220, currentWeight: 215, targetWeight: 195, adherence: 58, lastCheckIn: "8d ago",    status: "Stalled",  weightTrend: [220,218,216,215,215,215,215,215], city: "Chicago, IL" },
  { id: "c8",  name: "Theo Lindqvist",   avatar: photo("1463453091185-61582044d556"), goal: "Bulk",    program: "Lean Mass 16wk",  startedWeeksAgo: 7, startWeight: 172, currentWeight: 179, targetWeight: 188, adherence: 89, lastCheckIn: "Today",      status: "On track", weightTrend: [172,174,175,176,177,178,178,179], city: "Boston, MA" },
  { id: "c9",  name: "Imani Brooks",     avatar: photo("1544005313-94ddf0286df2"),    goal: "Recomp",  program: "Glute Focus 10wk",startedWeeksAgo: 9, startWeight: 148, currentWeight: 147, targetWeight: 145, adherence: 93, lastCheckIn: "Today",      status: "On track", weightTrend: [148,148,148,147,147,147,147,147], city: "Atlanta, GA" },
  { id: "c10", name: "Owen Pham",        avatar: photo("1492562080023-ab3db95bfbce"), goal: "Cut",     program: "Cut Phase 12wk",  startedWeeksAgo: 4, startWeight: 188, currentWeight: 183, targetWeight: 170, adherence: 81, lastCheckIn: "Yesterday",  status: "On track", weightTrend: [188,187,186,185,184,184,183,183], city: "Portland, OR" },
  { id: "c11", name: "Naomi Carter",     avatar: photo("1517841905240-472988babdf9"), goal: "Perform", program: "Marathon Block",  startedWeeksAgo: 14, startWeight: 132, currentWeight: 130, targetWeight: 128, adherence: 90, lastCheckIn: "2d ago",     status: "On track", weightTrend: [132,131,131,130,130,130,130,130], city: "Boulder, CO" },
  { id: "c12", name: "Yusuf Aydin",      avatar: photo("1504593811423-6dd665756598"), goal: "Bulk",    program: "Lean Mass 16wk",  startedWeeksAgo: 11, startWeight: 158, currentWeight: 167, targetWeight: 175, adherence: 87, lastCheckIn: "Yesterday",  status: "On track", weightTrend: [158,160,161,163,164,165,166,167], city: "Dallas, TX" },
  { id: "c13", name: "Riley Tomás",      avatar: photo("1502323777036-f29e3972d82f"), goal: "Recomp",  program: "Hypertrophy 8wk", startedWeeksAgo: 2, startWeight: 154, currentWeight: 154, targetWeight: 150, adherence: 76, lastCheckIn: "3d ago",     status: "New",      weightTrend: [154,154,154,154,154,154,154,154], city: "Nashville, TN" },
  { id: "c14", name: "Sloane Vega",      avatar: photo("1531123897727-8f129e1688ce"), goal: "Cut",     program: "Cut Phase 12wk",  startedWeeksAgo: 15, startWeight: 175, currentWeight: 158, targetWeight: 155, adherence: 95, lastCheckIn: "Today",      status: "On track", weightTrend: [175,172,169,166,163,161,159,158], city: "LA, CA" },
];

export type WorkoutProgram = {
  id: string;
  name: string;
  weeks: number;
  daysPerWeek: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  focus: string;
  assignedTo: number;
  completion: number;
};

export const programs: WorkoutProgram[] = [
  { id: "p1", name: "Cut Phase 12wk",     weeks: 12, daysPerWeek: 5, level: "Intermediate", focus: "Fat loss · upper/lower split",         assignedTo: 14, completion: 68 },
  { id: "p2", name: "Hypertrophy 8wk",    weeks: 8,  daysPerWeek: 4, level: "Intermediate", focus: "Push/Pull/Legs · volume progression",  assignedTo: 9,  completion: 74 },
  { id: "p3", name: "Lean Mass 16wk",     weeks: 16, daysPerWeek: 5, level: "Advanced",     focus: "Surplus · compound priority",          assignedTo: 7,  completion: 52 },
  { id: "p4", name: "Powerbuilding",      weeks: 12, daysPerWeek: 4, level: "Advanced",     focus: "5/3/1 + accessories",                  assignedTo: 6,  completion: 80 },
  { id: "p5", name: "Glute Focus 10wk",   weeks: 10, daysPerWeek: 4, level: "Beginner",     focus: "Posterior chain · hypertrophy",        assignedTo: 8,  completion: 71 },
  { id: "p6", name: "Marathon Block",     weeks: 16, daysPerWeek: 6, level: "Advanced",     focus: "Run base + strength accessory",        assignedTo: 3,  completion: 62 },
];

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  sets: number;
  reps: string;
  rpe: number;
  rest: string;
};

export const sampleWeek: { day: string; title: string; exercises: Exercise[] }[] = [
  { day: "Mon", title: "Upper · Push", exercises: [
    { id: "e1", name: "Barbell Bench Press",    muscle: "Chest",    equipment: "Barbell",  sets: 4, reps: "6-8",  rpe: 8, rest: "2:30" },
    { id: "e2", name: "Incline DB Press",       muscle: "Chest",    equipment: "Dumbbell", sets: 3, reps: "8-10", rpe: 8, rest: "2:00" },
    { id: "e3", name: "Cable Lateral Raise",    muscle: "Shoulders",equipment: "Cable",    sets: 4, reps: "12-15",rpe: 9, rest: "1:00" },
    { id: "e4", name: "Tricep Rope Pushdown",   muscle: "Triceps",  equipment: "Cable",    sets: 3, reps: "10-12",rpe: 8, rest: "1:00" },
  ]},
  { day: "Tue", title: "Lower · Quad Focus", exercises: [
    { id: "e5", name: "Back Squat",             muscle: "Quads",    equipment: "Barbell",  sets: 4, reps: "5-7",  rpe: 8, rest: "3:00" },
    { id: "e6", name: "Bulgarian Split Squat",  muscle: "Quads",    equipment: "Dumbbell", sets: 3, reps: "8/leg",rpe: 8, rest: "2:00" },
    { id: "e7", name: "Leg Extension",          muscle: "Quads",    equipment: "Machine",  sets: 3, reps: "12-15",rpe: 9, rest: "1:00" },
    { id: "e8", name: "Standing Calf Raise",    muscle: "Calves",   equipment: "Machine",  sets: 4, reps: "10-12",rpe: 8, rest: "1:30" },
  ]},
  { day: "Wed", title: "Rest · Active Recovery", exercises: [] },
  { day: "Thu", title: "Upper · Pull", exercises: [
    { id: "e9",  name: "Weighted Pull-Up",      muscle: "Back",     equipment: "Bodyweight",sets: 4, reps: "5-7", rpe: 8, rest: "2:30" },
    { id: "e10", name: "Chest-Supported Row",   muscle: "Back",     equipment: "Machine",  sets: 4, reps: "8-10", rpe: 8, rest: "2:00" },
    { id: "e11", name: "Face Pull",             muscle: "Rear Delt",equipment: "Cable",    sets: 3, reps: "15",   rpe: 8, rest: "1:00" },
    { id: "e12", name: "Hammer Curl",           muscle: "Biceps",   equipment: "Dumbbell", sets: 3, reps: "10-12",rpe: 8, rest: "1:00" },
  ]},
  { day: "Fri", title: "Lower · Posterior", exercises: [
    { id: "e13", name: "Romanian Deadlift",     muscle: "Hamstrings",equipment: "Barbell", sets: 4, reps: "6-8",  rpe: 8, rest: "2:30" },
    { id: "e14", name: "Hip Thrust",            muscle: "Glutes",   equipment: "Barbell",  sets: 4, reps: "8-10", rpe: 9, rest: "2:00" },
    { id: "e15", name: "Seated Leg Curl",       muscle: "Hamstrings",equipment: "Machine", sets: 3, reps: "10-12",rpe: 9, rest: "1:00" },
  ]},
  { day: "Sat", title: "Conditioning", exercises: [] },
  { day: "Sun", title: "Rest", exercises: [] },
];

export type MealPlan = {
  id: string;
  name: string;
  protocol: string;
  calories: number;
  protein: number; carbs: number; fat: number;
  assignedTo: number;
};

export const mealPlans: MealPlan[] = [
  { id: "m1", name: "Cut · Male 180lb",    protocol: "Deficit 500kcal",   calories: 2200, protein: 200, carbs: 200, fat: 65, assignedTo: 11 },
  { id: "m2", name: "Cut · Female 145lb",  protocol: "Deficit 400kcal",   calories: 1650, protein: 145, carbs: 150, fat: 55, assignedTo: 9 },
  { id: "m3", name: "Recomp · Maintain",   protocol: "TDEE -10/+10",      calories: 2400, protein: 180, carbs: 260, fat: 75, assignedTo: 8 },
  { id: "m4", name: "Bulk · Lean Surplus", protocol: "Surplus 300kcal",   calories: 3100, protein: 210, carbs: 360, fat: 90, assignedTo: 7 },
];

export const sampleMeals = [
  { meal: "Breakfast", time: "7:00",  items: [
    { name: "Egg whites (6) + 2 whole eggs", grams: 280, kcal: 320, p: 36, c: 2,  f: 16 },
    { name: "Steel-cut oats",                 grams: 60,  kcal: 220, p: 8,  c: 40, f: 4  },
    { name: "Blueberries",                    grams: 100, kcal: 57,  p: 1,  c: 14, f: 0  },
  ]},
  { meal: "Lunch", time: "12:30", items: [
    { name: "Grilled chicken breast",         grams: 200, kcal: 330, p: 62, c: 0,  f: 7  },
    { name: "Jasmine rice (cooked)",          grams: 200, kcal: 260, p: 5,  c: 56, f: 0  },
    { name: "Mixed greens + olive oil",       grams: 120, kcal: 130, p: 2,  c: 6,  f: 12 },
  ]},
  { meal: "Snack", time: "16:00", items: [
    { name: "Greek yogurt 0% + honey",        grams: 200, kcal: 180, p: 20, c: 22, f: 0  },
    { name: "Almonds",                        grams: 20,  kcal: 116, p: 4,  c: 4,  f: 10 },
  ]},
  { meal: "Dinner", time: "19:30", items: [
    { name: "Wild salmon",                    grams: 200, kcal: 412, p: 44, c: 0,  f: 26 },
    { name: "Sweet potato",                   grams: 250, kcal: 215, p: 4,  c: 50, f: 0  },
    { name: "Asparagus + lemon",              grams: 150, kcal: 30,  p: 3,  c: 6,  f: 0  },
  ]},
];

export const foodLibrary = [
  { name: "Chicken breast (raw)", kcal: 165, p: 31, c: 0,  f: 3.6, per: "100g", tag: "Protein" },
  { name: "Egg whole",            kcal: 155, p: 13, c: 1,  f: 11,  per: "100g", tag: "Protein" },
  { name: "Greek yogurt 0%",      kcal: 59,  p: 10, c: 4,  f: 0.4, per: "100g", tag: "Protein" },
  { name: "Whey isolate",         kcal: 110, p: 25, c: 1,  f: 0.5, per: "30g",  tag: "Protein" },
  { name: "Wild salmon",          kcal: 206, p: 22, c: 0,  f: 13,  per: "100g", tag: "Protein" },
  { name: "Jasmine rice (cooked)",kcal: 130, p: 2.7,c: 28, f: 0.3, per: "100g", tag: "Carb" },
  { name: "Steel-cut oats",       kcal: 379, p: 13, c: 67, f: 7,   per: "100g", tag: "Carb" },
  { name: "Sweet potato",         kcal: 86,  p: 1.6,c: 20, f: 0.1, per: "100g", tag: "Carb" },
  { name: "Banana",               kcal: 89,  p: 1.1,c: 23, f: 0.3, per: "100g", tag: "Carb" },
  { name: "Avocado",              kcal: 160, p: 2,  c: 9,  f: 15,  per: "100g", tag: "Fat" },
  { name: "Olive oil EVOO",       kcal: 884, p: 0,  c: 0,  f: 100, per: "100g", tag: "Fat" },
  { name: "Almonds",              kcal: 579, p: 21, c: 22, f: 50,  per: "100g", tag: "Fat" },
];

export type Video = {
  id: string;
  title: string;
  durationSec: number;
  muscle: string;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumb: string;
  src: string;
  views: number;
};

const thumb = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=480&q=70`;

const SAMPLE_MP4 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const videos: Video[] = [
  { id: "v1",  title: "Barbell Bench Press · setup & cue",       durationSec: 184, muscle: "Chest",     equipment: "Barbell",   difficulty: "Intermediate", thumb: thumb("photo-1534438327276-14e5300c3a48"), src: SAMPLE_MP4, views: 1240 },
  { id: "v2",  title: "Back Squat · brace & depth",              durationSec: 212, muscle: "Quads",     equipment: "Barbell",   difficulty: "Advanced",     thumb: thumb("photo-1517836357463-d25dfeac3438"), src: SAMPLE_MP4, views: 2180 },
  { id: "v3",  title: "Romanian Deadlift · hinge pattern",       durationSec: 168, muscle: "Hamstrings",equipment: "Barbell",   difficulty: "Intermediate", thumb: thumb("photo-1581009146145-b5ef050c2e1e"), src: SAMPLE_MP4, views: 942 },
  { id: "v4",  title: "Hip Thrust · setup & contraction",        durationSec: 152, muscle: "Glutes",    equipment: "Barbell",   difficulty: "Beginner",     thumb: thumb("photo-1571019613454-1cb2f99b2d8b"), src: SAMPLE_MP4, views: 3120 },
  { id: "v5",  title: "Weighted Pull-Up · scapular control",     durationSec: 198, muscle: "Back",      equipment: "Bodyweight",difficulty: "Advanced",     thumb: thumb("photo-1598971639058-fab3c3109a00"), src: SAMPLE_MP4, views: 870 },
  { id: "v6",  title: "Bulgarian Split Squat · balance fix",     durationSec: 144, muscle: "Quads",     equipment: "Dumbbell",  difficulty: "Intermediate", thumb: thumb("photo-1599058917765-a780eda07a3e"), src: SAMPLE_MP4, views: 1430 },
  { id: "v7",  title: "Cable Lateral Raise · lean & path",       durationSec: 92,  muscle: "Shoulders", equipment: "Cable",     difficulty: "Beginner",     thumb: thumb("photo-1517344884509-a0c97ec11bcc"), src: SAMPLE_MP4, views: 760 },
  { id: "v8",  title: "Face Pull · rear delt mechanics",         durationSec: 88,  muscle: "Rear Delt", equipment: "Cable",     difficulty: "Beginner",     thumb: thumb("photo-1574680096145-d05b474e2155"), src: SAMPLE_MP4, views: 612 },
  { id: "v9",  title: "Incline DB Press · path & ROM",           durationSec: 132, muscle: "Chest",     equipment: "Dumbbell",  difficulty: "Intermediate", thumb: thumb("photo-1583500178690-f7fd39c8e3eb"), src: SAMPLE_MP4, views: 1080 },
  { id: "v10", title: "Chest-Supported Row · scapular retract",  durationSec: 124, muscle: "Back",      equipment: "Machine",   difficulty: "Beginner",     thumb: thumb("photo-1581009137042-c552e485697a"), src: SAMPLE_MP4, views: 580 },
  { id: "v11", title: "Hammer Curl · neutral grip",              durationSec: 76,  muscle: "Biceps",    equipment: "Dumbbell",  difficulty: "Beginner",     thumb: thumb("photo-1532029837206-abbe2b7620e3"), src: SAMPLE_MP4, views: 410 },
  { id: "v12", title: "Standing Calf Raise · pause variations",  durationSec: 96,  muscle: "Calves",    equipment: "Machine",   difficulty: "Beginner",     thumb: thumb("photo-1540497077202-7c8a3999166f"), src: SAMPLE_MP4, views: 322 },
  { id: "v13", title: "Form Friday · how to film your sets",     durationSec: 240, muscle: "Coaching",  equipment: "—",         difficulty: "Beginner",     thumb: thumb("photo-1518611012118-696072aa579a"), src: SAMPLE_MP4, views: 1820 },
  { id: "v14", title: "Macro Tracking 101 · weighing food",      durationSec: 312, muscle: "Nutrition", equipment: "—",         difficulty: "Beginner",     thumb: thumb("photo-1490645935967-10de6ba17061"), src: SAMPLE_MP4, views: 2340 },
  { id: "v15", title: "Mindset · breaking a plateau",            durationSec: 420, muscle: "Coaching",  equipment: "—",         difficulty: "Intermediate", thumb: thumb("photo-1483728642387-6c3bdd6c93e5"), src: SAMPLE_MP4, views: 1610 },
];

// 6-week adherence heatmap by client (rows) × week (cols 0..5), value 0-100
export const adherenceMatrix = fitClients.map((c) => ({
  client: c.name,
  weeks: Array.from({ length: 6 }, (_, w) => {
    const base = c.adherence;
    return Math.max(35, Math.min(100, Math.round(base + (Math.sin(w * 1.3 + c.id.length) * 15))));
  }),
}));

export const weeklyVolume = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  sessions: Math.round(120 + Math.sin(i / 2) * 18 + i * 2),
  checkIns: Math.round(36 + Math.sin(i / 1.5) * 6 + i * 0.6),
}));

export const upcomingCheckIns = [
  { id: "u1", client: "Alex Rivera",     when: "Today 4:00 PM",    type: "Weekly check-in" },
  { id: "u2", client: "Sienna Park",     when: "Today 5:30 PM",    type: "Form review" },
  { id: "u3", client: "Diego Romero",    when: "Tomorrow 9:00 AM", type: "Program review" },
  { id: "u4", client: "Hana Nakamura",   when: "Tomorrow 11:00 AM",type: "Onboarding" },
  { id: "u5", client: "Theo Lindqvist",  when: "Wed 8:00 AM",      type: "Weekly check-in" },
];

export const messageThreads = [
  { id: "t1",  client: "Alex Rivera",     last: "Photos uploaded for week 8 ✅",          unread: 2, when: "12m" },
  { id: "t2",  client: "Sienna Park",     last: "Quick Q on the RDL cue you sent",        unread: 1, when: "1h" },
  { id: "t3",  client: "Diego Romero",    last: "PR on squat today — 425 for 3 reps 🔥",  unread: 0, when: "3h" },
  { id: "t4",  client: "Hana Nakamura",   last: "Just sent the new meal plan, review?",   unread: 1, when: "5h" },
  { id: "t5",  client: "Jonah Patel",     last: "Missed Friday — knee bugging me",        unread: 3, when: "1d" },
  { id: "t6",  client: "Sloane Vega",     last: "Final week starts Monday!!",             unread: 0, when: "2d" },
];

export const sampleConversation = [
  { from: "client",  text: "Hey coach, finished week 8. Felt great on push day.",                  when: "Today 9:14 AM" },
  { from: "client",  text: "Photos and weigh-in uploaded.",                                          when: "Today 9:14 AM" },
  { from: "trainer", text: "Looking strong. Bench is moving — let's bump TM 2.5%.",                  when: "Today 10:02 AM" },
  { from: "client",  text: "Sounds good. One Q: should I be eating more on training days?",         when: "Today 10:30 AM" },
  { from: "trainer", text: "Yes — +200 kcal carb-skewed on lift days. I'll update your macros.",    when: "Today 10:42 AM" },
];

export const checkInCard = {
  week: 8,
  weight: 184.2,
  weightDelta: -1.4,
  mood: 8,
  energy: 7,
  sleep: 7.5,
  steps: 11240,
  notes: "Hit all sessions. Sleep dipped Thursday. Hunger manageable.",
  photos: [
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=320&q=70",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=320&q=70",
    "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=320&q=70",
  ],
};
