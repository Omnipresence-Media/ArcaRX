import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shell/AppSidebar";
import { TopBar } from "@/components/shell/TopBar";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { MobileTabBar } from "@/components/shell/MobileTabBar";
import { DashboardCanvas } from "@/components/shell/DashboardCanvas";
import { useProductMode } from "@/lib/productMode";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

// Medical clinic modules that don't exist in the ARCA Pro (Coach) product.
const COACH_BLOCKED = [
  "/admin/scribe", "/admin/charts", "/admin/protocols", "/admin/intake",
  "/admin/photo-reviews", "/admin/telehealth", "/admin/population",
  "/admin/hipaa", "/admin/rcm",
];

function AdminLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const navigate = useNavigate();
  const isPro = useProductMode() === "pro";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Guard: a Coach can't reach the medical clinic modules via a deep link.
  useEffect(() => {
    if (isPro && COACH_BLOCKED.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      navigate({ to: "/admin/fit" });
    }
  }, [isPro, pathname, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SidebarProvider>
      {/* data-no-invert opts admin out of the marketing-site dark filter hack */}
      <div data-no-invert className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-transparent">
          <TopBar onOpenCommand={() => setCmdOpen(true)} />
          <main className="flex-1 pb-20 md:pb-6">
            <DashboardCanvas>
              <Outlet />
            </DashboardCanvas>
          </main>
        </SidebarInset>
        <MobileTabBar />
        <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      </div>
    </SidebarProvider>
  );
}
