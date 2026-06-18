import { Link, useRouterState } from "@tanstack/react-router";
import { Stethoscope, User } from "lucide-react";

export function ViewToggle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPatient = pathname.startsWith("/portal");

  return (
    <div className="inline-flex items-center rounded-full border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_50%,transparent)] p-0.5 text-[11px] font-semibold backdrop-blur">
      <Link
        to="/admin/dashboard"
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
          !isPatient
            ? "bg-[color:var(--teal)] text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Stethoscope className="h-3 w-3" />
        Clinic
      </Link>
      <Link
        to="/portal"
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
          isPatient
            ? "bg-[color:var(--teal)] text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User className="h-3 w-3" />
        Patient
      </Link>
    </div>
  );
}
