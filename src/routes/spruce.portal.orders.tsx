import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpPage, SectionCard, Pill, EmptyState } from "@/features/spruce/ui";
import { useSpruce, type Order, type RxLineStatus, type Shipment, type ShipmentStatus } from "@/features/spruce/store";
import { money } from "@/features/spruce/rules";

export const Route = createFileRoute("/spruce/portal/orders")({
  head: () => ({ meta: [{ title: "Orders - Spruce Micro" }] }),
  component: Orders,
});

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const ORDER_STATUS: Record<Order["status"], { label: string; tone: Tone }> = {
  awaiting_doctor: { label: "Awaiting doctor", tone: "warning" },
  processing: { label: "Processing", tone: "info" },
  partially_shipped: { label: "Partially shipped", tone: "info" },
  shipped: { label: "Shipped", tone: "success" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

const RX_PILL: Record<RxLineStatus, { label: string; tone: Tone } | null> = {
  not_rx: null,
  covered: { label: "Covered by your prescription", tone: "success" },
  needs_visit: { label: "Needs doctor visit", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  declined: { label: "Declined", tone: "danger" },
};

const SHIP_LABEL: Record<ShipmentStatus, string> = {
  pending: "Pending",
  held_for_rx: "On hold for doctor decision",
  submitted: "Preparing to ship",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function Orders() {
  const s = useSpruce();
  const orders = s.orders.filter((o) => o.patientId === s.meId);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <SpPage title="Orders" sub="Track shipments and see exactly what you were charged.">
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="When you place an order it shows up here with live shipment status."
          action={<Button asChild size="sm"><Link to="/spruce/portal/store">Go to the store</Link></Button>}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} open={openId === o.id} onToggle={() => setOpenId(openId === o.id ? null : o.id)} />
          ))}
        </div>
      )}
    </SpPage>
  );
}

function OrderCard({ order: o, open, onToggle }: { order: Order; open: boolean; onToggle: () => void }) {
  const s = useSpruce();
  const st = ORDER_STATUS[o.status];
  const visit = o.visitId ? s.visits.find((v) => v.id === o.visitId) : undefined;
  const chargedCents = o.totalCents - o.releasedCents;
  const itemCount = o.lines.reduce((a, l) => a + l.qty, 0);

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left" aria-expanded={open}>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">Order {o.id}</span>
            <Pill tone={st.tone}>{st.label}</Pill>
          </div>
          <p className="text-xs text-muted-foreground">{o.createdLabel} - {itemCount} {itemCount === 1 ? "item" : "items"} - {o.releasedCents > 0 ? `Charged ${money(chargedCents)}` : money(o.totalCents)}</p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t p-4">
          {visit?.status === "awaiting_patient" && (
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-900">Your prescription items are on hold</p>
              <p className="mt-1 text-xs text-amber-900">Finish your doctor visit so we can ship them.</p>
              <Button asChild size="sm" className="mt-2"><Link to="/spruce/portal/visit" search={{ id: visit.id }}>Finish your doctor visit</Link></Button>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</h3>
            <ul className="space-y-2">
              {o.lines.map((l, i) => {
                const p = s.products.find((x) => x.id === l.productId);
                const pill = RX_PILL[l.rx];
                return (
                  <li key={`${l.productId}-${i}`} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium">{p?.name ?? "Product"} <span className="text-muted-foreground">x{l.qty}</span></p>
                      {pill && <Pill tone={pill.tone}>{pill.label}</Pill>}
                    </div>
                    <span className="shrink-0 font-medium">{money(l.unitCents * l.qty - l.discountCents)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {o.shipments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No shipments for this order.</p>
            ) : (
              o.shipments.map((sh) => <ShipCard key={sh.id} shipment={sh} />)
            )}
          </div>

          <SectionCard title="Price breakdown" className="bg-muted/40">
            <dl className="space-y-1.5 text-sm">
              <Row label="Subtotal" value={money(o.subtotalCents)} />
              <Row label={`Discount (${o.discountSource === "promo" ? `promo ${o.promoCode ?? ""}`.trim() : "automatic"})`} value={`-${money(o.discountCents)}`} />
              <Row label="Shipping" value={o.shippingCents === 0 ? "Free" : money(o.shippingCents)} />
              {o.doctorFeeCents > 0 && <Row label="Doctor visit fee" value={money(o.doctorFeeCents)} />}
              <div className="flex justify-between border-t pt-2 font-semibold"><dt>Total</dt><dd>{money(o.totalCents)}</dd></div>
              {o.releasedCents > 0 && <div className="flex justify-between font-semibold"><dt>Charged</dt><dd>{money(chargedCents)}</dd></div>}
            </dl>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              {o.capturedCents > 0 && <p>{money(o.capturedCents)} was charged.</p>}
              {o.heldCents > 0 && <p>{money(o.heldCents)} is on hold until your doctor decides.</p>}
              {o.releasedCents > 0 && <p>{money(o.releasedCents)} was released and you were not charged for it.</p>}
            </div>
          </SectionCard>

          <Link to="/spruce/portal/support" search={{ order: o.id }} className="inline-block text-sm font-medium text-[color:var(--teal)] underline">
            Question about this order? Contact support
          </Link>
        </div>
      )}
    </section>
  );
}

function shipTitle(sh: Shipment): string {
  if (sh.channel === "clinic_shipping") return "Clinic shipment";
  return sh.status === "held_for_rx" ? "Pharmacy shipment (waiting on doctor)" : "Pharmacy shipment";
}

function ShipCard({ shipment }: { shipment: Shipment }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-sm font-semibold">{shipTitle(shipment)}</p>
      <p className="text-xs text-muted-foreground">{shipment.channel === "clinic_shipping" ? "Essentials" : "Prescription items"}</p>
      <div className="mt-2 space-y-1 text-xs">
        <p className="font-medium">{SHIP_LABEL[shipment.status]}</p>
        {shipment.status === "held_for_rx" && <p className="text-muted-foreground">Held until your doctor makes a decision. It ships right after approval.</p>}
        {shipment.carrier && <p className="text-muted-foreground">Carrier: {shipment.carrier}</p>}
        {shipment.tracking && <p className="break-all text-muted-foreground">Tracking: {shipment.tracking}</p>}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
