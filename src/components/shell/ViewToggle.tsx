import { Fragment } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Stethoscope, User, Dumbbell, UserRound } from "lucide-react";
import { useProductMode, setProductMode, type ProductMode } from "@/lib/productMode";

// Four specific builds across two products:
//   ARCA Rx  -> Clinic (back office) | Patient (portal)
//   ARCA Pro -> Coach  (back office) | Client  (portal)
// Each chip sets the product mode and routes to that build's home. Patient and
// Client share /portal, so the mode is what distinguishes them.
const CHIPS: { id: string; label: string; icon: typeof User; to: string; mode: ProductMode; portal: boolean }[] = [
  { id: "clinic",  label: "Clinic",  icon: Stethoscope, to: "/admin/dashboard", mode: "rx",  portal: false },
  { id: "patient", label: "Patient", icon: User,        to: "/portal",          mode: "rx",  portal: true },
  { id: "coach",   label: "Coach",   icon: Dumbbell,    to: "/admin/fit",       mode: "pro", portal: false },
  { id: "client",  label: "Client",  icon: UserRound,   to: "/portal",          mode: "pro", portal: true },
];

export function ViewToggle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mode = useProductMode();
  const isPortal = pathname.startsWith("/portal");

  const current = isPortal
    ? mode === "pro" ? "client" : "patient"
    : mode === "pro" ? "coach" : "clinic";

  return (
    <div className="inline-flex items-center rounded-full border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_50%,transparent)] p-0.5 text-[11px] font-semibold backdrop-blur">
      {CHIPS.map((c, i) => {
        const active = current === c.id;
        return (
          <Fragment key={c.id}>
            {/* divider between the Rx pair and the Pro pair */}
            {i === 2 && <span className="mx-0.5 h-4 w-px bg-[color:var(--glass-stroke)]" aria-hidden />}
            <Link
              to={c.to}
              onClick={() => setProductMode(c.mode)}
              aria-label={c.label}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
                active
                  ? "bg-[color:var(--teal)] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <c.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{c.label}</span>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
