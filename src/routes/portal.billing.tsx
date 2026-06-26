import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Download } from "lucide-react";
import { invoices, balance, patient } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/billing")({
  head: () => ({ meta: [{ title: "Billing - ARCA Rx Portal" }] }),
  component: Billing,
});

function statusBadge(s: string) {
  if (s === "paid")      return <Badge variant="outline" className="border-[color:var(--success)]/40 text-[color:var(--success)]">Paid</Badge>;
  if (s === "due")       return <Badge variant="outline" className="border-[color:var(--danger)]/40 text-[color:var(--danger)]">Due</Badge>;
  return <Badge variant="outline">Scheduled</Badge>;
}

function Billing() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Invoices, payment methods, and membership.</p>
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
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Membership</p>
            <p className="mt-2 text-base font-semibold">{patient.membership}</p>
            <p className="mt-1 text-xs text-muted-foreground">Renews {patient.nextRenewal}</p>
            <Button size="sm" variant="outline" className="mt-3 h-8 text-xs">Manage plan</Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment method */}
      <Card className="surface-elevated">
        <CardContent className="flex flex-col gap-3 p-4 md:p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gradient-to-br from-slate-800 to-slate-600 text-[10px] font-bold text-white">VISA</div>
            <div>
              <p className="text-sm font-medium">Visa ending in 4422</p>
              <p className="text-[11px] text-muted-foreground">Expires 09/28 · default</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs"><Plus className="mr-1 h-3.5 w-3.5" />Add method</Button>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice history</p>
            <Button size="sm" variant="ghost" className="h-8 text-xs"><Download className="mr-1 h-3.5 w-3.5" />Export</Button>
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
                {invoices.map((i) => (
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
