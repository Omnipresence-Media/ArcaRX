import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateModal } from "@/components/shell/CreateButton";
import { SpPage, SectionCard, Pill, EmptyState } from "@/features/spruce/ui";
import { money } from "@/features/spruce/rules";
import {
  FRIDAYS, assignPractitioner, cancelMembership, createPatient, practitionerName, reactivateMembership, resumeMembership,
  scheduleCheckIn, setMembershipType, uploadProtocol, useSpruce,
  type MembershipStatus, type MembershipType, type OnboardingStatus, type Patient,
} from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/patients")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => ({ id: typeof s.id === "string" ? s.id : undefined }),
  head: () => ({ meta: [{ title: "Patients - Spruce Micro" }] }),
  component: Patients,
});

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const ONBOARDING: Record<OnboardingStatus, { label: string; tone: Tone }> = {
  account_created: { label: "Account created", tone: "neutral" },
  pending_review: { label: "Pending review", tone: "warning" },
  changes_requested: { label: "Changes requested", tone: "info" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};
const MEMBERSHIP: Record<MembershipStatus, { label: string; tone: Tone }> = {
  incomplete: { label: "Incomplete", tone: "neutral" },
  active: { label: "Active", tone: "success" },
  past_due: { label: "Past due", tone: "danger" },
  paused: { label: "Paused", tone: "warning" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};
const PLAN: Record<MembershipType, string> = { in_clinic: "In-Clinic", virtual: "Virtual" };
const planOf = (p: Patient) => (p.membershipType ? PLAN[p.membershipType] : "No plan");

const FILTERS = ["All", "Onboarding", "Active", "Past due", "Paused", "Cancelled"] as const;
type Filter = (typeof FILTERS)[number];
function matches(p: Patient, f: Filter): boolean {
  switch (f) {
    case "All": return true;
    case "Onboarding": return p.onboarding !== "approved";
    case "Active": return p.onboarding === "approved" && p.membership === "active";
    case "Past due": return p.membership === "past_due";
    case "Paused": return p.membership === "paused";
    case "Cancelled": return p.membership === "cancelled";
  }
}

function Patients() {
  const s = useSpruce();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [creating, setCreating] = useState(false);

  const list = s.patients.filter((p) => matches(p, filter) && `${p.name} ${p.code} ${p.email}`.toLowerCase().includes(q.trim().toLowerCase()));
  const selected = s.patients.find((p) => p.id === id) ?? null;

  return (
    <SpPage
      title="Patients"
      sub="Every member, their status and their care team."
      actions={<Button size="sm" className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90" onClick={() => setCreating(true)}><Plus /> New patient</Button>}
    >
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search name, code or email" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === f ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
          {list.length === 0 ? (
            <EmptyState title="No patients match" body="Try a different search or filter, or create a new patient account." />
          ) : (
            <ul className="space-y-2">
              {list.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/spruce/admin/patients", search: { id: p.id } })}
                    className={`w-full rounded-xl border bg-card p-3 text-left transition-colors hover:border-[color:var(--teal)] ${selected?.id === p.id ? "border-[color:var(--teal)] ring-1 ring-[color:var(--teal)]" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <span className="text-xs text-muted-foreground">{p.code}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{planOf(p)} - {practitionerName(s, p.practitionerId)}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Pill tone={ONBOARDING[p.onboarding].tone}>{ONBOARDING[p.onboarding].label}</Pill>
                      <Pill tone={MEMBERSHIP[p.membership].tone}>{MEMBERSHIP[p.membership].label}</Pill>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="min-w-0">
          {selected ? <Detail key={selected.id} patient={selected} /> : <EmptyState title="Select a patient" body="Pick someone from the list to see their check-ins, orders, prescriptions, messages and billing." />}
        </div>
      </div>

      <CreateModal
        open={creating}
        onClose={() => setCreating(false)}
        title="New patient"
        description="Creates the account and queues a temporary passcode email."
        fields={[
          { name: "name", label: "Full name", placeholder: "Alex Morgan" },
          { name: "email", label: "Email", placeholder: "alex@example.com" },
          { name: "type", label: "Membership type", type: "select", options: ["In-Clinic", "Virtual"] },
        ]}
        submitLabel="Create account"
        successMessage="Account created. Temporary passcode email queued (see the Demo outbox)"
        onSubmit={(v) => {
          const name = (v.name ?? "").trim();
          const email = (v.email ?? "").trim();
          if (!name) { toast.error("Enter the patient's full name"); return false; }
          if (!email.includes("@")) { toast.error("Enter a valid email address"); return false; }
          const newId = createPatient({
            name,
            email,
            membershipType: v.type === "Virtual" ? "virtual" : "in_clinic",
          });
          navigate({ to: "/spruce/admin/patients", search: { id: newId } });
        }}
      />
    </SpPage>
  );
}

const selectCls = "h-9 rounded-md border border-input bg-background px-2 text-sm";

function Detail({ patient: p }: { patient: Patient }) {
  const s = useSpruce();
  const [friday, setFriday] = useState(FRIDAYS[0].due);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [protoOpen, setProtoOpen] = useState(false);
  const [protoTitle, setProtoTitle] = useState("Personalized protocol");
  const [protoFile, setProtoFile] = useState<string | null>(null);

  const checkIns = s.checkIns.filter((c) => c.patientId === p.id);
  const protocols = s.protocols.filter((x) => x.patientId === p.id);
  const orders = s.orders.filter((o) => o.patientId === p.id);
  const rxs = s.prescriptions.filter((r) => r.patientId === p.id);
  const messages = s.messages.filter((m) => m.patientId === p.id);
  const endsNow = p.membership === "past_due" || p.membership === "paused";
  const canCancel = p.membership === "active" || p.membership === "past_due" || p.membership === "paused";

  return (
    <SectionCard>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{p.name}</h2>
          <p className="text-xs text-muted-foreground">{p.code} - {p.email} - {p.state}</p>
        </div>
        <div className="flex gap-1.5">
          <Pill tone={ONBOARDING[p.onboarding].tone}>{ONBOARDING[p.onboarding].label}</Pill>
          <Pill tone={MEMBERSHIP[p.membership].tone}>{MEMBERSHIP[p.membership].label}</Pill>
          {p.cancelAtPeriodEnd && <Pill tone="warning">Cancels at period end</Pill>}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="h-auto flex-wrap justify-start">
          {["overview", "check-ins", "protocols", "orders", "prescriptions", "messages", "billing", "audit"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">{t === "audit" ? "Audit trail" : t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-3">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-muted-foreground">Plan</dt><dd className="font-medium">{planOf(p)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Practitioner</dt><dd className="font-medium">{practitionerName(s, p.practitionerId)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Joined</dt><dd className="font-medium">{p.createdLabel}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Baseline photos</dt><dd className="font-medium">{p.photosUploaded} of 3</dd></div>
          </dl>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs text-muted-foreground">
              Assign practitioner
              <select
                className={`${selectCls} block w-full text-foreground`}
                value={p.practitionerId ?? ""}
                onChange={(e) => {
                  if (!e.target.value) return;
                  assignPractitioner(p.id, e.target.value);
                  toast.success("Practitioner assigned");
                }}
              >
                <option value="">Unassigned</option>
                {s.practitioners.map((pr) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Membership type
              <select
                className={`${selectCls} block w-full text-foreground`}
                value={p.membershipType ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v !== "in_clinic" && v !== "virtual") return;
                  setMembershipType(p.id, v);
                  toast.success(`Switched to ${PLAN[v]}`);
                }}
              >
                {p.membershipType === null && <option value="">Not chosen</option>}
                <option value="in_clinic">In-Clinic</option>
                <option value="virtual">Virtual</option>
              </select>
            </label>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Schedule next check-in (Fridays only)</p>
            <div className="flex gap-2">
              <select className={`${selectCls} flex-1`} value={friday} onChange={(e) => setFriday(e.target.value)}>
                {FRIDAYS.map((f) => <option key={f.due} value={f.due}>{f.due} (opens {f.opens})</option>)}
              </select>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => {
                  const f = FRIDAYS.find((x) => x.due === friday) ?? FRIDAYS[0];
                  scheduleCheckIn(p.id, f.due, f.opens);
                  toast.success(`Check-in scheduled for ${f.due}`);
                }}
              >
                Schedule
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button variant="outline" size="sm" onClick={() => setProtoOpen(true)}>Upload protocol</Button>
            {canCancel && !p.cancelAtPeriodEnd && <Button variant="outline" size="sm" className="text-red-700" onClick={() => setCancelOpen(true)}>Cancel membership</Button>}
            {p.cancelAtPeriodEnd && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resumeMembership(p.id);
                  toast.success("Membership will continue");
                }}
              >
                Keep membership
              </Button>
            )}
            {p.membership === "cancelled" && (
              <Button
                size="sm"
                className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90"
                onClick={() => {
                  reactivateMembership(p.id);
                  toast.success("Membership reactivated. Billing restarts from today.");
                }}
              >
                Reactivate membership
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="check-ins" className="pt-3">
          {checkIns.length === 0 ? <Empty text="No check-ins yet." /> : (
            <ul className="divide-y text-sm">
              {checkIns.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2.5">
                  <span>Due {c.dueLabel}{c.submittedLabel ? ` - submitted ${c.submittedLabel}` : ""}</span>
                  <Pill tone={c.status === "reviewed" ? "success" : c.status === "submitted" ? "warning" : c.status === "missed" ? "danger" : c.status === "open" ? "info" : "neutral"}>{c.status}</Pill>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="protocols" className="pt-3">
          {protocols.length === 0 ? <Empty text="No protocols uploaded." /> : (
            <ul className="divide-y text-sm">
              {protocols.map((x) => (
                <li key={x.id} className="flex items-center justify-between py-2.5">
                  <span className="font-medium">{x.title}</span>
                  <span className="text-xs text-muted-foreground">{x.uploadedLabel}</span>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="orders" className="pt-3">
          {orders.length === 0 ? <Empty text="No orders yet." /> : (
            <ul className="divide-y text-sm">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 py-2.5">
                  <span className="font-medium">{o.id} <span className="text-xs font-normal text-muted-foreground">{o.createdLabel}</span></span>
                  <span className="flex items-center gap-2"><Pill tone={o.status === "awaiting_doctor" ? "warning" : o.status === "cancelled" ? "danger" : "info"}>{o.status.replace(/_/g, " ")}</Pill><span className="tabular-nums">{money(o.totalCents)}</span></span>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="prescriptions" className="pt-3">
          {rxs.length === 0 ? <Empty text="No prescriptions on file." /> : (
            <ul className="divide-y text-sm">
              {rxs.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div>
                    <p className="font-medium">{s.products.find((x) => x.id === r.productId)?.name ?? "Unknown product"}</p>
                    <p className="text-xs text-muted-foreground">{r.fillsUsed} of {r.fillsAllowed} fills used - expires {r.expiresLabel}</p>
                  </div>
                  <Pill tone={r.status === "active" ? "success" : r.status === "expired" ? "danger" : "warning"}>{r.status}</Pill>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="messages" className="pt-3">
          {messages.length === 0 ? <Empty text="No messages yet." /> : (
            <ul className="space-y-2">
              {messages.map((m) => (
                <li key={m.id} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.from === "patient" ? "bg-muted" : "ml-auto bg-[color:var(--teal)]/10"}`}>
                  <p>{m.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{m.from === "patient" ? p.name : "Practitioner"} - {m.at}</p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="billing" className="space-y-3 pt-3 text-sm">
          <dl className="grid grid-cols-2 gap-3">
            <div><dt className="text-xs text-muted-foreground">Membership status</dt><dd><Pill tone={MEMBERSHIP[p.membership].tone}>{MEMBERSHIP[p.membership].label}</Pill></dd></div>
            <div><dt className="text-xs text-muted-foreground">Card</dt><dd className="font-medium">{p.card ? `${p.card.brand} ending ${p.card.last4}, exp ${p.card.exp}` : "No card on file"}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Billing anchor day</dt><dd className="font-medium">{p.anchorDay > 0 ? `Day ${p.anchorDay}` : "Not set"}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Next renewal</dt><dd className="font-medium">{p.nextRenewal}</dd></div>
            {p.membership === "past_due" && <div><dt className="text-xs text-muted-foreground">Grace days left</dt><dd className="font-medium text-red-700">{p.graceDaysLeft ?? 0}</dd></div>}
          </dl>
          <p className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">Reactivating a cancelled membership starts a new billing cycle from the day it is reactivated. The member keeps their records.</p>
        </TabsContent>

        <TabsContent value="audit" className="pt-3">
          <ul className="divide-y text-sm">
            {[
              ["Dana Whitfield", "viewed profile", "2 min ago"],
              ["Sarah Whitfield, NP", "viewed check-in photos", "18 min ago"],
              ["Dana Whitfield", "assigned practitioner", "1 hour ago"],
              ["System", "sent renewal reminder email", "Yesterday"],
              ["Sarah Whitfield, NP", "uploaded a protocol", "Oct 24"],
              ["Dana Whitfield", "viewed billing", "Oct 22"],
            ].map(([who, what, when]) => (
              <li key={`${who}-${what}-${when}`} className="flex items-center justify-between gap-2 py-2.5">
                <span><span className="font-medium">{who}</span> {what}</span>
                <span className="text-xs text-muted-foreground">{when}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this membership?</DialogTitle>
            <DialogDescription>
              {endsNow
                ? `${p.name} loses access to ordering and check-ins right away. Records stay available. You can reactivate later.`
                : `${p.name} keeps full access until the end of the current billing period (${p.nextRenewal}), then loses access to ordering and check-ins. Records stay available. You can reactivate later.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Keep membership</Button>
            <Button
              variant="destructive"
              onClick={() => {
                cancelMembership(p.id);
                setCancelOpen(false);
                toast.success(endsNow ? "Membership cancelled" : "Membership will end at the end of the period");
              }}
            >
              Cancel membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={protoOpen} onOpenChange={setProtoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload protocol</DialogTitle>
            <DialogDescription>The patient is emailed. The email contains no details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="pt-proto-title">Title</label>
              <Input id="pt-proto-title" value={protoTitle} onChange={(e) => setProtoTitle(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="pt-proto-file">PDF file (demo, nothing is uploaded)</label>
              <input
                id="pt-proto-file"
                type="file"
                accept="application/pdf"
                className="block w-full text-xs file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium"
                onChange={(e) => setProtoFile(e.target.files?.[0]?.name ?? null)}
              />
              {protoFile && <p className="text-xs text-muted-foreground">Attached: {protoFile}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProtoOpen(false)}>Cancel</Button>
            <Button
              className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90"
              onClick={() => {
                uploadProtocol(p.id, protoTitle.trim() || "Personalized protocol");
                setProtoOpen(false);
                toast.success("Protocol sent. Patient emailed (no details in the email).");
              }}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{text}</p>;
}
