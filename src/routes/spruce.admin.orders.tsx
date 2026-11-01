import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Stethoscope, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Pill, SectionCard, SpPage } from "@/features/spruce/ui";
import { money } from "@/features/spruce/rules";
import { decideVisit, shipPending, useSpruce, type Order, type OrderStatus, type RxLineStatus, type Shipment, type ShipmentStatus, type VisitStatus } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/orders")({
  head: () => ({ meta: [{ title: "Orders - Spruce Micro" }] }),
  component: Orders,
});

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
  awaiting_doctor: { label: "Awaiting doctor", tone: "warning" },
  processing: { label: "Processing", tone: "info" },
  partially_shipped: { label: "Partially shipped", tone: "info" },
  shipped: { label: "Shipped", tone: "success" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const RX_STATUS: Record<RxLineStatus, { label: string; tone: Tone }> = {
  not_rx: { label: "No Rx needed", tone: "neutral" },
  covered: { label: "Covered by Rx", tone: "success" },
  needs_visit: { label: "Needs visit", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  declined: { label: "Declined", tone: "danger" },
};

const SHIP_STATUS: Record<ShipmentStatus, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "neutral" },
  held_for_rx: { label: "Held for doctor", tone: "warning" },
  submitted: { label: "Ready to ship", tone: "info" },
  shipped: { label: "Shipped", tone: "success" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const VISIT_STATUS: Record<VisitStatus, { label: string; tone: Tone }> = {
  awaiting_patient: { label: "Awaiting patient", tone: "warning" },
  in_review: { label: "In doctor review", tone: "info" },
  approved: { label: "Approved", tone: "success" },
  declined: { label: "Declined", tone: "danger" },
};

function shipTitle(sh: Shipment): string {
  if (sh.channel === "clinic_shipping") return "Clinic shipment";
  return sh.status === "held_for_rx" ? "Pharmacy shipment (waiting on doctor)" : "Pharmacy shipment";
}

const isHeld = (o: Order) => o.shipments.some((sh) => sh.status === "held_for_rx");

type Filter = "all" | "held" | "shipped";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "held", label: "Held RX" },
  { id: "shipped", label: "Shipped" },
];

function shipSummary(o: Order): string {
  if (o.shipments.length === 0) return "No shipments";
  const shipped = o.shipments.filter((sh) => sh.status === "shipped" || sh.status === "delivered").length;
  return `${shipped} of ${o.shipments.length} shipped`;
}

