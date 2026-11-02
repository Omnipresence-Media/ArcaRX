import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home, Camera, FileText, ShoppingBag, Package, MessageSquare, BookOpen,
  LifeBuoy, Siren, UserCircle, Lock,
} from "lucide-react";
import { MEMBERSHIP_PRICE_CENTS, useMe, useSpruce } from "./store";
import { accessLevel, money, RESTRICTED_ALLOWED } from "./rules";
import { spruceStyleFor, useSpruceTheme, headingFont } from "./theme";
import { Pill } from "./ui";
import { DemoPanel } from "./DemoPanel";

const NAV = [
  { to: "/spruce/portal", label: "Home", icon: Home, exact: true },
  { to: "/spruce/portal/check-in", label: "Check-in", icon: Camera },
  { to: "/spruce/portal/protocols", label: "Protocols", icon: FileText },
  { to: "/spruce/portal/store", label: "Store", icon: ShoppingBag },
  { to: "/spruce/portal/orders", label: "Orders", icon: Package },
  { to: "/spruce/portal/messages", label: "Messages", icon: MessageSquare },
  { to: "/spruce/portal/learn", label: "Learn", icon: BookOpen },
  { to: "/spruce/portal/support", label: "Support", icon: LifeBuoy },
  { to: "/spruce/portal/emergency", label: "Emergency", icon: Siren },
  { to: "/spruce/portal/account", label: "Account", icon: UserCircle },
] as const;

const BOTTOM = [NAV[0], NAV[1], NAV[3], NAV[5], NAV[9]] as const;

function PausedScreen() {
  const me = useMe();
  const missed = me.missedMonths ?? [];
  const price = me.membershipType ? MEMBERSHIP_PRICE_CENTS[me.membershipType] : 0;
  const owed = money(price * missed.length);
  const reason =
    me.membership === "past_due"
      ? { title: "Your payment did not go through", body: missed.length > 1
          ? `${missed.length} renewals are owed (${missed.join(", ")}), ${owed} in total. Update your card and they are charged together. Your billing date stays the same.`
          : `Update your card to keep your membership active.${me.graceDaysLeft ? ` You have ${me.graceDaysLeft} days left before your membership pauses.` : ""}` }
      : me.membership === "paused"
        ? { title: "Your membership is paused", body: "Update your card to reactivate. Your billing date stays the same." }
        : { title: "Your membership has ended", body: "Reactivate with a payment method to get back in." };
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Lock className="h-6 w-6" /></div>
      <div>
        <h1 className="text-xl font-semibold" style={headingFont}>{reason.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{reason.body}</p>
      </div>
      <Link to="/spruce/portal/account" className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">Update payment method</Link>
      <div className="w-full rounded-xl border bg-card p-3 text-left">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Still available to you</p>
        <ul className="space-y-1.5 text-sm">
          <li><Link className="text-[color:var(--teal)] hover:underline" to="/spruce/portal/protocols">Download your records and protocols</Link></li>
          <li><Link className="text-[color:var(--teal)] hover:underline" to="/spruce/portal/emergency">Emergency form</Link></li>
          <li><Link className="text-[color:var(--teal)] hover:underline" to="/spruce/portal/support">Contact support</Link></li>
        </ul>
      </div>
    </div>
  );
}

