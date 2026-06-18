// Content data for marketing pages: features and blog posts.

export type FeatureContent = {
  slug: string;
  icon: string; // lucide icon name
  category: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  hero: string;
  capabilities: { title: string; body: string }[];
  metrics: { label: string; value: string }[];
  workflow: { step: string; title: string; body: string }[];
  faq: { q: string; a: string }[];
};

export const FEATURES: FeatureContent[] = [
  {
    slug: "scheduling",
    icon: "Calendar",
    category: "Operations",
    title: "Smart Scheduling",
    tagline: "Fill every chair. Without lifting a finger.",
    description:
      "Real-time availability across providers and rooms. Online booking with deposits. Automated reminders. Waitlist management. Walk-in mode.",
    longDescription:
      "ARCA Rx Scheduling is built for clinical practices that lose money the moment a chair sits empty. We rebuilt the booking engine from scratch around how aesthetic, HRT, and functional medicine practices actually work — multi-provider, multi-room, deposit-gated, recoverable.",
    hero: "from-teal-50 to-white",
    capabilities: [
      { title: "Multi-resource booking", body: "Schedule provider + room + equipment in a single transaction. No more double-booked lasers." },
      { title: "Deposit-gated checkout", body: "Require 25-100% deposit to lock the slot. Cut no-shows by 73% on average." },
      { title: "Smart waitlist", body: "Auto-fill cancellations within 4 minutes via SMS waterfall. Recover $4,200/mo in lost revenue." },
      { title: "Reminder cascades", body: "SMS + email + voice cascades at 72h / 24h / 2h. HIPAA-safe templates." },
      { title: "Walk-in mode", body: "Kiosk + iPad mode for high-volume clinics. Self check-in with insurance capture." },
      { title: "Block scheduling", body: "Color-block providers by service type. Surge price peak hours automatically." },
    ],
    metrics: [
      { label: "No-show reduction", value: "73%" },
      { label: "Avg revenue recovered/mo", value: "$4.2K" },
      { label: "Booking speed", value: "47s" },
    ],
    workflow: [
      { step: "01", title: "Patient books online", body: "Public booking widget on your site captures patient, service, deposit." },
      { step: "02", title: "ARCA assigns resources", body: "Engine picks provider + room + equipment, blocks the slot." },
      { step: "03", title: "Reminders fire", body: "72/24/2-hour SMS cascade with confirm/cancel links." },
      { step: "04", title: "Show or recover", body: "If they cancel, waitlist auto-fills within minutes." },
    ],
    faq: [
      { q: "Does it work with my existing calendar?", a: "Two-way sync with Google Calendar, Outlook, and iCloud. Your providers see appointments where they already live." },
      { q: "Can patients book without an account?", a: "Yes. First-time bookings capture name, DOB, phone, and email. No account creation friction." },
    ],
  },
  {
    slug: "clinical-emr",
    icon: "ClipboardList",
    category: "Clinical",
    title: "Clinical EMR",
    tagline: "Charting built for aesthetics, HRT, and functional medicine.",
    description:
      "HIPAA-compliant charting. Neurotoxin face diagrams. Filler mapping. Before and after management.",
    longDescription:
      "Generic EMRs were built for primary care. ARCA Rx EMR was built for the clinics generic EMRs make miserable — injectors, HRT prescribers, functional medicine doctors, IV therapy clinics. Every template, every diagram, every shortcut is designed for the work you actually do.",
    hero: "from-blue-50 to-white",
    capabilities: [
      { title: "Aesthetic templates", body: "Pre-built SOAP templates for Botox, fillers, threads, IV, peels, microneedling. Sign in 47s." },
      { title: "Face & body diagrams", body: "Tap-to-chart neurotoxin units per zone. Filler volume mapping by syringe. Print to chart." },
      { title: "HRT protocols", body: "Lab-driven dosing protocols. eRx for testosterone, estradiol, GLP-1s. DEA-ready." },
      { title: "Photo management", body: "Before/after capture with consent capture. Side-by-side, watermarked, marketing-ready." },
      { title: "Lab integrations", body: "Quest, LabCorp, Rupa, and DUTCH. Results auto-attached to chart." },
      { title: "E-signatures", body: "Patient consent forms signed on iPad. Routed and stored in chart automatically." },
    ],
    metrics: [
      { label: "Avg charting time", value: "47s" },
      { label: "HIPAA findings (2026)", value: "0" },
      { label: "Templates included", value: "180+" },
    ],
    workflow: [
      { step: "01", title: "Patient arrives", body: "Pre-visit consent + intake auto-loaded to chart." },
      { step: "02", title: "Provider charts in 47s", body: "Tap-to-chart diagrams + voice notes for SOAP." },
      { step: "03", title: "Auto-eRx + lab order", body: "Send Rx and lab orders straight from the chart." },
      { step: "04", title: "Follow-up booked", body: "EMR triggers booking suggestion + protocol reminder." },
    ],
    faq: [
      { q: "Is it HIPAA compliant?", a: "Yes. SOC 2 Type II, HITRUST r2, HIPAA BAA included. Audit logs on every chart action." },
      { q: "Can I migrate from Aesthetic Record or Symplast?", a: "We run free white-glove migrations. Charts, photos, and consent forms come over with audit history intact." },
    ],
  },
  {
    slug: "point-of-sale",
    icon: "CreditCard",
    category: "Revenue",
    title: "Point of Sale",
    tagline: "Every dollar your practice earns, captured in one place.",
    description:
      "Full-featured POS with split payments, membership credits, packages, gift cards, and Stripe Terminal for in-person payments.",
    longDescription:
      "Most clinical POS systems treat retail like an afterthought. ARCA Rx POS is a real point of sale — built for practices that sell services, products, memberships, packages, and gift cards in the same transaction without making the front desk hate their life.",
    hero: "from-emerald-50 to-white",
    capabilities: [
      { title: "Split tender", body: "Combine card, cash, membership credit, gift card, and HSA on one ticket. Receipts itemized." },
      { title: "Stripe Terminal", body: "Tap, chip, swipe. Tip prompts. Surcharge support. Same hardware, lower fees." },
      { title: "Membership credits", body: "Auto-apply monthly credits to qualifying services. Roll forward, expire, or cap." },
      { title: "Packages & series", body: "Sell 6-pack laser, redeem visit by visit. Tracks remaining, expirations, transfers." },
      { title: "Gift cards", body: "Digital + physical gift cards. Email delivery, balance lookup, fraud limits." },
      { title: "Inventory linked", body: "Selling product? Inventory decrements. Below reorder? PO drafted automatically." },
    ],
    metrics: [
      { label: "Avg ticket lift", value: "+22%" },
      { label: "Membership attach rate", value: "34%" },
      { label: "Checkout time", value: "31s" },
    ],
    workflow: [
      { step: "01", title: "Service complete", body: "Chart closes, ticket pre-populates with service + add-ons." },
      { step: "02", title: "Front desk reviews", body: "Apply membership credit, package redemption, retail." },
      { step: "03", title: "Tap to pay", body: "Stripe Terminal. Tip prompt. Receipt by SMS." },
      { step: "04", title: "Books rebook", body: "Same screen prompts the next visit. Done." },
    ],
    faq: [
      { q: "What are the processing fees?", a: "2.6% + 10¢ in-person, 2.9% + 30¢ online. Volume discounts above $50K/mo." },
      { q: "Can I use my existing terminals?", a: "Stripe-issued terminals only. We ship one free with every Pro plan." },
    ],
  },
  {
    slug: "growth-analytics",
    icon: "BarChart3",
    category: "Growth",
    title: "Growth Analytics",
    tagline: "Every dollar in. Every dollar out. Attributed.",
    description:
      "Complete funnel from ad impression to closed ticket. Paid channel attribution. Churn prediction. Revenue forecasting. AI-generated weekly insights.",
    longDescription:
      "If your dashboard can't tell you which Instagram ad produced last Tuesday's Botox revenue, it's not a dashboard. ARCA Analytics joins your marketing spend, your booking funnel, your chart data, and your POS into a single closed-loop view of the business.",
    hero: "from-violet-50 to-white",
    capabilities: [
      { title: "Closed-loop attribution", body: "Connect Meta, Google, TikTok ad spend to actual ticket revenue. UTM-tagged automatically." },
      { title: "LTV by acquisition source", body: "See which channels deliver patients worth $2K vs $200 over 24 months." },
      { title: "Churn prediction", body: "ML model flags at-risk patients 30 days before they ghost. Trigger save flows." },
      { title: "Forecasting", body: "Rolling 90-day revenue forecast with confidence intervals. Tied to booked appointments." },
      { title: "Provider performance", body: "Revenue per hour per provider. Retention by injector. Rebook rate by service." },
      { title: "Weekly AI insights", body: "Monday morning email with the 3 things that matter most this week, in plain English." },
    ],
    metrics: [
      { label: "Attribution accuracy", value: "94%" },
      { label: "Forecast variance", value: "±6%" },
      { label: "Avg weekly insight", value: "12 min" },
    ],
    workflow: [
      { step: "01", title: "Connect ad accounts", body: "Meta, Google, TikTok via OAuth. 90 seconds." },
      { step: "02", title: "ARCA tags + tracks", body: "Every booking link gets attribution. Every ticket gets a source." },
      { step: "03", title: "Cohorts build automatically", body: "LTV, retention, churn by channel, provider, service." },
      { step: "04", title: "Monday morning email", body: "AI summary: what's working, what's broken, what to do." },
    ],
    faq: [
      { q: "Do I need a separate analytics tool?", a: "No. ARCA Analytics replaces Whatagraph, Triple Whale, and any spreadsheet you're maintaining today." },
      { q: "What about Google Analytics?", a: "We export to GA4 if you want it, but most customers turn it off after 60 days." },
    ],
  },
  {
    slug: "patient-engagement",
    icon: "Users",
    category: "Retention",
    title: "Patient Engagement",
    tagline: "The patient app that turns one-timers into ten-timers.",
    description:
      "The Lucid patient app. Protocol delivery, progress photos, coach messaging, telehealth video, and a loyalty program that retains.",
    longDescription:
      "Most practices lose 60% of new patients within 90 days. Not because the work was bad — because nothing happened after they left. Lucid, the ARCA Rx patient app, is the connective tissue: protocols, photos, messages, telehealth, rewards. All white-labeled to your brand.",
    hero: "from-amber-50 to-white",
    capabilities: [
      { title: "White-labeled app", body: "Your logo, your colors, your domain. Patients install your brand from the App Store." },
      { title: "Protocol delivery", body: "Day-by-day protocols for HRT, peptides, GLP-1s, supplements. Push notifications + checklists." },
      { title: "Progress photos", body: "In-app photo capture with pose guides. Charted in EMR automatically." },
      { title: "Coach messaging", body: "HIPAA-secure two-way messaging. Triage rules route to MA, RN, or provider." },
      { title: "Telehealth video", body: "Native HD video with chart open. No Zoom links. No Doxy.me." },
      { title: "Loyalty + referrals", body: "Points per visit, per dollar, per referral. Redeem in-app. Drives 18% rebook lift." },
    ],
    metrics: [
      { label: "90-day retention lift", value: "+38%" },
      { label: "App install rate", value: "71%" },
      { label: "Coach message SLA", value: "< 2 hrs" },
    ],
    workflow: [
      { step: "01", title: "Patient gets invite", body: "SMS link installs your app on their phone post-visit." },
      { step: "02", title: "Protocol activates", body: "Day 1 routine pushes. Checklists, photos, supplements." },
      { step: "03", title: "Coach checks in", body: "Auto-message every 14 days. Issues escalate to provider." },
      { step: "04", title: "Rebook triggers", body: "Points + protocol completion = next visit booked." },
    ],
    faq: [
      { q: "Is the app really white-labeled?", a: "Fully. Your logo, your brand colors, your app store listing. Patients never see ARCA." },
      { q: "What does it cost extra?", a: "Included in Pro and Scale plans. Starter is $49/mo to add." },
    ],
  },
  {
    slug: "website-builder",
    icon: "Globe",
    category: "Acquisition",
    title: "Website Builder",
    tagline: "Your practice website. Live in under an hour. Booking native.",
    description:
      "A professionally designed practice website natively connected to your ARCA Rx data. Booking widget embedded. Goes live in under an hour.",
    longDescription:
      "Stop paying $4,000 to an agency that ships a WordPress site in 12 weeks. ARCA Sites are professionally designed, conversion-optimized practice websites that ship in an hour and are natively connected to your booking, EMR, and POS data.",
    hero: "from-rose-50 to-white",
    capabilities: [
      { title: "30+ design templates", body: "Awwwards-tier templates designed for medical spas, HRT, IV, functional. Pick one in 5 min." },
      { title: "Native booking widget", body: "Real-time availability, deposits, intake — embedded in your site, not iframe-junk." },
      { title: "AI-written copy", body: "Service pages, FAQs, bios drafted by AI from your data. Edit in plain English." },
      { title: "Custom domain", body: "Bring your own domain. SSL, CDN, edge caching included. 99.99% uptime." },
      { title: "SEO out of the box", body: "Schema markup, sitemap, structured data. Local SEO templates for every service." },
      { title: "Conversion analytics", body: "Heat maps, scroll depth, drop-off. Every booking attributed to its source page." },
    ],
    metrics: [
      { label: "Avg launch time", value: "47 min" },
      { label: "Booking conversion lift", value: "+62%" },
      { label: "Lighthouse score", value: "98" },
    ],
    workflow: [
      { step: "01", title: "Pick a template", body: "30+ designs. Filter by specialty, vibe, length." },
      { step: "02", title: "AI fills the copy", body: "Pulled from your services, providers, bios in ARCA." },
      { step: "03", title: "Connect your domain", body: "Cloudflare-routed. SSL in 3 min." },
      { step: "04", title: "Goes live + tracked", body: "Every booking attributed. Every page tracked." },
    ],
    faq: [
      { q: "Can I keep my existing website?", a: "Yes. The booking widget embeds anywhere — WordPress, Squarespace, Webflow, custom." },
      { q: "What about my domain?", a: "Point your DNS to us. We handle SSL, CDN, and uptime. Keep your existing email." },
    ],
  },
  {
    slug: "multi-location",
    icon: "MapPin",
    category: "Scale",
    title: "Multi-Location",
    tagline: "Run 2 or 200 locations like they're one practice.",
    description:
      "Centralized billing, unified inventory, cross-location booking, group reporting, and per-location compliance — all in one tenant.",
    longDescription:
      "Most clinical software falls apart at location 2. ARCA Rx was architected from day one for multi-location practices, DSOs, and franchise groups. One tenant, infinite locations, granular permissions.",
    hero: "from-cyan-50 to-white",
    capabilities: [
      { title: "Cross-location booking", body: "Patient can book at any location, see consolidated visit history." },
      { title: "Unified inventory", body: "Transfer SKUs between locations with audit trail. Group purchasing discounts." },
      { title: "Group reporting", body: "Roll up KPIs by region, brand, owner. Drill into single location in one click." },
      { title: "Per-location compliance", body: "State-specific protocols, supervising physician rules, formulary by location." },
      { title: "Centralized billing", body: "One Stripe account, automatic location splits, consolidated 1099s." },
      { title: "Granular permissions", body: "Role-based access by location. Regional managers, owners, providers, MAs." },
    ],
    metrics: [
      { label: "Largest deployment", value: "47 locations" },
      { label: "Setup time per loc", value: "< 1 day" },
      { label: "Avg data unification", value: "100%" },
    ],
    workflow: [
      { step: "01", title: "Spin up location", body: "Clone settings from existing location in 3 clicks." },
      { step: "02", title: "Configure compliance", body: "State formulary, supervising MD, hours, providers." },
      { step: "03", title: "Patients book anywhere", body: "Single patient record, multi-location history." },
      { step: "04", title: "Owner sees roll-up", body: "Group dashboard rolls revenue, retention, KPIs." },
    ],
    faq: [
      { q: "Is there a per-location fee?", a: "Locations 2-5 are 50% off. Locations 6+ are 30% off. Quote on 10+." },
      { q: "Can locations have different branding?", a: "Yes. Each location can have its own brand, domain, and website." },
    ],
  },
  {
    slug: "hipaa-security",
    icon: "ShieldCheck",
    category: "Trust",
    title: "HIPAA & Security",
    tagline: "Built like a bank. Audited like a hospital.",
    description:
      "SOC 2 Type II. HITRUST r2. HIPAA BAA included. End-to-end encryption. Audit logs on every action. Compliant by default.",
    longDescription:
      "Your patients trust you with their bodies and their data. ARCA Rx is built to meet the highest healthcare security standards in the industry — and to keep you out of the OCR's inbox.",
    hero: "from-slate-50 to-white",
    capabilities: [
      { title: "SOC 2 Type II", body: "Annual third-party audit. Report available on request under NDA." },
      { title: "HITRUST r2", body: "The gold standard for healthcare. Re-certified annually." },
      { title: "HIPAA BAA included", body: "Signed BAA in your contract, no upcharge, no negotiation." },
      { title: "End-to-end encryption", body: "AES-256 at rest, TLS 1.3 in transit, KMS-managed keys." },
      { title: "Audit logs", body: "Every read, every write, every login. Tamper-evident, 7-year retention." },
      { title: "MFA + SSO", body: "TOTP, WebAuthn, Okta, Google Workspace. Enforced by role." },
    ],
    metrics: [
      { label: "Breaches since launch", value: "0" },
      { label: "Avg uptime", value: "99.99%" },
      { label: "OCR audit findings", value: "0" },
    ],
    workflow: [
      { step: "01", title: "Sign BAA", body: "Included in your service agreement. No add-on cost." },
      { step: "02", title: "Configure SSO", body: "Okta, Google Workspace, Azure AD. Enforce MFA." },
      { step: "03", title: "Set role permissions", body: "Granular role-based access. PHI access logged." },
      { step: "04", title: "Sleep well", body: "ARCA monitors, audits, and reports. You run the practice." },
    ],
    faq: [
      { q: "Can I get the SOC 2 report?", a: "Yes, under NDA. Email security@arca.rx for the latest report." },
      { q: "What happens in a breach?", a: "Incident response in 4 hours, OCR notification handled by our security team, patient notification templates included." },
    ],
  },
];

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  author: { name: string; role: string };
  sections: { heading: string; body: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "med-spa-software-comparison-2026",
    category: "Buying guides",
    title: "Med Spa Software in 2026: A Brutally Honest Comparison of 9 Platforms",
    excerpt:
      "We spent 60 hours inside Aesthetic Record, Symplast, Mangomint, Vagaro, Mindbody, Boulevard, Patientnow, Nextech, and ARCA Rx. Here's what we found.",
    readTime: "12 min read",
    publishedAt: "March 14, 2026",
    author: { name: "Lena Whitmore", role: "Head of Growth, ARCA Rx" },
    sections: [
      { heading: "Why this comparison exists", body: "Every practice owner we talk to has been burned by software at least once. Two-year contracts, hidden modules, $40K migration fees, support that ghosts you. We built ARCA Rx because we believed the category needed to be reset — but we also believe you deserve a straight answer about every alternative before you pick us." },
      { heading: "The shortlist", body: "Aesthetic Record and Symplast lead the legacy med spa EMR category, but both feel like 2014. Patientnow and Nextech serve larger groups but require an implementation budget most practices don't have. Mangomint, Boulevard, and Vagaro are excellent spa software but lack real clinical capabilities — no eRx, no diagnosis codes, no clinical templates. Mindbody is the legacy giant most practices are actively trying to leave." },
      { heading: "How we scored each platform", body: "We graded each on 14 axes: scheduling depth, EMR fitness, POS quality, payments cost, growth/analytics, patient app, website builder, multi-location, HIPAA posture, support, contract terms, migration support, total cost of ownership, and pace of product updates. Total score out of 140." },
      { heading: "The verdict", body: "If you run a multi-modal practice — aesthetics + HRT + IV + functional — ARCA Rx is the only platform that does all of it natively. If you're a single-service med spa with simple workflows, Aesthetic Record or Mangomint are fine, but you'll outgrow them. If you're 5+ locations, Patientnow and ARCA Rx are the real contenders." },
    ],
  },
  {
    slug: "hipaa-compliance-checklist-aesthetic-practices",
    category: "Compliance",
    title: "The 2026 HIPAA Compliance Checklist Every Aesthetic Practice Needs",
    excerpt:
      "OCR audits of aesthetic practices are up 240% since 2024. Here's the 47-item checklist our compliance team uses with every new ARCA customer.",
    readTime: "9 min read",
    publishedAt: "March 7, 2026",
    author: { name: "Marcus Tate, JD", role: "Director of Compliance, ARCA Rx" },
    sections: [
      { heading: "Why OCR is paying attention to aesthetics", body: "Aesthetic medicine sits at a strange intersection: high-revenue, often cash-pay, lightly regulated state-to-state, and very photographed. Patients filing complaints because their before/after ended up on Instagram have caused OCR enforcement actions to skyrocket." },
      { heading: "The 47-item checklist", body: "We break it into seven sections: administrative safeguards, physical safeguards, technical safeguards, photo and consent management, marketing material handling, breach preparedness, and ongoing training. Each item includes the regulation citation and a concrete control to implement." },
      { heading: "The five most-missed items", body: "1. Unique user logins (no shared MA accounts). 2. PHI access logs you actually review. 3. Photo consent forms separated from clinical consent. 4. BAAs with every vendor that touches data — including your marketing agency. 5. An incident response plan that's been tested in the last 12 months." },
    ],
  },
  {
    slug: "no-show-reduction-medical-spa",
    category: "Operations",
    title: "How One Atlanta Med Spa Cut No-Shows by 73% in 90 Days",
    excerpt:
      "Luxe Aesthetic in Buckhead was losing $11K/mo to no-shows. Here's the exact playbook they used to reverse it — without becoming the cancellation-fee villain.",
    readTime: "7 min read",
    publishedAt: "February 28, 2026",
    author: { name: "Sarah Kim", role: "Customer Success Lead, ARCA Rx" },
    sections: [
      { heading: "The problem", body: "Luxe runs 6 injectors across 4 rooms. Their no-show rate was 18%, which translated to ~$11,200/mo in unrecovered revenue. They'd tried a 24-hour cancellation policy and SMS reminders. Neither moved the needle." },
      { heading: "The intervention", body: "We implemented three things. First, deposit-gated booking — $50 deposit applied to the visit, fully refundable up to 24 hours out. Second, a three-touch SMS cascade at 72h, 24h, and 2h with one-tap confirm. Third, a smart waitlist that auto-fills cancellations within four minutes." },
      { heading: "The result", body: "No-show rate dropped from 18% to 4.9% in 90 days. Waitlist recovered $4,200/mo. Net revenue lift: $7,800/mo. Patient complaints about deposits: zero." },
    ],
  },
  {
    slug: "what-makes-a-good-hrt-protocol",
    category: "Clinical",
    title: "What Makes a Good HRT Protocol (and What Doesn't)",
    excerpt:
      "Five red flags we see in HRT clinics that scale fast and then implode. Plus the protocol structure our top 50 customers actually use.",
    readTime: "11 min read",
    publishedAt: "February 19, 2026",
    author: { name: "Dr. Priya Raman, DO", role: "Clinical Advisor, ARCA Rx" },
    sections: [
      { heading: "Why protocols matter more in HRT", body: "Unlike aesthetics, HRT is a long-term relationship between patient and clinician. A bad protocol doesn't just produce a bad outcome — it produces a six-month spiral of mood swings, lab anomalies, and patient distrust that's nearly impossible to recover from." },
      { heading: "Five red flags", body: "1. Symptom-driven dosing without ranged labs. 2. The same starting dose for every patient regardless of body comp. 3. No baseline DEXA or body composition. 4. Quarterly labs that never get acted on. 5. No structured follow-up cadence past month 3." },
      { heading: "The structure that works", body: "Baseline workup → 6-week titration check → 12-week stabilization labs → quarterly maintenance → annual comprehensive panel. Document every dose change with rationale. Patient app delivers the protocol; clinician monitors via lab integration. Coach checks in monthly." },
    ],
  },
  {
    slug: "scaling-multi-location-aesthetic-practice",
    category: "Growth",
    title: "Scaling Past 3 Locations: What Breaks and How to Fix It",
    excerpt:
      "The operating model that worked for one location will sink you at four. Here's what changes — pricing, hiring, software, brand — when you scale.",
    readTime: "14 min read",
    publishedAt: "February 9, 2026",
    author: { name: "Lena Whitmore", role: "Head of Growth, ARCA Rx" },
    sections: [
      { heading: "Why location 4 is the killer", body: "Most owners can run two locations on willpower and three on prayer. Four is where the operating model itself has to change. You can no longer be everywhere. The systems you held in your head have to live in software. The injectors you used to know personally are now strangers to you." },
      { heading: "The five shifts", body: "1. Move from owner-as-operator to regional managers. 2. Standardize pricing and SKUs across locations. 3. Unify booking and patient records — one record, multiple locations. 4. Centralize purchasing and inventory. 5. Build a brand standard document that's enforced, not suggested." },
      { heading: "What software changes", body: "At one location, almost anything works. At four, you need real multi-location architecture — cross-location booking, unified patient records, group reporting, central billing, per-location compliance. This is where Aesthetic Record, Symplast, and Mangomint start to fail and ARCA Rx starts to shine." },
    ],
  },
  {
    slug: "patient-app-roi-aesthetic-practice",
    category: "Retention",
    title: "Does a Patient App Actually Move the Needle? Here's the Math.",
    excerpt:
      "We analyzed 12,000 patient cohorts across 240 practices. Practices with active patient apps retain 38% more 90-day patients. Here's why.",
    readTime: "8 min read",
    publishedAt: "January 30, 2026",
    author: { name: "Theo Park", role: "Data Science Lead, ARCA Rx" },
    sections: [
      { heading: "The dataset", body: "We pulled 12,047 new-patient cohorts across 240 practices between Jan 2025 and Dec 2025. We segmented by whether each practice had a patient app deployed, and by whether the individual patient activated it within 30 days of their first visit." },
      { heading: "The retention curve", body: "90-day retention for app-activated patients was 71%. For non-app patients at the same practice: 51%. For patients at non-app practices: 44%. The effect is real, and it compounds — at 12 months, app patients are 2.1x more likely to still be active." },
      { heading: "What the app actually does", body: "Three things drive retention. First, protocols give patients structure between visits. Second, coach messaging dissolves friction — they don't have to call to ask a question. Third, the loyalty program creates a sticky reason to rebook before they ghost." },
    ],
  },
];
