import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Camera, ClipboardCheck, CreditCard, Inbox, MessageSquare, Package, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { SpPage, SectionCard, Pill, EmptyState } from "@/features/spruce/ui";
import { adminCounts, useSpruce } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/")({
  head: () => ({ meta: [{ title: "Dashboard - Spruce Micro" }] }),
  component: AdminDashboard,
});

type Dest = "/spruce/admin/approvals" | "/spruce/admin/check-ins" | "/spruce/admin/inbox" | "/spruce/admin/patients" | "/spruce/admin/orders";
type Tone = "default" | "danger" | "warning";

function Tile({ to, label, value, icon, tone = "default" }: { to: Dest; label: string; value: number; icon: ReactNode; tone?: Tone }) {
  const ring = tone === "danger" ? "border-red-300 bg-red-50" : tone === "warning" ? "border-amber-300 bg-amber-50" : "bg-card";
  const num = tone === "danger" ? "text-red-700" : "";
  return (
    <Link to={to} className={`group flex flex-col gap-2 rounded-xl border p-4 transition-shadow hover:shadow-md ${ring}`}>
      <div className="flex items-center justify-between text-muted-foreground">
        {icon}
        <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className={`text-3xl font-semibold tabular-nums ${num}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Link>
  );
}

type Item = { key: string; to: Dest; label: string; detail: string; pill: ReactNode };

function AdminDashboard() {
  const s = useSpruce();
  const c = adminCounts(s);
  const nameOf = (id: string) => s.patients.find((p) => p.id === id);

  const items: Item[] = [];
  for (const e of s.emergencies.filter((x) => x.status === "open")) {
    const p = nameOf(e.patientId);
    items.push({ key: e.id, to: "/spruce/admin/inbox", label: `Open emergency from ${p?.name ?? "patient"}`, detail: `${p?.code ?? ""} - ${e.at}`, pill: <Pill tone="danger">Emergency</Pill> });
  }
  for (const p of s.patients.filter((x) => x.onboarding === "pending_review")) {
    items.push({ key: `a-${p.id}`, to: "/spruce/admin/approvals", label: `${p.name} is waiting for approval`, detail: `${p.code} - submitted ${p.createdLabel}`, pill: <Pill tone="warning">Approval</Pill> });
  }
  for (const ci of s.checkIns.filter((x) => x.status === "submitted")) {
    const p = nameOf(ci.patientId);
    items.push({ key: ci.id, to: "/spruce/admin/check-ins", label: `${p?.name ?? "Patient"} submitted a check-in`, detail: `${p?.code ?? ""} - due ${ci.dueLabel}`, pill: <Pill tone="info">Check-in</Pill> });
  }
  for (const o of s.orders.filter((x) => x.status === "awaiting_doctor")) {
    const p = nameOf(o.patientId);
    items.push({ key: o.id, to: "/spruce/admin/orders", label: `RX order held for ${p?.name ?? "patient"}`, detail: `${o.id} - waiting on the doctor visit`, pill: <Pill tone="warning">Held RX</Pill> });
  }

  return (
    <SpPage title="Dashboard" sub="What needs a person today.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile to="/spruce/admin/approvals" label="Pending approvals" value={c.approvals} icon={<ClipboardCheck className="h-4 w-4" />} tone={c.approvals > 0 ? "warning" : "default"} />
        <Tile to="/spruce/admin/check-ins" label="Check-ins due this week" value={c.checkInsThisWeek} icon={<Camera className="h-4 w-4" />} />
        <Tile to="/spruce/admin/check-ins" label="Submitted, awaiting protocol" value={c.checkInsToReview} icon={<Camera className="h-4 w-4" />} tone={c.checkInsToReview > 0 ? "warning" : "default"} />
        <Tile to="/spruce/admin/inbox" label="Open emergencies" value={c.openEmergencies} icon={<AlertTriangle className="h-4 w-4" />} tone={c.openEmergencies > 0 ? "danger" : "default"} />
        <Tile to="/spruce/admin/inbox" label="Messages awaiting reply" value={c.unanswered} icon={<MessageSquare className="h-4 w-4" />} />
        <Tile to="/spruce/admin/patients" label="Past-due memberships" value={c.pastDue} icon={<CreditCard className="h-4 w-4" />} />
        <Tile to="/spruce/admin/orders" label="Held RX orders" value={c.heldRx} icon={<Package className="h-4 w-4" />} />
      </div>

      <SectionCard title="Needs attention">
        {items.length === 0 ? (
          <EmptyState
            title="All clear"
            body="Nothing is waiting on staff. New approvals, emergencies, check-ins, held orders and messages awaiting reply will show up here."
            action={<CheckCircle2 className="h-5 w-5 text-[color:var(--teal)]" />}
          />
        ) : (
          <ul className="divide-y">
            {items.map((it) => (
              <li key={it.key}>
                <Link to={it.to} className="flex items-center gap-3 py-3 text-sm hover:bg-muted/50">
                  <Inbox className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{it.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{it.detail}</p>
                  </div>
                  {it.pill}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </SpPage>
  );
}