export function SpruceShell() {
  const me = useMe();
  const s = useSpruce();
  const brand = s.branding;
  useSpruceTheme(brand);
  const level = accessLevel(me);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  // The server always renders the seed state, so gating decisions made before
  // the real (localStorage) state is in would flash the wrong screen and bounce
  // the user between routes. Wait one mount before gating or redirecting.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const onOnboarding = pathname.startsWith("/spruce/portal/onboarding");
  const restrictedOk = RESTRICTED_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  // A rejected applicant is told to contact support, so support must stay open.
  const onSupport = pathname === "/spruce/portal/support" || pathname.startsWith("/spruce/portal/support/");
  const gatedToOnboarding = level === "onboarding" && !onOnboarding && !(me.onboarding === "rejected" && onSupport);
  const leavingOnboarding = level !== "onboarding" && onOnboarding;
  const blocked = level === "restricted" && !restrictedOk;
  const cartCount = s.cart.filter((l) => s.products.some((p) => p.id === l.productId && p.active)).reduce((a, l) => a + l.qty, 0);

  useEffect(() => {
    if (!ready) return;
    if (gatedToOnboarding) navigate({ to: "/spruce/portal/onboarding", replace: true });
    if (leavingOnboarding) navigate({ to: "/spruce/portal", replace: true });
  }, [ready, gatedToOnboarding, leavingOnboarding, navigate]);

  // Only show links the member can actually use right now.
  const navItems = NAV.filter((n) => {
    if (level === "full") return true;
    if (level === "restricted") return n.to === "/spruce/portal/account" || RESTRICTED_ALLOWED.includes(n.to);
    return me.onboarding === "rejected" && n.to === "/spruce/portal/support";
  });
  const bottomItems = level === "full" ? BOTTOM : navItems.slice(0, 5);

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname === to || pathname.startsWith(to + "/"));
  const statusPill =
    level === "onboarding" ? <Pill tone="info">Getting started</Pill>
    : me.membership === "active" ? <Pill tone="success">Active member</Pill>
    : me.membership === "past_due" ? <Pill tone="warning">Payment past due</Pill>
    : me.membership === "paused" ? <Pill tone="warning">Paused</Pill>
    : <Pill tone="danger">Cancelled</Pill>;

  return (
    <div data-no-invert style={spruceStyleFor(brand)} className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b px-4">
          {brand.logoDataUrl
            ? <img src={brand.logoDataUrl} alt="" className="h-8 w-8 rounded-lg object-contain" />
            : <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground" style={headingFont}>{brand.name.charAt(0)}</div>}
          <div className="leading-tight">
            <p className="text-sm font-semibold" style={headingFont}>{brand.name}</p>
            <p className="text-[10px] text-muted-foreground">Patient portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {navItems.map((n) => {
            const active = isActive(n.to, "exact" in n ? n.exact : false);
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"} ${n.label === "Emergency" ? "text-red-700" : ""}`}>
                <n.icon className="h-4 w-4" />{n.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{me.name.split(" ").map((w) => w[0]).join("")}</div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium">{me.name}</p>
              <div className="mt-0.5">{statusPill}</div>
            </div>
          </div>
          <Link to="/spruce" className="block text-[11px] text-muted-foreground hover:text-foreground">Switch demo view</Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-3 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            {brand.logoDataUrl
              ? <img src={brand.logoDataUrl} alt="" className="h-7 w-7 rounded-md object-contain" />
              : <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground" style={headingFont}>{brand.name.charAt(0)}</div>}
            <span className="text-sm font-semibold" style={headingFont}>{brand.name}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden md:inline">{statusPill}</span>
            {level !== "onboarding" && !blocked && (
              <Link to="/spruce/portal/cart" aria-label="Cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--teal)] px-1 text-[9px] font-bold text-white">{cartCount}</span>}
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 pb-24 md:pb-8">
          {!ready || gatedToOnboarding || leavingOnboarding ? <div className="p-8 text-center text-sm text-muted-foreground">Loading your portal...</div> : blocked ? <PausedScreen /> : <Outlet />}
        </main>
      </div>

      {ready && level !== "onboarding" && (
        <nav style={{ gridTemplateColumns: `repeat(${bottomItems.length}, minmax(0, 1fr))` }} className="fixed inset-x-0 bottom-0 z-30 grid border-t bg-card md:hidden">
          {bottomItems.map((n) => {
            const active = isActive(n.to, "exact" in n ? n.exact : false);
            return (
              <Link key={n.to} to={n.to} className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] ${active ? "text-[color:var(--teal)]" : "text-muted-foreground"}`}>
                <n.icon className="h-4 w-4" />{n.label}
              </Link>
            );
          })}
        </nav>
      )}
      <DemoPanel />
    </div>
  );
}
