import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { services, patients } from "@/lib/seed-data";
import { Plus, Trash2, CreditCard } from "lucide-react";

export const Route = createFileRoute("/admin/pos")({
  head: () => ({ meta: [{ title: "Point of Sale — ARCA Rx" }] }),
  component: POS,
});

function POS() {
  const cart = [
    { ...services[0], qty: 40 },
    { ...services[6], qty: 1 },
  ];
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader eyebrow="Front Desk" title="Point of Sale" description="Ring up visits, retail, memberships, and gift cards." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="surface-elevated lg:col-span-3">
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Search services, products, members..." />
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {services.map(s => (
                <button key={s.id} className="rounded-md border bg-card/60 p-3 text-left hover:border-[color:var(--teal)] hover:shadow-sm transition">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.category}</p>
                  <p className="mt-1 font-medium leading-tight">{s.name}</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">${s.price}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="surface-elevated lg:col-span-2">
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Patient</p>
              <p className="mt-0.5 font-semibold">{patients[0].name}</p>
              <p className="font-mono text-xs text-muted-foreground">{patients[0].mrn}</p>
            </div>
            <div className="border-t pt-3 space-y-2">
              {cart.map((c,i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.qty} × ${c.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums">${(c.price*c.qty).toFixed(0)}</span>
                    <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full"><Plus className="mr-1.5 h-4 w-4" />Add line</Button>
            </div>
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax 8.25%</span><span className="font-mono tabular-nums">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-semibold pt-1.5 border-t"><span>Total</span><span className="font-mono tabular-nums">${total.toFixed(2)}</span></div>
            </div>
            <Button className="w-full gradient-brand text-white h-11"><CreditCard className="mr-2 h-4 w-4" />Charge ${total.toFixed(2)}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
