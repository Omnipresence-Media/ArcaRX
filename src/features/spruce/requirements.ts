// Dawn's "Spruce Patient Portal, Platform Outline for Developer" (Oct 28,
// 2026), broken into every requested item, with where each one lives in the
// prototype. The review page in the ARCA back office renders this.
export type ReqStatus = "built" | "demo" | "backend" | "question";

export type ReqItem = {
  title: string; // her words, lightly trimmed
  status: ReqStatus;
  where: string; // plain explanation of what exists
  screen?: string; // SPRUCE_SCREENS key that shows it
};

export type ReqSection = {
  n: number;
  title: string;
  summary: string; // her one-line summary
  items: ReqItem[];
};

export const STATUS_LABEL: Record<ReqStatus, string> = {
  built: "Built",
  demo: "Demo only",
  backend: "Needs backend",
  question: "Her question",
};

export const REQUIREMENTS: ReqSection[] = [
  { n: 1, title: "Patient onboarding", summary: "Signup, membership type, consent, ID, practitioner approval.", items: [
    { title: "Account created, patient emailed a login and temporary passcode", status: "demo", where: "Staff add a patient and the welcome email shows in the demo outbox. Real login and email sending come with the backend.", screen: "a-patients" },
    { title: "Choose membership type: In-Clinic or Virtual", status: "built", where: "First step of onboarding.", screen: "p-onboarding" },
    { title: "Patient portfolio created (profile and record)", status: "built", where: "Every patient has a record in staff admin with membership, practitioner, check-ins, protocols and orders.", screen: "a-patients" },
    { title: "Consent form with a digital signature (cannot be skipped)", status: "built", where: "Onboarding step 2. Submit is disabled until signed.", screen: "p-onboarding" },
    { title: "Upload a photo ID (cannot be skipped)", status: "built", where: "Onboarding step 3. Virtual members also upload baseline photos.", screen: "p-onboarding" },
    { title: "Practitioner approval gate: nothing else visible until approved", status: "built", where: "Patient sees a waiting screen. Staff approve, request changes or reject in Approvals.", screen: "a-approvals" },
    { title: "First check-in set automatically to the next Friday", status: "built", where: "Approval creates the first check-in on the next Friday. For Virtual members it waits for photos and ID.", screen: "a-approvals" },
    { title: "Later check-ins assigned manually by staff", status: "built", where: "Staff pick the next Friday for each patient.", screen: "a-checkins" },
  ]},
  { n: 2, title: "Membership billing and access", summary: "Recurring subscription with strict lockout on failed payment.", items: [
    { title: "No active, paid membership means no portal access", status: "built", where: "Lapsed patients are locked to the update-card screen.", screen: "p-pastdue" },
    { title: "Card fails: patient automatically emailed", status: "demo", where: "The failed-card email shows in the demo outbox. Real sending needs the backend.", screen: "p-pastdue" },
    { title: "Access cut off except the update-card screen", status: "built", where: "Every other page redirects to Account.", screen: "p-pastdue" },
    { title: "Card updated: charge the full amount owed for every missed month", status: "built", where: "Account shows every missed renewal and the total. Saving a card charges them together and restores access. Use the Demo panel's \"Another month passes unpaid\" to stack months.", screen: "p-pastdue" },
    { title: "Billing date never moves, check-in date stays the same", status: "built", where: "Renewal keeps the original anchor day, including short months.", screen: "p-account" },
    { title: "Payments through Aero (via Sticky.io) using Spruce's existing merchant accounts", status: "backend", where: "Not built. Needs API access to the processor. The prototype shows the screens only." },
  ]},
  { n: 3, title: "Check-ins and protocols", summary: "Each check-in is tied to a Friday, opens the Monday before, ends with a protocol PDF.", items: [
    { title: "Check-in opens Monday before the Friday, closes Friday at midnight", status: "built", where: "Scheduled check-ins open on Monday (the review page time-travels for you).", screen: "p-checkin" },
    { title: "Check-in form: list of questions", status: "built", where: "Questions are placeholders until Dawn sends the real list.", screen: "p-checkin" },
    { title: "Area to upload 3 photos", status: "built", where: "Three photo slots on the check-in form.", screen: "p-checkin" },
    { title: "Practitioner reviews the check-in and builds a protocol", status: "built", where: "Staff see answers and photos and upload the protocol from the same screen.", screen: "a-checkins" },
    { title: "Practitioner uploads the protocol PDF into the patient's portal", status: "built", where: "Appears under Protocols for the patient.", screen: "p-protocols" },
    { title: "Patient automatically emailed that the protocol is ready", status: "demo", where: "Email shows in the demo outbox.", screen: "a-checkins" },
    { title: "Patient orders the products they need through the store", status: "built", where: "Protocol links straight to the store.", screen: "p-store" },
  ]},
  { n: 4, title: "Online store and orders", summary: "RX and non-RX in one cart, split and sent to two shippers.", items: [
    { title: "RX and non-RX products in one cart", status: "built", where: "One store, one cart, RX items flagged.", screen: "p-store" },
    { title: "Order split: non-RX from Spruce clinic, RX from the partner pharmacy", status: "built", where: "Every order becomes two shipments with their own status and tracking.", screen: "a-orders" },
    { title: "Each part sent to the right ShipStation automatically", status: "backend", where: "Needs both ShipStation accounts. The prototype shows the split and a demo Ship button." },
    { title: "Automatic discount: 20% at $250 or less, 30% at $350 or more", status: "built", where: "Applied line by line in the cart.", screen: "p-cart" },
    { title: "Orders between $250 and $350: which discount applies?", status: "question", where: "Her open question. The prototype uses 20% below $350 until she decides.", screen: "p-cart" },
    { title: "Staff can delete the promo code and add a new limited-time one any time", status: "built", where: "Promo codes screen in staff admin.", screen: "a-promos" },
    { title: "Patient uses either the automatic discount or the limited-time code", status: "built", where: "Cart offers both and preselects the better one.", screen: "p-cart" },
    { title: "Shipping: RX only free, non-RX only charged, both together one charge", status: "built", where: "Shown in the cart totals.", screen: "p-cart" },
    { title: "Tracking email per shipment when it goes out", status: "demo", where: "Shipping in the demo adds a tracking email to the outbox.", screen: "a-orders" },
  ]},
  { n: 5, title: "RX workflow: pharmacy and doctor network", summary: "Any RX that needs a new or renewed prescription triggers a doctor visit with one $25 fee.", items: [
    { title: "Partner pharmacy API: send RX orders, track refills and end dates", status: "backend", where: "Not built. The prototype tracks fills and end dates in the demo store." },
    { title: "Doctor network API", status: "backend", where: "Not built. The demo panel plays the doctor (approve or decline)." },
    { title: "Visit triggered: new RX with no refills, or refills used up, or end date passed", status: "built", where: "Those three rules decide at checkout.", screen: "p-cart" },
    { title: "Patient automatically prompted into the visit at checkout", status: "built", where: "Checkout goes straight to the visit.", screen: "p-visit" },
    { title: "Visit is a form or a short recorded video, depending on the patient's state", status: "demo", where: "Form plus a video upload field. The state rule is a placeholder until the doctor network tells us which states need video.", screen: "p-visit" },
    { title: "One $25 fee per visit, no matter how many prescriptions", status: "built", where: "One visit and one fee per order, shown in the cart.", screen: "p-cart" },
    { title: "Fee charged again only on the next visit", status: "built", where: "Covered prescriptions skip the fee.", screen: "p-orders" },
    { title: "Monthly report of visits to pay the doctor network", status: "backend", where: "Not built yet. Easy to add once visits are stored for real." },
  ]},
  { n: 6, title: "Communication and support", summary: "Three channels, each notifying staff in Slack.", items: [
    { title: "Practitioner chat, anytime, answered within 24 hours", status: "built", where: "Patient chat with the assigned practitioner. Staff inbox flags anything older than 24 hours.", screen: "p-messages" },
    { title: "New: photo attachments in chat", status: "built", where: "Patients can attach photos to a message.", screen: "p-messages" },
    { title: "Emergency form to Dawn or the clinic manager, same day", status: "built", where: "Emergency form on the patient side, flagged queue in the staff inbox.", screen: "p-emergency" },
    { title: "Customer support button for pharmacy order questions", status: "built", where: "Support tickets with status.", screen: "p-support" },
    { title: "Slack notifications (currently via Zapier)", status: "backend", where: "Not built. The demo outbox shows what would be sent." },
  ]},
  { n: 7, title: "Education library", summary: "How to use every product and how to microneedle at home.", items: [
    { title: "Each product has written education and an embedded YouTube video", status: "built", where: "Privacy-friendly YouTube embeds. Real videos needed from Spruce.", screen: "p-learn" },
    { title: "Microneedling rules and a video tutorial for the at-home stamping system", status: "built", where: "Microneedling section in Learn.", screen: "p-learn" },
  ]},
  { n: 8, title: "Staff admin controls and branding", summary: "Manage patients, schedules and promotions easily; easy to brand.", items: [
    { title: "Practitioner assignment and reassignment", status: "built", where: "On each patient in staff admin.", screen: "a-patients" },
    { title: "Switch a patient between In-Clinic and Virtual", status: "built", where: "On each patient.", screen: "a-patients" },
    { title: "Approve consent forms and IDs", status: "built", where: "Approvals queue.", screen: "a-approvals" },
    { title: "Set each patient's next check-in date", status: "built", where: "Check-ins screen.", screen: "a-checkins" },
    { title: "Upload a protocol PDF (triggers the patient email)", status: "built", where: "Check-ins screen.", screen: "a-checkins" },
    { title: "Add or delete promo codes", status: "built", where: "Promo codes screen.", screen: "a-promos" },
    { title: "Easy to brand so it looks polished and on-brand", status: "built", where: "Branding screen in staff admin: name, logo upload, three colors with presets and a live preview. Saving restyles the whole patient portal.", screen: "a-branding" },
  ]},
  { n: 9, title: "Integrations and automatic emails", summary: "Everything that connects outside the portal.", items: [
    { title: "Aero via Sticky.io: subscriptions and order payments", status: "backend", where: "Needs API access." },
    { title: "Spruce ShipStation and pharmacy ShipStation", status: "backend", where: "Needs both accounts." },
    { title: "Partner pharmacy API and doctor network API", status: "backend", where: "Need vendor names and API docs." },
    { title: "Slack via Zapier", status: "backend", where: "Needs the Slack workspace." },
    { title: "YouTube embeds", status: "built", where: "Works today.", screen: "p-learn" },
    { title: "Emails: new patient, failed card, protocol ready, tracking per shipment", status: "demo", where: "All four appear in the Demo panel's outbox (bottom right of any Spruce screen). Sending needs the backend.", screen: "a-overview" },
    { title: "Should the doctor network's monthly bill be an automatic report?", status: "question", where: "Her open question. Recommended yes." },
  ]},
];
