import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateModal } from "@/components/shell/CreateButton";
import { CreditCard, Plus, Download } from "lucide-react";
import { invoices, balance, patient } from "@/features/portal/mockData";
import { clientProfile, proPlans } from "@/features/portal/proData";
import { useProductMode } from "@/lib/productMode";

export const Route = createFileRoute("/portal/billing")({
  head: () => ({ meta: [{ title: "Billing - ARCA Rx Portal" }] }),
  component: Billing,
});

function statusBadge(s: string) {
  if (s === "paid")      return <Badge variant="outline" className="border-[color:var(--success)]/40 text-[color:var(--success)]">Paid</Badge>;
  if (s === "due")       return <Badge variant="outline" className="border-[color:var(--danger)]/40 text-[color:var(--danger)]">Due</Badge>;
  return <Badge variant="outline">Scheduled</Badge>;
}

type PayCard = { brand: string; last4: string; exp: string; default: boolean };

function Billing() {
  // Client (pro) pays for a coaching package, not a clinic membership.
  // Derive the default plan from the mode (a useState initializer would
  // capture the rx default during SSR hydration, before the mode hydrates).
  const isPro = useProductMode() === "pro";
  const [planOverride, setPlanOverride] = useState<string | null>(null);
  const plan = planOverride ?? (isPro ? clientProfile.package : patient.membership);
  const [cards, setCards] = useState<PayCard[]>([{ brand: "VISA", last4: "4422", exp: "09/28", default: true }]);
  const [managingPlan, setManagingPlan] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const invoiceRows = isPro
    ? invoices.map((i) => ({ ...i, description: i.description.replace(/Membership/g, "Coaching") }))
    : invoices;

  function changePlan(v: Record<string, string>) {
    if (v.plan) setPlanOverride(v.plan);
  }
  function addCard(v: Record<string, string>) {
    const digits = (v.number || "").replace(/\D/g, "");
    const last4 = digits.slice(-4) || "0000";
    setCards((prev) => [...prev.map((c) => ({ ...c, default: false })), { brand: (v.brand || "Card").toUpperCase(), last4, exp: v.exp || "--/--", default: true }]);
  }
  function exportInvoices() {
    const header = "Invoice,Date,Description,Amount,Status";
    const rows = invoiceRows.map((i) => `${i.id},${i.date},"${i.description}",${i.amount},${i.status}`);
    const csv = [header, ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "arca-rx-invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice history exported", { description: `${invoices.length} invoices saved as CSV.` });
  }

  return (
    <div className="space-y-5 p-4 md:p-8">
      <CreateModal
        open={managingPlan}
        onClose={() => setManagingPlan(false)}
        title="Manage plan"
        description={isPro ? "Switch your coaching package. Changes apply at your next renewal." : "Switch your membership tier. Changes apply at your next renewal."}
        submitLabel="Update plan"
        onSubmit={changePlan}
        fields={[{ name: "plan", label: isPro ? "Coaching package" : "Membership tier", type: "select", options: isPro ? proPlans : ["Essential Membership", "Signature Membership", "Concierge Membership"] }]}
      />
      <CreateModal
        open={addingCard}
        onClose={() => setAddingCard(false)}
        title="Add payment method"
        description={isPro ? "Add a card to keep your coaching active." : "Add a card to keep your membership active."}
        submitLabel="Add card"
        onSubmit={addCard}
        fields={[
          { name: "brand", label: "Card brand", type: "select", options: ["Visa", "Mastercard", "Amex", "Discover"] },
          { name: "number", label: "Card number", placeholder: "•••• •••• •••• ••••" },
          { name: "exp", label: "Expiry (MM/YY)", placeholder: "09/28" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Invoices, payment methods, and {isPro ? "your coaching package" : "membership"}.</p>
      </div>

      {/* Balance + membership */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="surface-elevated md:col-span-1">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outstanding balance</p>
            <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">${balance.outstanding}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {balance.outstanding === 0 ? "You're all caught up." : "Pay to keep your membership active."}
            </p>
          </CardContent>
        </Card>
        <Card className="surface-elevated md:col-span-1">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next charge</p>
            <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">${balance.nextCharge}</p>
            <p className="mt-1 text-xs text-muted-foreground">On {balance.nextChargeDate}</p>
          </CardContent>
        </Card>
        <Card className="surface-elevated md:col-span-1">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{isPro ? "Coaching package" : "Membership"}</p>
            <p className="mt-2 text-base font-semibold">{plan}</p>
            <p className="mt-1 text-xs text-muted-foreground">Renews {patient.nextRenewal}</p>
            <Button size="sm" variant="outline" className="mt-3 h-8 text-xs" onClick={() => setManagingPlan(true)}>Manage plan</Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment methods */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment methods</p>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setAddingCard(true)}><Plus className="mr-1 h-3.5 w-3.5" />Add method</Button>
          </div>
          <div className="mt-3 space-y-2">
            {cards.map((c, idx) => (
              <div key={`${c.brand}-${c.last4}-${idx}`} className="flex items-center gap-3">
                <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gradient-to-br from-slate-800 to-slate-600 text-[10px] font-bold text-white">{c.brand}</div>
                <div>
                  <p className="text-sm font-medium">{c.brand} ending in {c.last4}</p>
                  <p className="text-[11px] text-muted-foreground">Expires {c.exp}{c.default ? " · default" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice history</p>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={exportInvoices}><Download className="mr-1 h-3.5 w-3.5" />Export</Button>
          </div>
          <div className="mt-3 overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Invoice</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoiceRows.map((i) => (
                  <tr key={i.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs">{i.id}</td>
                    <td className="px-3 py-2 text-xs">{i.date}</td>
                    <td className="px-3 py-2">{i.description}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">${i.amount}</td>
                    <td className="px-3 py-2">{statusBadge(i.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <CreditCard className="h-3 w-3" />Payments are processed securely. PCI-DSS compliant.
      </p>
    </div>
  );
}
