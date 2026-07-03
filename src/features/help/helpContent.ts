// In-app Help Center content, adapted from docs/ARCA-Master-Playbook.md.
// Written in plain English for non-technical users. Each lesson can deep-link
// to the page it teaches via `to`.

export type Lesson = {
  id: string;
  title: string;
  what: string;
  steps?: string[];
  tip?: string;
  to?: string;
  toLabel?: string;
};

export type HelpPart = {
  id: string;
  label: string;
  title: string;
  intro: string;
  lessons: Lesson[];
};

export const HELP_PARTS: HelpPart[] = [
  {
    id: "basics",
    label: "Part 0",
    title: "The basics",
    intro: "What ARCA is and how to find your way around. Start here.",
    lessons: [
      {
        id: "what-is-arca",
        title: "What ARCA is",
        what: "ARCA replaces your booking program, charts, payments, memberships spreadsheet, texting app, and marketing tool with one system where everything talks to everything. There are two sides: the Practice side (what you and your staff see) and the Client side, called the Portal (what your patients see on their phone). Anything you do on your side shows up correctly on theirs - book a visit, they see it; enable a coaching program, it appears in their app.",
      },
      {
        id: "finding-your-way",
        title: "Finding your way around",
        what: "The column on the left edge of the screen is the sidebar - the hallway of your office. Every room is listed: Front Desk, Patients, Clinical, Analytics, Coaching, and business tools.",
        steps: [
          "Click any item in the left sidebar to open that room.",
          "Use the search bar at the top middle to jump anywhere - type a patient name or an action. Shortcut: press Cmd+K (Mac) or Ctrl+K (Windows).",
          "Coach AI (top right) is your built-in assistant. Ask it questions when you're stuck.",
        ],
        tip: "You can't break anything by looking. Click through a few rooms just to explore.",
      },
    ],
  },
  {
    id: "front-desk",
    label: "Part 1",
    title: "Front desk - your day 1 skills",
    intro: "The Command Center, the Calendar, and the register. These three screens are 80% of the front-desk job.",
    lessons: [
      {
        id: "command-center",
        title: "The Command Center (your morning coffee screen)",
        what: "The first screen every morning. It answers: how are we doing, and what needs my attention?",
        steps: [
          "Read the greeting bar - it shows today's pace against target.",
          "Check the alert banner for high-risk patients needing follow-up; click Review now to see who.",
          "Scan the four number cards: Today's Revenue, Appointments, Active Members, Monthly Recurring.",
          "Look at today's schedule - click Chart next to any name to open their file.",
          "Check the alerts column: low inventory, overdue labs, unsigned notes.",
        ],
        to: "/admin/dashboard",
        toLabel: "Open the Command Center",
      },
      {
        id: "calendar",
        title: "The Calendar (your appointment book)",
        what: "Each column is a provider; each row is an hour. Colored blocks are appointments - the colored left edge shows status: blue confirmed, amber checked in, green in room, gray done.",
        steps: [
          "Click the dark Book button at top right (or hover an empty slot and click + Book).",
          "Pick the service (HRT consult, Botox, lab draw...).",
          "Pick the provider, or leave 'First available'.",
          "Pick a date and time from the open slots.",
          "Review the summary and click Confirm appointment. It's now on the calendar and in the patient's portal.",
        ],
        to: "/admin/calendar",
        toLabel: "Open the Calendar",
      },
      {
        id: "pos",
        title: "Point of Sale (taking payment)",
        what: "Use it like a register at checkout.",
        steps: [
          "Click Add line to add what you're selling.",
          "The subtotal, tax, and total calculate themselves.",
          "Click Charge. Payment captured, receipt sent.",
        ],
        to: "/admin/pos",
        toLabel: "Open Point of Sale",
      },
    ],
  },
  {
    id: "patients",
    label: "Part 2",
    title: "Your patients",
    intro: "The roster, the chart, memberships, and messaging.",
    lessons: [
      {
        id: "patient-list",
        title: "The patient list",
        what: "Every patient, searchable and filterable.",
        steps: [
          "Type in the search box to find anyone in seconds.",
          "Use the filter chips to see only HRT patients, only high-risk, only members.",
          "Click Add patient - fill the short form (name, date of birth, contact, treatment track).",
          "Click Export to download the roster as a spreadsheet.",
        ],
        to: "/admin/patients",
        toLabel: "Open Members",
      },
      {
        id: "patient-chart",
        title: "The patient chart (their whole story on one screen)",
        what: "Click any patient's name to open their file - the digital version of a thick paper folder. The left card has their photo, tags, and always-there buttons: Book visit, Charge/POS, and quick actions. Tabs across the top hold Encounters, Labs, Prescriptions, Appointments, Invoices, Membership, Notes, Documents, and Activity.",
        steps: [
          "On the Overview tab, click + Prescribe to open a prescription form: medication, directions, quantity, refills, pharmacy - then Send to pharmacy.",
          "On the Membership tab, Pause or Cancel a plan (with confirmation), or Enroll a non-member.",
          "Click through all the tabs once - you never leave their file.",
        ],
        to: "/admin/patients",
        toLabel: "Pick a patient to explore",
      },
      {
        id: "memberships",
        title: "Memberships (your recurring revenue)",
        what: "Plans like Platinum, Gold, and Silver, with member counts and the MRR chart. MRR is monthly recurring revenue - money that arrives every month automatically.",
        steps: [
          "Click New plan.",
          "Enter the name, monthly price, billing cadence, and included perks.",
          "Click Create plan.",
        ],
        to: "/admin/memberships",
        toLabel: "Open Memberships",
      },
      {
        id: "messages",
        title: "Messages (texting, the professional way)",
        what: "Two-way conversations with patients, all in one inbox.",
        steps: [
          "Click a conversation on the left; read it on the right.",
          "Type in the box at the bottom and press Send.",
          "The phone and camera icons start a call or video visit. View chart opens their file mid-conversation.",
          "Bulk message sends one announcement to a whole group.",
        ],
        to: "/admin/messages",
        toLabel: "Open Messages",
      },
    ],
  },
  {
    id: "clinical",
    label: "Part 3",
    title: "Clinical tools",
    intro: "The AI Scribe, charts, protocols, forms, photos, telehealth, and population health.",
    lessons: [
      {
        id: "ai-scribe",
        title: "The AI Scribe (your note-writer)",
        what: "It listens to the visit and writes the note for you. What used to take 15 minutes of typing now takes one review and two clicks.",
        steps: [
          "Pick the patient and provider from the two dropdowns.",
          "Click the microphone to start the visit. Talk normally - the transcript scrolls live.",
          "Click stop when done. A complete SOAP note appears (Subjective, Objective, Assessment, Plan), plus suggested diagnoses and lab orders.",
          "Review and edit anything. Click Regenerate for a fresh draft.",
          "Tick the suggested orders you want and click Queue orders.",
          "Click Push to chart. The note is saved to the patient's file.",
        ],
        to: "/admin/scribe",
        toLabel: "Open the AI Scribe",
      },
      {
        id: "charts-emr",
        title: "Charts / EMR",
        what: "Recent visit notes, one click to read, Edit to change. New encounter offers to open the AI Scribe - say yes; it's the faster way to write a note.",
        to: "/admin/charts",
        toLabel: "Open Charts/EMR",
      },
      {
        id: "protocols",
        title: "Protocols (your treatment recipes)",
        what: "A protocol is a standardized treatment path - like a recipe card for TRT, GLP-1, or peptides. Every provider follows the same playbook.",
        steps: [
          "Click + New protocol.",
          "Name it, choose the treatment track, write the dosing schedule and lab cadence.",
          "Click Create protocol.",
        ],
        to: "/admin/protocols",
        toLabel: "Open Protocols",
      },
      {
        id: "intake",
        title: "Intake & consent forms",
        what: "Forms patients fill out before treatment. See what's pending versus completed, and send forms straight to a patient's portal.",
        steps: [
          "Click New form to open the builder.",
          "Name it, pick the type (intake, consent, photo release), and start from a template or blank.",
          "Click Create form.",
        ],
        to: "/admin/intake",
        toLabel: "Open Intake & Consent",
      },
      {
        id: "photo-reviews",
        title: "Photo reviews (before & after)",
        what: "Every before/after photo set in one review queue. The lock icon means no consent on file - get consent before using photos anywhere.",
        steps: [
          "Filter by status (Needs review / Approved) or protocol (Botox, Filler, HRT...).",
          "Click a card to open the detail panel.",
          "Drag the slider to compare before/after, add notes, and click Approve.",
          "Upload photos adds a new set.",
        ],
        to: "/admin/photo-reviews",
        toLabel: "Open Photo Reviews",
      },
      {
        id: "telehealth",
        title: "Telehealth & RPM (video visits)",
        what: "Your virtual waiting room. Patients appear in the queue as Ready or Scheduled. RPM means remote patient monitoring - home device readings like blood pressure and weight, with alerts when something is out of range.",
        steps: [
          "Click Join now on a ready patient to enter the video room.",
          "Inside: mute, camera, screen share, chat - and a notes panel where you can type the SOAP note during the call and Save to chart.",
          "Pre-call runs the checklist first (camera works, consent confirmed).",
          "Check the RPM devices and Alerts tabs; click the action button on an alert to handle it.",
        ],
        to: "/admin/telehealth",
        toLabel: "Open Telehealth & RPM",
      },
      {
        id: "population",
        title: "Population health (no patient left behind)",
        what: "Instead of one patient at a time, this looks across all of them. Registries are groups (everyone with diabetes, everyone on hormones). Care gaps are things patients are overdue for.",
        steps: [
          "Click a registry card to see its gaps.",
          "Work the care-gaps worklist - each row says exactly who is overdue for what, with an action button.",
          "Click Run outreach to send reminders to everyone with an open gap - one click, hundreds nudged.",
          "New registry creates a new group: name, condition, inclusion criteria.",
        ],
        to: "/admin/population",
        toLabel: "Open Population Health",
      },
    ],
  },
  {
    id: "getting-paid",
    label: "Part 4",
    title: "Getting paid",
    intro: "Inventory, insurance billing, and staying stocked.",
    lessons: [
      {
        id: "inventory",
        title: "Inventory",
        what: "Every vial and product: stock levels, lot numbers, expiry, and reorder alerts. When something runs low it flags itself.",
        steps: [
          "Click Reorder on anything flagged low.",
          "Click Add SKU to track a new product: name, category, units on hand, reorder point. (A SKU is just 'a product you track.')",
        ],
        to: "/admin/inventory",
        toLabel: "Open Inventory",
      },
      {
        id: "rcm",
        title: "Insurance & billing (RCM)",
        what: "If you bill insurance, this is mission control. A/R is money owed to you. Denials are claims insurance rejected.",
        steps: [
          "Click Appeal on a denial, or select several and Auto-appeal.",
          "Review the AI coding tab - it suggests better billing codes visit by visit. Accept or Reject each one. Accepted codes are money you'd have left on the table.",
          "Submit batch sends your claims; Export 837 downloads the standard claims file.",
        ],
        to: "/admin/rcm",
        toLabel: "Open Billing/RCM",
      },
    ],
  },
  {
    id: "growth",
    label: "Part 5",
    title: "Growing the practice",
    intro: "Leads, marketing that runs itself, reviews, your website, and the numbers that matter.",
    lessons: [
      {
        id: "leads",
        title: "Leads & pipeline",
        what: "Every inquiry that hasn't become a patient yet, organized by stage: New, Contacted, Consult, Won.",
        steps: [
          "Click New lead.",
          "Enter their name, contact, source, and what they're interested in.",
          "Click Add lead.",
        ],
        to: "/admin/leads",
        toLabel: "Open Leads",
      },
      {
        id: "automations",
        title: "Email & SMS automations (marketing while you sleep)",
        what: "Automations are messages that send themselves when something happens: a welcome text to every new lead, a follow-up after every visit, a birthday note. Each card shows results - sent count and open rate.",
        steps: [
          "Pause or resume any automation with one click.",
          "Click the pencil to edit its trigger, timing, and message.",
          "Click New automation: name, trigger, channel (SMS/email), timing, message.",
        ],
        to: "/admin/email-sms",
        toLabel: "Open Automations",
      },
      {
        id: "reputation",
        title: "Reputation (your reviews)",
        what: "Your Google and Yelp ratings in one place. Reviews needing a response are flagged.",
        steps: [
          "Click Send review requests - it texts recent happy patients a review link. The single best way to climb Google.",
          "Click Draft reply on a flagged review - the AI writes a professional response for you to approve.",
        ],
        to: "/admin/reputation",
        toLabel: "Open Reputation",
      },
      {
        id: "website",
        title: "Website",
        what: "Your public site, connected to your booking system.",
        steps: [
          "Preview shows unpublished changes.",
          "Publish makes them live.",
          "Edit blocks rearranges sections.",
        ],
        to: "/admin/website",
        toLabel: "Open Website",
      },
      {
        id: "analytics",
        title: "Analytics",
        what: "Revenue, acquisition funnel, channel performance. The habit worth building: check revenue vs target weekly, and where new patients came from monthly - it tells you where to spend.",
        to: "/admin/analytics",
        toLabel: "Open Analytics",
      },
    ],
  },
  {
    id: "coaching",
    label: "Part 6",
    title: "Coaching (the ARCA Pro side)",
    intro: "For trainers, coaches, and practices offering ongoing programs. Built around one big idea: three programs per client, and you control what each client sees.",
    lessons: [
      {
        id: "three-programs",
        title: "The three programs",
        what: "Every client can be given up to three kinds of program. Fitness: workouts and training plans. Health: meal plans, macros, diets. Protocol: regimens - skincare routines, HRT dosing, GLP-1 schedules, supplements. You decide which programs each client sees; their app shows only what you switch on.",
      },
      {
        id: "clients",
        title: "Your clients and the program toggles",
        what: "The roster shows adherence scores and status (On track / At risk / Stalled). Open a client and find the 'Coaching programs' card - the control panel with three switches: Fitness, Health, Protocol.",
        steps: [
          "Flip a switch on - that program instantly appears in the client's app.",
          "Flip it off - it disappears. The counter shows how many are on (e.g. 2/3).",
          "Click Preview client portal to see exactly what that client sees on their phone.",
        ],
        to: "/admin/fit/clients",
        toLabel: "Open Clients",
      },
      {
        id: "client-tabs",
        title: "The client profile tabs",
        what: "Progress: weight trend, before/after photos, personal records. Results: the Outcome Report - your proof. Program: their training week. Nutrition: daily macros and adherence. Protocol: their regimen with Send to client and Swap protocol. Check-ins: weekly numbers, mood, sleep, photos. Messages: your conversation.",
        to: "/admin/fit/clients",
        toLabel: "Open a client profile",
      },
      {
        id: "programs-fitness",
        title: "Building programs (Fitness)",
        what: "The Fitness library holds your workout programs (Cut Phase 12wk, Hypertrophy 8wk...). The Program Builder is where you build: weeks across the top, sessions and exercises within each.",
        steps: [
          "Open any program to see details; Assign links you to pick a client; Duplicate copies it.",
          "In the Builder, add sessions and exercises, then click Publish to save it to your library.",
        ],
        to: "/admin/fit/workouts",
        toLabel: "Open the Fitness library",
      },
      {
        id: "meal-plans",
        title: "Meal plans (Health)",
        what: "Plans with calories and macro targets, plus a searchable food library.",
        steps: [
          "Click New plan.",
          "Enter the name, daily calories, and protein/carbs/fat targets.",
          "Click Create plan.",
        ],
        to: "/admin/fit/nutrition",
        toLabel: "Open Health plans",
      },
      {
        id: "protocol-library",
        title: "The Protocol library",
        what: "Ready-made regimens - Brightening Skincare, Female HRT, GLP-1 Weight Management, Longevity - each with AM/PM steps, a supplement stack, and a dosing schedule.",
        steps: [
          "Click a template on the left to review it.",
          "Assign to client takes you to the roster to pick who gets it.",
          "New protocol creates your own: name, category, duration, summary.",
        ],
        to: "/admin/fit/protocols",
        toLabel: "Open the Protocol library",
      },
      {
        id: "outcome-reports",
        title: "Outcome reports (your proof, your sales tool)",
        what: "One page combines before/after photos, the weight trend, body composition changes, and - the part nobody else can show - clinical markers (A1c, cholesterol, resting heart rate, vitamin D) all improving. This report is why clients stay.",
        steps: [
          "Open any client and click the Results tab.",
          "Click Open shareable report - a clean page with Print/PDF and Share.",
          "Share copies a link the client can open with no login. Send it at re-sign time.",
        ],
        to: "/admin/fit/clients",
        toLabel: "Open a client's Results",
      },
      {
        id: "coaching-business",
        title: "Running the coaching business",
        what: "Packages & Billing holds your offers - click New package (name, price, cadence, what's included) or Edit on any card. Also here: Body Scans, Form Reviews (watch a client's lift, annotate, Send review), Challenges with leaderboards, your Video Library, and your public Coach Portal page.",
        to: "/admin/fit/billing",
        toLabel: "Open Packages & Billing",
      },
    ],
  },
  {
    id: "client-side",
    label: "Part 7",
    title: "What your clients see",
    intro: "Spend 10 minutes here - when a client calls confused, you'll know their screen.",
    lessons: [
      {
        id: "patient-portal",
        title: "The patient portal",
        what: "Top to bottom they see: a greeting with their care streak, their next visit (with Reschedule and Join visit buttons), today's medications (they tap the circle to mark a dose taken), latest lab results in plain language, messages from you, and quick actions. They can book, reschedule, cancel, join a video visit, and read past visit notes.",
        to: "/portal",
        toLabel: "View the patient portal",
      },
      {
        id: "coaching-portal",
        title: "The coaching portal",
        what: "A coached client sees only the programs you enabled: their training week (tap a day to see exercises), their macros and meals, their protocol steps and supplements. If nothing is enabled yet, they see 'Your coach will enable your programs soon.'",
        to: "/coaching/c1",
        toLabel: "View a sample coaching portal",
      },
    ],
  },
  {
    id: "compliance",
    label: "Part 8",
    title: "Safety & compliance",
    intro: "What protects you automatically, and the one rule for staff.",
    lessons: [
      {
        id: "automatic-protection",
        title: "What's protecting you automatically",
        what: "Every record is encrypted (scrambled so only authorized people can read it). Every look at every chart is logged - who, what, when. That's the audit log. Patient consent is tracked (remember the lock icon in Photo Reviews).",
      },
      {
        id: "hipaa-page",
        title: "The HIPAA page",
        what: "The audit log with one-click Export for inspectors, access roles (who on your team can see what - click Edit to adjust), and compliance tasks with due dates.",
        steps: [
          "Click Export log to download the tamper-evident access log.",
          "Review access roles and click Edit to adjust permissions.",
          "Work the compliance tasks list - Resolve or Schedule each item.",
        ],
        tip: "The one rule for staff: never share your login. The audit log is only meaningful if everyone signs in as themselves.",
        to: "/admin/hipaa",
        toLabel: "Open the HIPAA page",
      },
    ],
  },
  {
    id: "routines",
    label: "Part 9",
    title: "Your routines (the actual playbook)",
    intro: "The habits that make the system run itself.",
    lessons: [
      {
        id: "daily",
        title: "Every morning (5 minutes)",
        what: "Command Center first.",
        steps: [
          "Read the alert banner.",
          "Scan today's schedule.",
          "Check the alerts column.",
        ],
        to: "/admin/dashboard",
        toLabel: "Open the Command Center",
      },
      {
        id: "during-day",
        title: "During the day",
        what: "The working rhythm.",
        steps: [
          "Book from the Calendar.",
          "Check out through Point of Sale.",
          "Write notes through the AI Scribe, same day.",
          "Reply to Messages between patients.",
        ],
      },
      {
        id: "weekly",
        title: "Every Friday (20 minutes)",
        what: "The weekly sweep.",
        steps: [
          "Photo Reviews queue to zero.",
          "Population Health: run outreach on open gaps.",
          "Reputation: send review requests.",
          "Glance at revenue vs target.",
        ],
      },
      {
        id: "monthly",
        title: "Monthly (30 minutes)",
        what: "The owner's check-in.",
        steps: [
          "Analytics: where did new patients come from?",
          "Memberships: is MRR growing?",
          "Inventory: anything expiring?",
          "Coaching: flip through Results tabs; send an Outcome Report to anyone up for renewal.",
        ],
      },
    ],
  },
];

export const GLOSSARY: { term: string; def: string }[] = [
  { term: "Portal", def: "The app your patient or client sees" },
  { term: "Chart / EMR", def: "The patient's digital file" },
  { term: "SOAP note", def: "The standard 4-part visit note" },
  { term: "Protocol", def: "A standardized treatment recipe" },
  { term: "MRR", def: "Monthly recurring revenue - subscription money" },
  { term: "SKU", def: "A product you track in inventory" },
  { term: "A/R", def: "Accounts receivable - money owed to you" },
  { term: "Denial", def: "An insurance claim that was rejected" },
  { term: "Registry", def: "A group of patients with something in common" },
  { term: "Care gap", def: "Something a patient is overdue for" },
  { term: "Automation", def: "A message that sends itself on a trigger" },
  { term: "Adherence", def: "How consistently a client follows their program" },
  { term: "Outcome Report", def: "The shareable proof-of-results page" },
  { term: "RPM", def: "Remote patient monitoring - home device readings" },
  { term: "Audit log", def: "The record of who viewed what, and when" },
];
