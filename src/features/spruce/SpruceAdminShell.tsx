import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardCheck, Users, Camera, Inbox, Package, ShoppingBag, Tag, Palette, ArrowUpRight,
} from "lucide-react";
import { adminCounts, useSpruce } from "./store";
import { DemoPanel } from "./DemoPanel";
import { headingFont } from "./theme";

// Staff admin keeps ARCA Rx platform styling (navy + teal) with the clinic
// name and mark. Only the patient portal wears the tenant theme.

export function SpruceAdminShell() {
  const s = useSpruce();
  const c = adminCounts(s);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const NAV = [
    { to: "/spruce/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, badge: 0 },
    { to: "/spruce/admin/approvals", label: "Approvals", icon: ClipboardCheck, badge: c.approvals },
    { to: "/spruce/admin/patients", label: "Patients", icon: Users, badge: 0 },
    { to: "/spruce/admin/check-ins", label: "Check-ins", icon: Camera, badge: c.checkInsToReview },
    { to: "/spruce/admin/inbox", label: "Inbox", icon: Inbox, badge: c.openEmergencies + c.unanswered + c.openTickets },
    { to: "/spruce/admin/orders", label: "Orders", icon: Package, badge: c.heldRx },
    { to: "/spruce/admin/products", label: "Products", icon: ShoppingBag, badge: 0 },
    { to: "/spruce/admin/promos", label: "Promo codes", icon: Tag, badge: 0 },
    { to: "/spruce/admin/branding", label: "Branding", icon: Palette, badge: 0 },
  ] as const;

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname === to || pathname.startsWith(to + "/"));

  return (
    <div data-no-invert className="flex min-h-screen w-full bg-[#F8FAFB] text-[#0F1F3D]">
      <aside className="hidden w-60 shrink-0 flex-col bg-[#0F1F3D] text-white md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B5A4] text-sm font-bold text-white" style={headingFont}>S</div>
          <div className="leading-tight">
            <p className="text-sm font-semibold" style={headingFont}>Spruce Micro</p>
            <p className="text-[10px] text-white/60">Staff admin · ARCA Rx</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {NAV.map((n) => {
            const active = isActive(n.to, "exact" in n ? n.exact : false);
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-white/12 font-medium text-white" : "text-white/65 hover:bg-white/8 hover:text-white"}`}>
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{n.label}</span>
                {n.badge > 0 && <span className="rounded-full bg-[#00B5A4] px-1.5 text-[10px] font-bold text-white">{n.badge}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3 text-xs">
          <p className="font-medium">Dana Whitfield</p>
          <p className="text-white/55">Clinic admin</p>
          <Link to="/spruce/portal" className="inline-flex items-center gap-1 text-[#5ee0d2] hover:underline">Open patient view <ArrowUpRight className="h-3 w-3" /></Link>
          <Link to="/spruce" className="block text-white/55 hover:text-white">Switch demo view</Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-white/95">
          <div className="flex h-14 items-center gap-3 px-3 md:px-6">
            <p className="text-sm font-semibold md:hidden" style={headingFont}>Spruce Micro Admin</p>
            <p className="hidden text-xs text-[#64748B] md:block">ARCA Rx <span className="mx-1">/</span> <span className="text-[#0F1F3D]">Spruce Micro</span></p>
            <Link to="/spruce/portal" className="ml-auto text-xs font-medium text-[#00B5A4] md:hidden">Patient view</Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t px-2 py-1.5 md:hidden">
            {NAV.map((n) => {
              const active = isActive(n.to, "exact" in n ? n.exact : false);
              return (
                <Link key={n.to} to={n.to} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${active ? "bg-[#0F1F3D] text-white" : "text-[#64748B]"}`}>
                  {n.label}
                  {n.badge > 0 && <span className="rounded-full bg-[#00B5A4] px-1.5 text-[9px] font-bold text-white">{n.badge}</span>}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
      <DemoPanel />
    </div>
  );
}
