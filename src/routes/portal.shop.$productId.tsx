import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, ShieldCheck, Truck, Minus, Plus, ChevronLeft, RotateCw } from "lucide-react";
import { products } from "@/features/portal/shopData";
import { cartStore } from "@/features/portal/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/shop/$productId")({
  head: ({ params }) => {
    const p = products.find((x) => x.id === params.productId);
    return { meta: [{ title: p ? `${p.name} — ARCA Rx Shop` : "Product — ARCA Rx Shop" }] };
  },
  loader: ({ params }): { product: (typeof products)[0] } => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-sm text-muted-foreground">
      Product not found. <Link to="/portal/shop" className="text-[color:var(--teal)] underline">Back to shop</Link>
    </div>
  ),
});

function ProductDetail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (Route.useLoaderData() as any).product;
  const [qty, setQty] = useState(1);
  const [sub, setSub] = useState(false);

  return (
    <div className="space-y-5 p-4 md:p-8">
      <Link
        to="/portal/shop"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Back to shop
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Image */}
        <Card className="surface-elevated overflow-hidden p-0">
          <div className={`aspect-square w-full bg-gradient-to-br ${p.gradient}`} />
        </Card>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{p.category}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{p.name}</h1>
            <p className="text-sm text-muted-foreground">{p.tagline}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{p.rating}</span>
            <span className="text-muted-foreground">· {p.reviews} reviews</span>
            {p.rx && <Badge variant="outline" className="ml-2 border-[color:var(--teal)]/40 text-[color:var(--teal)]">Rx required</Badge>}
            {p.inStock ? (
              <Badge className="badge-active">In stock</Badge>
            ) : (
              <Badge variant="outline">Sold out</Badge>
            )}
          </div>

          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-[color:var(--teal)]">${p.memberPrice.toFixed(2)}</p>
            <p className="pb-1 text-sm text-muted-foreground line-through">${p.price.toFixed(2)}</p>
            <Badge variant="outline" className="mb-1 text-[10px]">Member −15%</Badge>
          </div>

          {p.subscribable && (
            <label className={`flex cursor-pointer items-center justify-between rounded-md border p-3 transition-colors ${sub ? "border-[color:var(--teal)] bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)]" : "bg-card/60"}`}>
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-[color:var(--teal)]" />
                <div>
                  <p className="text-sm font-medium">Subscribe & save an extra 15%</p>
                  <p className="text-[11px] text-muted-foreground">Auto-ships every month · cancel anytime</p>
                </div>
              </div>
              <input type="checkbox" checked={sub} onChange={(e) => setSub(e.target.checked)} className="h-4 w-4 accent-[color:var(--teal)]" />
            </label>
          )}

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-md border bg-card">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-9 w-9 items-center justify-center hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <Button
              className="flex-1 gradient-brand text-white hover:opacity-95"
              disabled={!p.inStock}
              onClick={() => {
                cartStore.add(p.id, qty);
                toast.success(`Added ${qty} × ${p.name} to cart`);
              }}
            >
              {p.rx ? "Request prescription" : "Add to cart"}
            </Button>
          </div>

          {p.rx && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-amber-600" />
              <p className="text-foreground/80">
                This is a prescription product. After checkout, your provider will review your chart and approve before shipping.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Free shipping over $75</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> 3rd-party tested</div>
          </div>

          <Tabs defaultValue="overview" className="pt-2">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="howto">How to use</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm leading-relaxed text-muted-foreground">{p.overview}</TabsContent>
            <TabsContent value="ingredients" className="pt-3">
              <ul className="space-y-1.5 text-sm">
                {p.ingredients.map((i: string) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--teal)]" />
                    {i}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="howto" className="pt-3 text-sm text-muted-foreground">{p.howTo}</TabsContent>
            <TabsContent value="reviews" className="space-y-3 pt-3">
              {[
                { name: "Sara M.", at: "May 30", rating: 5, text: "Noticed a real difference in energy within 2 weeks." },
                { name: "James K.", at: "May 14", rating: 5, text: "Quality is top-tier. Will reorder." },
                { name: "Priya R.", at: "Apr 22", rating: 4, text: "Great product, packaging could be smaller." },
              ].map((r) => (
                <div key={r.name} className="rounded-md border bg-card/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.at}</p>
                  </div>
                  <div className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
