import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SpPage, Pill, ToneImage, VideoEmbed, EmptyState } from "@/features/spruce/ui";
import { headingFont } from "@/features/spruce/theme";
import { addToCart, useSpruce, type Product } from "@/features/spruce/store";
import { money, rxCoverage } from "@/features/spruce/rules";

export const Route = createFileRoute("/spruce/portal/store")({
  head: () => ({ meta: [{ title: "Store - Spruce Micro" }] }),
  component: Store,
});

type Filter = "all" | "rx" | "non_rx";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "rx", label: "Prescription" },
  { id: "non_rx", label: "Essentials" },
];

function TypePill({ type }: { type: Product["type"] }) {
  return type === "rx" ? <Pill tone="info">Prescription</Pill> : <Pill tone="brand">Essentials</Pill>;
}

function Store() {
  const s = useSpruce();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const myRx = useMemo(() => s.prescriptions.filter((r) => r.patientId === s.meId), [s.prescriptions, s.meId]);
  const products = useMemo(() => {
    const term = q.trim().toLowerCase();
    return s.products.filter(
      (p) =>
        p.active &&
        (filter === "all" || p.type === filter) &&
        (!term || p.name.toLowerCase().includes(term) || p.blurb.toLowerCase().includes(term)),
    );
  }, [s.products, q, filter]);

  const selected = s.products.find((p) => p.id === openId) ?? null;
  const cartCount = s.cart.reduce((a, l) => a + l.qty, 0);

  const add = (p: Product) => {
    addToCart(p.id, 1);
    setOpenId(null);
    toast.success(`${p.name} added to cart`, {
      action: { label: "View cart", onClick: () => { void navigate({ to: "/spruce/portal/cart" }); } },
    });
  };

  return (
    <SpPage title="Store" sub="Prescription treatments and daily essentials, shipped to your door.">
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="pl-9" aria-label="Search products" />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${filter === f.id ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products found" body="Try a different search or filter." />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpenId(p.id)}
              className="flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-shadow hover:shadow-md"
            >
              <ToneImage tone={p.tone} className="aspect-square w-full" />
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <TypePill type={p.type} />
                <p className="text-sm font-semibold leading-snug">{p.name}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{p.blurb}</p>
                <p className="mt-auto pt-1 text-sm font-semibold text-[color:var(--teal)]">{money(p.priceCents)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {cartCount > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 flex justify-center px-4 md:bottom-6">
          <Button asChild className="pointer-events-auto w-full max-w-md shadow-lg">
            <Link to="/spruce/portal/cart">
              <ShoppingBag className="h-4 w-4" />
              View cart, {cartCount} {cartCount === 1 ? "item" : "items"}
            </Link>
          </Button>
        </div>
      )}

      <Sheet open={selected !== null} onOpenChange={(o) => { if (!o) setOpenId(null); }}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto sm:mx-auto sm:max-w-lg">
          {selected && (
            <div className="space-y-4 p-4">
              <SheetHeader className="p-0">
                <ToneImage tone={selected.tone} className="aspect-[4/3] w-full rounded-xl" />
                <div className="flex items-center gap-2 pt-2">
                  <TypePill type={selected.type} />
                </div>
                <SheetTitle style={headingFont}>{selected.name}</SheetTitle>
                <SheetDescription>{selected.blurb}</SheetDescription>
              </SheetHeader>
              <p className="text-xl font-semibold text-[color:var(--teal)]">{money(selected.priceCents)}</p>
              <p className="text-sm text-muted-foreground">{selected.education}</p>
              {selected.videoId && <VideoEmbed id={selected.videoId} title={`${selected.name} video`} />}
              {selected.type === "rx" && (
                rxCoverage(myRx, selected.id) === "covered" ? (
                  <div className="rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                    You have an active prescription, this ships without a new visit.
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                    Needs a quick doctor visit. One flat $25 fee per order, no matter how many items.
                  </div>
                )
              )}
              <Button className="w-full" onClick={() => add(selected)}>Add to cart</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </SpPage>
  );
}
