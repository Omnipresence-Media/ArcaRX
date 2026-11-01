import type { Scenario } from "./store";

// The review walkthrough for the Spruce Micro prototype. Each entry is one
// screen to look at, in order. The review page loads the real Spruce route in a
// frame after putting the demo into the right scenario.
export type SpruceScreen = {
  key: string;
  group: "patient" | "admin";
  title: string;
  path: string;
  scenario: Scenario;
  monday?: boolean;
  // Items to put in the cart first, so the pricing math is visible.
  cart?: { productId: string; qty: number }[];
  look: string[];
};

export const SPRUCE_SCREENS: SpruceScreen[] = [
  { key: "p-onboarding", group: "patient", title: "Sign up and consent", path: "/spruce/portal/onboarding", scenario: "new",
    look: ["Membership choice: In-Clinic or Virtual", "Digital consent signature", "Photo ID upload", "Nothing else is reachable until approved"] },
  { key: "p-pending", group: "patient", title: "Waiting for approval", path: "/spruce/portal/onboarding", scenario: "pending",
    look: ["Clear waiting state after submitting", "Patient cannot see any other part of the portal"] },
  { key: "p-changes", group: "patient", title: "Changes requested", path: "/spruce/portal/onboarding", scenario: "changes",
    look: ["Practitioner reason is shown", "Patient can fix and resubmit"] },
  { key: "p-home", group: "patient", title: "Home", path: "/spruce/portal", scenario: "active",
    look: ["Next check-in date", "Quick links to protocol, store and chat"] },
  { key: "p-checkin", group: "patient", title: "Check-in", path: "/spruce/portal/check-in", scenario: "active", monday: true,
    look: ["Opens Monday, closes Friday midnight", "Question list", "Three photo slots"] },
  { key: "p-protocols", group: "patient", title: "Protocols", path: "/spruce/portal/protocols", scenario: "active",
    look: ["Custom protocol PDF from the practitioner", "Previous protocols kept"] },
  { key: "p-store", group: "patient", title: "Store", path: "/spruce/portal/store", scenario: "active",
    look: ["RX and non-RX in one place", "Automatic discount shown", "RX items flagged for doctor review"] },
  { key: "p-cart", group: "patient", title: "Cart and checkout", path: "/spruce/portal/cart", scenario: "active",
    cart: [{ productId: "rx1", qty: 1 }, { productId: "rx2", qty: 1 }, { productId: "n1", qty: 1 }, { productId: "n2", qty: 2 }],
    look: ["20% under the line, 30% at the line", "Tier or one promo code, better one preselected", "Shipping rules: RX only free, otherwise one charge"] },
  { key: "p-visit", group: "patient", title: "Doctor visit", path: "/spruce/portal/visit", scenario: "active",
    cart: [{ productId: "rx2", qty: 1 }, { productId: "n1", qty: 1 }],
    look: ["Prompted at checkout when an RX needs a visit", "One $25 fee per visit"] },
  { key: "p-orders", group: "patient", title: "Orders and tracking", path: "/spruce/portal/orders", scenario: "active",
    look: ["Split shipments, one tracking number each", "Awaiting doctor status"] },
  { key: "p-messages", group: "patient", title: "Practitioner chat", path: "/spruce/portal/messages", scenario: "active",
    look: ["Message the assigned practitioner", "Photo attachments (new feature in her document)"] },
  { key: "p-emergency", group: "patient", title: "Emergency form", path: "/spruce/portal/emergency", scenario: "active",
    look: ["Same-day response promise", "Goes to the clinic managers"] },
  { key: "p-support", group: "patient", title: "Customer support", path: "/spruce/portal/support", scenario: "active",
    look: ["Pharmacy order questions", "Ticket status"] },
  { key: "p-learn", group: "patient", title: "Education library", path: "/spruce/portal/learn", scenario: "active",
    look: ["Per-product education with video", "Microneedling rules and tutorial"] },
  { key: "p-account", group: "patient", title: "Account and billing", path: "/spruce/portal/account", scenario: "active",
    look: ["Card update", "Cancel and resume", "Billing date never moves"] },
  { key: "p-pastdue", group: "patient", title: "Failed payment lockout", path: "/spruce/portal/account", scenario: "past_due",
    look: ["Only the update-card screen is reachable", "Missed months charged on catch-up (backend later)"] },
  { key: "p-paused", group: "patient", title: "Paused membership", path: "/spruce/portal", scenario: "paused",
    look: ["Paused screen", "Records, emergency and support still reachable"] },

  { key: "a-overview", group: "admin", title: "Staff overview", path: "/spruce/admin", scenario: "active",
    look: ["Counts that need attention", "Fast jump to each queue"] },
  { key: "a-approvals", group: "admin", title: "Approvals", path: "/spruce/admin/approvals", scenario: "pending",
    look: ["Review consent and ID", "Approve, request changes or reject", "Approval sets the first check-in Friday"] },
  { key: "a-patients", group: "admin", title: "Patients", path: "/spruce/admin/patients", scenario: "active",
    look: ["Assign or reassign a practitioner", "Switch In-Clinic and Virtual", "Add a patient"] },
  { key: "a-checkins", group: "admin", title: "Check-ins and protocols", path: "/spruce/admin/check-ins", scenario: "active",
    look: ["Set each patient's next check-in date", "Review answers and photos", "Upload a protocol PDF"] },
  { key: "a-inbox", group: "admin", title: "Inbox", path: "/spruce/admin/inbox", scenario: "active",
    look: ["Practitioner chat with 24 hour flag", "Emergency forms", "Support tickets"] },
  { key: "a-orders", group: "admin", title: "Orders", path: "/spruce/admin/orders", scenario: "active",
    look: ["Two shippers: Spruce and the pharmacy", "Held RX shipments waiting on the doctor"] },
  { key: "a-products", group: "admin", title: "Products", path: "/spruce/admin/products", scenario: "active",
    look: ["RX and non-RX catalog", "Active or hidden"] },
  { key: "a-promos", group: "admin", title: "Promo codes", path: "/spruce/admin/promos", scenario: "active",
    look: ["Add or delete a limited-time code any time"] },
];

export const screenByKey = (k: string | undefined) => SPRUCE_SCREENS.find((s) => s.key === k);
