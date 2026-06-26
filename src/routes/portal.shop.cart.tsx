import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle2, CreditCard, MapPin } from "lucide-react";
import { products } from "@/features/portal/shopData";
import { cartStore, useCart } from "@/features/portal/cart";
import { patient } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/shop/cart")({
  head: () => ({ meta: [{ title: "Cart - ARCA Rx Portal" }] }),
  component: CartPage,
});

function CartPage() {
  const lines = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState<string | null>(null);

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const p = products.find((x) => x.id === l.productId);
          return p ? { ...l, product: p } : null;
        })
        .filter(Boolean) as { productId: string; qty: number; product: (typeof products)[number] }[],
    [lines],
  );

  const subtotal = items.reduce((s, i) => s + i.product.memberPrice * i.qty, 0);
  const savings  = items.reduce((s, i) => s + (i.product.price - i.product.memberPrice) * i.qty, 0);
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 8;
  const tax      = +(subtotal * 0.0825).toFixed(2);
  const total    = +(subtotal + shipping + tax).toFixed(2);

  function place() {
    const id = `ORD-${10300 + Math.floor(Math.random() * 99)}`;
    cartStore.clear();
    setPlaced(id);
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--success)_18%,transparent)]">
          <CheckCircle2 className="h-8 w-8 text-[color:var(--success)]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Order placed</h1>
          <p className="mt-1 text-sm text-muted-foreground">Confirmation sent to {patient.email}</p>
        </div>
        <Card className="surface-elevated p-4 text-left text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order #</span>
            <span className="font-mono font-semibold">{placed}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
        </Card>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => navigate({ to: "/portal/shop/orders" })}>View orders</Button>
          <Button className="flex-1 gradient-brand text-white" onClick={() => navigate({ to: "/portal/shop" })}>Keep shopping</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">Browse the shop to add items.</p>
        <Button asChild className="gradient-brand text-white">
          <Link to="/portal/shop">Go to shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <div className="space-y-3">
          {items.map((i) => (
            <Card key={i.productId} className="surface-elevated overflow-hidden p-0">
              <div className="flex gap-3 p-3">
                <Link
                  to="/portal/shop/$productId"
                  params={{ productId: i.productId }}
                  className={`h-20 w-20 shrink-0 rounded-md bg-gradient-to-br ${i.product.gradient}`}
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to="/portal/shop/$productId"
                        params={{ productId: i.productId }}
                        className="line-clamp-1 text-sm font-semibold hover:underline"
                      >
                        {i.product.name}
                      </Link>
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">{i.product.tagline}</p>
                      {i.product.rx && (
                        <Badge variant="outline" className="mt-1 border-[color:var(--teal)]/40 text-[10px] text-[color:var(--teal)]">
                          Rx
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => cartStore.remove(i.productId)}
                      className="text-muted-foreground hover:text-[color:var(--danger)]"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="inline-flex items-center rounded-md border bg-card">
                      <button onClick={() => cartStore.setQty(i.productId, i.qty - 1)} className="flex h-8 w-8 items-center justify-center hover:bg-muted"><Minus className="h-3 w-3" /></button>
                      <span className="w-7 text-center text-xs font-semibold">{i.qty}</span>
                      <button onClick={() => cartStore.setQty(i.productId, i.qty + 1)} className="flex h-8 w-8 items-center justify-center hover:bg-muted"><Plus className="h-3 w-3" /></button>
                    </div>
                    <p className="text-sm font-semibold">${(i.product.memberPrice * i.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <Card className="surface-elevated p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order summary</p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between text-[color:var(--success)]"><dt>Member savings</dt><dd>−${savings.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>${tax.toFixed(2)}</dd></div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
            </dl>
          </Card>

          <Card className="surface-elevated p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[color:var(--teal)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ship to</p>
            </div>
            <div className="mt-2 text-sm">
              <p className="font-medium">{patient.name}</p>
              <p className="text-muted-foreground">2418 S Lamar Blvd, Apt 314</p>
              <p className="text-muted-foreground">Austin, TX 78704</p>
            </div>
          </Card>

          <Card className="surface-elevated p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[color:var(--teal)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</p>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-md border bg-card/60 p-2.5 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-9 items-center justify-center rounded bg-gradient-to-br from-slate-800 to-slate-600 text-[8px] font-bold text-white">VISA</div>
                <span>•••• 4242</span>
              </div>
              <span className="text-[11px] text-muted-foreground">exp 09/28</span>
            </div>
          </Card>

          <Button className="w-full gradient-brand text-white" onClick={place}>
            Place order · ${total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
