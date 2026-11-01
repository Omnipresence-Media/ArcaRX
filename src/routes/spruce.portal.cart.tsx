import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CreditCard, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpPage, SectionCard, Pill, EmptyState, ToneImage } from "@/features/spruce/ui";
import { placeOrder, setCartQty, useMe, useSpruce } from "@/features/spruce/store";
import { SETTINGS, discountChoice, money, priceCart, rxCoverage, shippingFor, tierPct } from "@/features/spruce/rules";

export const Route = createFileRoute("/spruce/portal/cart")({
  head: () => ({ meta: [{ title: "Cart - Spruce Micro" }] }),
  component: Cart,
});

function Cart() {
  const s = useSpruce();
  const me = useMe();
  const navigate = useNavigate();
  const [choiceOverride, setChoiceOverride] = useState<"tier" | "promo" | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<{ code: string; pct: number } | null>(null);

  const lines = useMemo(
    () =>
      s.cart.flatMap((l) => {
        const p = s.products.find((x) => x.id === l.productId);
        return p ? [{ product: p, qty: l.qty }] : [];
      }),
    [s.cart, s.products],
  );
  const myRx = useMemo(() => s.prescriptions.filter((r) => r.patientId === s.meId), [s.prescriptions, s.meId]);

  if (lines.length === 0) {
    return (
      <SpPage title="Cart">
        <EmptyState
          title="Your cart is empty"
          body="Browse prescription treatments and daily essentials in the store."
          action={<Button asChild size="sm"><Link to="/spruce/portal/store">Go to the store</Link></Button>}
        />
      </SpPage>
    );
  }

  const base = lines.map((l) => ({ productId: l.product.id, qty: l.qty, type: l.product.type, unitCents: l.product.priceCents }));
  const subtotal = priceCart(base, 0).subtotalCents;
  const promoPct = appliedCode ? appliedCode.pct : null;
  const dc = discountChoice(subtotal, promoPct);
  const choice: "tier" | "promo" = choiceOverride === "promo" && promoPct === null ? dc.best : (choiceOverride ?? dc.best);
  const pct = choice === "promo" && promoPct !== null ? promoPct : dc.tierPct;
  const priced = priceCart(base, pct);
  const shipping = shippingFor(base.map((b) => b.type));
  const needsVisitIds = lines.filter((l) => l.product.type === "rx" && rxCoverage(myRx, l.product.id) === "needs_visit").map((l) => l.product.id);
  const needsVisit = needsVisitIds.length > 0;
  const doctorFee = needsVisit ? SETTINGS.doctorVisitFeeCents : 0;
  const total = priced.subtotalCents - priced.discountCents + shipping + doctorFee;
  const held = priced.lines.reduce((a, l) => (needsVisitIds.includes(l.productId) ? a + l.lineCents - l.discountCents : a), 0);
  const chargedNow = total - held;

  const nextTier = SETTINGS.discountTiers.find((t) => t.minCents > subtotal && t.pct > tierPct(subtotal));
  const hasRx = base.some((b) => b.type === "rx");

  const applyCode = () => {
    const code = codeInput.trim();
    const promo = s.promos.find((p) => p.active && p.code.toLowerCase() === code.toLowerCase());
    if (!promo) {
      setAppliedCode(null);
      toast.error("That code is not valid or has expired.");
      return;
    }
    const better = discountChoice(subtotal, promo.percentOff).best;
    setAppliedCode({ code: promo.code, pct: promo.percentOff });
    setChoiceOverride(better);
    toast.success(`${promo.code} applied, ${promo.percentOff}% off`);
  };

  const place = () => {
    if (!me.card) {
      toast.error("Add a card in your account first.");
      return;
    }
    const res = placeOrder({ discount: choice, promoCode: choice === "promo" ? appliedCode?.code : undefined });
    if (!res) {
      toast.error("Could not place the order.");
      return;
    }
    if (res.visitId) {
      toast.success("Order placed. One more step: your doctor visit.");
      void navigate({ to: "/spruce/portal/visit", search: { id: res.visitId } });
    } else {
      toast.success("Order placed");
      void navigate({ to: "/spruce/portal/orders" });
    }
  };

  return (
    <SpPage title="Cart" sub="Review your items and check out.">
      <SectionCard title="Items">
        <ul className="divide-y">
          {lines.map(({ product: p, qty }) => (
            <li key={p.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <ToneImage tone={p.tone} className="h-16 w-16 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-semibold leading-snug">{p.name}</p>
                <div className="flex items-center gap-2">
                  {p.type === "rx" ? <Pill tone="info">Prescription</Pill> : <Pill tone="brand">Essentials</Pill>}
                  <span className="text-xs text-muted-foreground">{money(p.priceCents)} each</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label={`Decrease ${p.name}`} onClick={() => setCartQty(p.id, qty - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-7 text-center text-sm font-medium">{qty}</span>
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label={`Increase ${p.name}`} onClick={() => setCartQty(p.id, qty + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{money(p.priceCents * qty)}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" aria-label={`Remove ${p.name}`} onClick={() => { setCartQty(p.id, 0); toast.success(`${p.name} removed`); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Discount">
        <p className="mb-3 text-xs text-muted-foreground">Choose one: the automatic discount or a promo code. They cannot be combined.</p>
        <div className="space-y-2">
          <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${choice === "tier" ? "border-[color:var(--teal)] bg-accent" : ""}`}>
            <input type="radio" name="discount" checked={choice === "tier"} onChange={() => setChoiceOverride("tier")} />
            <span className="flex-1 text-sm font-medium">Automatic {dc.tierPct}% off</span>
            {dc.best === "tier" && promoPct !== null && <Pill tone="success">Best value</Pill>}
          </label>
          <div className={`rounded-lg border p-3 ${choice === "promo" ? "border-[color:var(--teal)] bg-accent" : ""}`}>
            <label className={`flex items-center gap-3 ${promoPct !== null ? "cursor-pointer" : "cursor-default opacity-80"}`}>
              <input type="radio" name="discount" disabled={promoPct === null} checked={choice === "promo"} onChange={() => setChoiceOverride("promo")} />
              <span className="flex-1 text-sm font-medium">
                {appliedCode ? `Promo code ${appliedCode.code}, ${appliedCode.pct}% off` : "Promo code"}
              </span>
              {dc.best === "promo" && <Pill tone="success">Best value</Pill>}
            </label>
            <div className="mt-2 flex gap-2">
              <Input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="Enter code" aria-label="Promo code" className="uppercase" />
              <Button type="button" variant="outline" onClick={applyCode}>Apply</Button>
            </div>
          </div>
        </div>
        {nextTier && (
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            Add {money(nextTier.minCents - subtotal)} more to reach {nextTier.pct}% off.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Summary">
        <dl className="space-y-2 text-sm">
          <Row label="Subtotal" value={money(priced.subtotalCents)} />
          <Row label={`Discount (${pct}%${choice === "promo" && appliedCode ? `, ${appliedCode.code}` : ", automatic"})`} value={`-${money(priced.discountCents)}`} />
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium">{shipping === 0 ? "Free" : money(shipping)}</dd>
          </div>
          {shipping === 0 && hasRx && <p className="text-xs text-muted-foreground">Prescription-only orders ship free.</p>}
          {shipping > 0 && <p className="text-xs text-muted-foreground">One flat shipping fee covers any essentials in your cart.</p>}
          {needsVisit && (
            <>
              <Row label="Doctor visit (one flat fee)" value={money(doctorFee)} />
              <p className="text-xs text-muted-foreground">
                A doctor needs to review {needsVisitIds.length === 1 ? "one prescription item" : "some prescription items"} before it ships. One flat fee covers every item that needs review.
              </p>
            </>
          )}
          <div className="flex items-baseline justify-between gap-3 border-t pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{money(total)}</dd>
          </div>
        </dl>
        <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          {held > 0
            ? `Charged now: ${money(chargedNow)}. ${money(held)} for prescription items waiting on the doctor stays on hold and is only charged if approved.`
            : `Charged now: ${money(total)}.`}
        </div>
      </SectionCard>

      <SectionCard title="Payment">
        {me.card ? (
          <div className="flex items-center gap-3 text-sm">
            <CreditCard className="h-5 w-5 text-[color:var(--teal)]" />
            <span>{me.card.brand} ending {me.card.last4}</span>
            <span className="ml-auto text-xs text-muted-foreground">Exp {me.card.exp}</span>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>No card on file. <Link to="/spruce/portal/account" className="font-semibold underline">Add a card in your account</Link> to check out.</span>
          </div>
        )}
      </SectionCard>

      <Button className="w-full" size="lg" onClick={place} disabled={!me.card}>Place order, {money(total)}</Button>
    </SpPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
