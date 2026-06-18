import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Home, Calendar, Pill, FlaskConical, MessageSquare,
  LineChart, CreditCard, UserCircle, Bell, Plus, ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { ViewToggle } from "@/components/shell/ViewToggle";
import { patient } from "./mockData";
import { useCartCount } from "./cart";

const NAV = [
  { to: "/portal",          label: "Home",     icon: Home,          exact: true },
  { to: "/portal/visits",   label: "Visits",   icon: Calendar       },
  { to: "/portal/meds",     label: "Meds",     icon: Pill           },
  { to: "/portal/shop",     label: "Shop",     icon: ShoppingBag    },
  { to: "/portal/labs",     label: "Labs",     icon: FlaskConical   },
  { to: "/portal/messages", label: "Messages", icon: MessageSquare  },
  { to: "/portal/progress", label: "Progress", icon: LineChart      },
  { to: "/portal/billing",  label: "Billing",  icon: CreditCard     },
  { to: "/portal/account",  label: "Account",  icon: UserCircle     },
] as const;

export function PortalShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [fabOpen, setFabOpen] = useState(false);
  const cartCount = useCartCount();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div data-no-invert className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop left rail */}
      <aside className="hidden md:flex md:w-60 flex-col border-r border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_40%,transparent)] backdrop-blur-xl">
        <div className="flex h-14 items-center gap-2 border-b border-[color:var(--glass-stroke)] px-4">
          <div className="h-7 w-7 rounded-md gradient-brand" />
          <div className="leading-tight">
            <p className="text-[11px] font-semibold tracking-wide">ARCA Rx</p>
            <p className="text-[10px] text-muted-foreground">Patient</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map((n) => {
            const active = isActive(n.to, "exact" in n ? n.exact : false);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <n.icon className={`h-4 w-4 ${active ? "text-[color:var(--teal)]" : ""}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[color:var(--glass-stroke)] p-3">
          <div className="flex items-center gap-2.5 rounded-md p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-[11px] font-semibold text-white">
              {patient.avatarInitials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-medium">{patient.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{patient.membership}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_65%,transparent)] px-3 backdrop-blur-xl md:px-6">
          <ViewToggle />
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span>ARCA Rx</span>
            <span>/</span>
            <span className="text-foreground">Patient Portal</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link
              to="/portal/shop/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--teal)] px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[color:var(--danger)]" />
            </button>
            <div className="md:hidden flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-[11px] font-semibold text-white">
              {patient.avatarInitials}
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        {fabOpen && (
          <div className="mb-2 flex flex-col items-end gap-2">
            {[
              { label: "Message care team", to: "/portal/messages" },
              { label: "Request refill",    to: "/portal/meds" },
              { label: "Book visit",        to: "/portal/visits" },
              { label: "Log check-in",      to: "/portal/progress" },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                onClick={() => setFabOpen(false)}
                className="rounded-full border bg-card px-3.5 py-2 text-xs font-medium shadow-md"
              >
                {a.label}
              </Link>
            ))}
          </div>
        )}
        <button
          onClick={() => setFabOpen((o) => !o)}
          className="flex h-14 w-14 items-center justify-center rounded-full gradient-brand text-white shadow-lg"
          aria-label="Quick actions"
        >
          <Plus className={`h-6 w-6 transition-transform ${fabOpen ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_85%,transparent)] backdrop-blur-xl md:hidden">
        {NAV.slice(0, 5).map((n) => {
          const active = isActive(n.to, "exact" in n ? n.exact : false);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] ${
                active ? "text-[color:var(--teal)]" : "text-muted-foreground"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
