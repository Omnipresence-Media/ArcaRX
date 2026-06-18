import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, RotateCcw } from "lucide-react";
import { pastOrders, products, type OrderStatus } from "@/features/portal/shopData";
import { cartStore } from "@/features/portal/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/shop/orders")({
  head: () => ({ meta: [{ title: "Orders — ARCA Rx Portal" }] }),
  component: Orders,
});

const STATUS: Record<OrderStatus, { label: string; icon: typeof Package; cls: string }> = {
  processing: { label: "Processing", icon: Package, cls: "border-amber-500/40 text-amber-600" },
  shipped:    { label: "Shipped",    icon: Truck,   cls: "border-sky-500/40 text-sky-600" },
  delivered:  { label: "Delivered",  icon: CheckCircle2, cls: "border-[color:var(--success)]/40 text-[color:var(--success)]" },
};

function Orders() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track shipments and reorder favorites.</p>
        </div>
        <Button asChild variant="outline" className="h-9 text-xs">
          <Link to="/portal/shop">Continue shopping</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {pastOrders.map((o) => {
          const s = STATUS[o.status];
          return (
            <Card key={o.id} className="surface-elevated p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-semibold">{o.id}</p>
                  <p className="text-[11px] text-muted-foreground">Placed {o.placed}</p>
                </div>
                <Badge variant="outline" className={`gap-1 ${s.cls}`}>
                  <s.icon className="h-3 w-3" />
                  {s.label}
                </Badge>
              </div>

              {(o.tracking || o.eta) && (
                <div className="mt-3 rounded-md border bg-card/60 p-2.5 text-xs">
                  {o.eta && <p className="font-medium">{o.eta}</p>}
                  {o.tracking && <p className="font-mono text-[11px] text-muted-foreground">Tracking · {o.tracking}</p>}
                </div>
              )}

              <div className="mt-3 space-y-2">
                {o.items.map((it) => {
                  const p = products.find((x) => x.id === it.productId);
                  if (!p) return null;
                  return (
                    <div key={it.productId} className="flex items-center gap-3">
                      <div className={`h-12 w-12 shrink-0 rounded-md bg-gradient-to-br ${p.gradient}`} />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">Qty {it.qty} · ${it.price.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <p className="text-sm">Total <span className="font-semibold">${o.total.toFixed(2)}</span></p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => {
                    o.items.forEach((it) => cartStore.add(it.productId, it.qty));
                    toast.success("Items added to cart");
                  }}
                >
                  <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reorder
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
