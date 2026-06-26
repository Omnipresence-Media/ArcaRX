import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Star, Package, Sparkles } from "lucide-react";
import { products, categories, type Category } from "@/features/portal/shopData";
import { cartStore, useCartCount } from "@/features/portal/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/shop/")({
  head: () => ({ meta: [{ title: "Shop - ARCA Rx Portal" }] }),
  component: ShopIndex,
});

function ShopIndex() {
  const [cat, setCat] = useState<Category>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const count = useCartCount();

  const filtered = useMemo(() => {
    let list = products.filter((p) => (cat === "All" ? true : p.category === cat));
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.tagline.toLowerCase().includes(s));
    }
    if (sort === "price-asc")  list = [...list].sort((a, b) => a.memberPrice - b.memberPrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.memberPrice - a.memberPrice);
    if (sort === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [cat, q, sort]);

  return (
    <div className="space-y-5 p-4 md:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shop</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Member pricing applied at checkout · Free shipping over $75
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/portal/shop/orders"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border bg-card px-3 text-xs font-medium hover:bg-muted"
          >
            <Package className="h-3.5 w-3.5" /> Orders
          </Link>
          <Link
            to="/portal/shop/cart"
            className="relative inline-flex h-9 items-center gap-1.5 rounded-md border bg-card px-3 text-xs font-medium hover:bg-muted"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Cart
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--teal)] px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Hero bundle */}
      <Card className="surface-elevated relative overflow-hidden border-0 p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--teal)] via-sky-600 to-indigo-700" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative grid gap-4 p-5 text-white md:grid-cols-[1fr_auto] md:items-end md:p-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">Bundle of the month</p>
            </div>
            <p className="mt-1.5 text-xl font-semibold leading-tight md:text-2xl">Foundations Stack - save 22%</p>
            <p className="mt-1 max-w-md text-xs text-white/80 md:text-sm">
              D3 + K2, Magnesium Glycinate, Methylated B-Complex, and Omega-3. The four daily essentials.
            </p>
          </div>
          <Button className="bg-white text-slate-900 hover:bg-white/90">Shop the stack</Button>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="h-9 pl-8 text-sm" />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-9 rounded-md border bg-card px-3 text-xs"
        >
          <option value="featured">Featured</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {categories.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-white"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <Card key={p.id} className="surface-elevated group overflow-hidden p-0">
            <Link to="/portal/shop/$productId" params={{ productId: p.id }} className="block">
              <div className={`relative aspect-square w-full bg-gradient-to-br ${p.gradient}`}>
                {p.badge && (
                  <Badge className="absolute left-2 top-2 bg-white/90 text-[9px] uppercase tracking-wide text-slate-900 hover:bg-white">
                    {p.badge}
                  </Badge>
                )}
                {!p.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white">
                    Sold out
                  </div>
                )}
              </div>
            </Link>
            <div className="space-y-1.5 p-3">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {p.rating} · {p.reviews}
              </div>
              <Link to="/portal/shop/$productId" params={{ productId: p.id }} className="block">
                <p className="line-clamp-1 text-sm font-semibold leading-tight">{p.name}</p>
                <p className="line-clamp-1 text-[11px] text-muted-foreground">{p.tagline}</p>
              </Link>
              <div className="flex items-end justify-between pt-1">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--teal)]">${p.memberPrice.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground line-through">${p.price.toFixed(2)}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!p.inStock}
                  className="h-7 px-2 text-[11px]"
                  onClick={() => {
                    cartStore.add(p.id, 1);
                    toast.success(`Added · ${p.name}`);
                  }}
                >
                  {p.rx ? "Request" : "Add"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
