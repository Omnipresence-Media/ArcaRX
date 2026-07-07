import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Users, Receipt, Boxes } from "lucide-react";
import { useProductMode } from "@/lib/productMode";

const rxItems = [
  { title: "Home", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Schedule", url: "/admin/calendar", icon: Calendar },
  { title: "Patients", url: "/admin/patients", icon: Users },
  { title: "Billing", url: "/admin/billing", icon: Receipt },
  { title: "Inventory", url: "/admin/inventory", icon: Boxes },
];

const proItems = [
  { title: "Home", url: "/admin/fit", icon: LayoutDashboard },
  { title: "Calendar", url: "/admin/fit/calendar", icon: Calendar },
  { title: "Clients", url: "/admin/fit/clients", icon: Users },
  { title: "Billing", url: "/admin/fit/billing", icon: Receipt },
  { title: "Inventory", url: "/admin/inventory", icon: Boxes },
];

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = useProductMode() === "pro" ? proItems : rxItems;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t bg-background md:hidden">
      {items.map((it) => {
        const active = pathname === it.url;
        return (
          <Link
            key={it.url}
            to={it.url}
            className={`flex flex-col items-center gap-1 py-2 text-[10px] ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <it.icon className="h-4 w-4" />
            <span>{it.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