function Orders() {
  const s = useSpruce();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Set<string>>(new Set());

  const held = s.orders.filter(isHeld).length;
  const readyCount = s.orders.reduce((a, o) => a + o.shipments.filter((sh) => sh.status === "submitted").length, 0);

  const rows = s.orders.filter((o) => {
    if (filter === "held") return isHeld(o);
    if (filter === "shipped") return o.shipments.some((sh) => sh.status === "shipped" || sh.status === "delivered");
    return true;
  });

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const patientOf = (id: string) => s.patients.find((p) => p.id === id);
  const productName = (id: string) => s.products.find((p) => p.id === id)?.name ?? "Removed product";

  function ship() {
    const n = readyCount;
    shipPending();
    toast.success(`Marked ${n} ${n === 1 ? "shipment" : "shipments"} as shipped`);
  }

  return (
    <SpPage
      title="Orders"
      sub="Every order, split into clinic and pharmacy shipments."
      actions={
        <Button variant="outline" disabled={readyCount === 0} onClick={ship}>
          <Truck className="mr-1.5 h-4 w-4" />Mark ready shipments as shipped
        </Button>
      }
    >
      {held > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Stethoscope className="h-4 w-4 shrink-0" />
          {held} {held === 1 ? "order is" : "orders are"} waiting on a doctor decision
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${filter === f.id ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No orders match this filter" body="Orders appear here as soon as a patient checks out. Prescription items wait here until a doctor decides." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="w-8 px-3 py-2.5" />
                <th className="px-3 py-2.5 font-semibold">Order</th>
                <th className="px-3 py-2.5 font-semibold">Patient</th>
                <th className="px-3 py-2.5 font-semibold">Date</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 text-right font-semibold">Charged</th>
                <th className="px-3 py-2.5 font-semibold">Shipments</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const isOpen = open.has(o.id);
                const p = patientOf(o.patientId);
                const st = ORDER_STATUS[o.status];
                const visit = o.visitId ? s.visits.find((v) => v.id === o.visitId) : undefined;
                return (
                  <Fragment key={o.id}>
                    <tr className="cursor-pointer border-b hover:bg-muted/40" onClick={() => toggle(o.id)}>
                      <td className="px-3 py-3 text-muted-foreground">{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</td>
                      <td className="px-3 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-3 py-3">{p?.name ?? "Unknown patient"} <span className="font-mono text-xs text-muted-foreground">{p?.code}</span></td>
                      <td className="px-3 py-3 text-muted-foreground">{o.createdLabel}</td>
                      <td className="px-3 py-3"><Pill tone={st.tone}>{st.label}</Pill></td>
                      <td className="px-3 py-3 text-right font-semibold">{money(o.totalCents - o.releasedCents)}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{shipSummary(o)}</td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b bg-muted/20">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <SectionCard title="Items">
                              <ul className="space-y-2">
                                {o.lines.map((l, i) => (
                                  <li key={`${l.productId}-${i}`} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="min-w-0 truncate">{l.qty} x {productName(l.productId)}</span>
                                    <span className="flex shrink-0 items-center gap-2">
                                      <Pill tone={RX_STATUS[l.rx].tone}>{RX_STATUS[l.rx].label}</Pill>
                                      <span className="w-16 text-right text-muted-foreground">{money(l.unitCents * l.qty - l.discountCents)}</span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </SectionCard>

                            <SectionCard title="Shipments">
                              {o.shipments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No shipments for this order.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {o.shipments.map((sh) => (
                                    <li key={sh.id} className="rounded-lg border bg-background px-3 py-2 text-sm">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold">{shipTitle(sh)}</span>
                                        <Pill tone={SHIP_STATUS[sh.status].tone}>{SHIP_STATUS[sh.status].label}</Pill>
                                      </div>
                                      {sh.carrier && <p className="mt-1 text-xs text-muted-foreground">{sh.carrier} <span className="font-mono">{sh.tracking}</span></p>}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </SectionCard>

                            <SectionCard title="Money">
                              <dl className="space-y-1.5 text-sm">
                                <div className="flex justify-between"><dt className="text-muted-foreground">Charged (total minus released)</dt><dd className="font-semibold">{money(o.totalCents - o.releasedCents)}</dd></div>
                                <div className="flex justify-between"><dt className="text-muted-foreground">Held (waiting on doctor)</dt><dd className="font-semibold">{money(o.heldCents)}</dd></div>
                                <div className="flex justify-between"><dt className="text-muted-foreground">Released</dt><dd className="font-semibold">{money(o.releasedCents)}</dd></div>
                                <div className="flex justify-between"><dt className="text-muted-foreground">Doctor visit fee</dt><dd className="font-semibold">{money(o.doctorFeeCents)}</dd></div>
                              </dl>
                              <p className="mt-3 text-xs text-muted-foreground">The visit fee is kept even when a visit is declined. Only the held prescription amount is released.</p>
                            </SectionCard>

                            <SectionCard title="Doctor visit">
                              {visit ? (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Visit status</span>
                                    <Pill tone={VISIT_STATUS[visit.status].tone}>{VISIT_STATUS[visit.status].label}</Pill>
                                  </div>
                                  {visit.status === "in_review" && (
                                    <div className="flex flex-wrap gap-2">
                                      <Button size="sm" className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90" onClick={() => { decideVisit(visit.id, "approved"); toast.success(`Visit approved for ${o.id}`); }}>
                                        Simulate doctor: approve
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => { decideVisit(visit.id, "declined"); toast.success(`Visit declined for ${o.id}`); }}>
                                        Simulate doctor: decline
                                      </Button>
                                    </div>
                                  )}
                                  {visit.status === "awaiting_patient" && (
                                    <Button size="sm" variant="outline" disabled>Patient has not finished the visit form</Button>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No doctor visit needed for this order.</p>
                              )}
                              <div className="mt-3 border-t pt-3">
                                <Button size="sm" variant="outline" disabled={readyCount === 0} onClick={ship}>
                                  <Truck className="mr-1.5 h-4 w-4" />Mark ready shipments as shipped
                                </Button>
                              </div>
                            </SectionCard>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SpPage>
  );
}
