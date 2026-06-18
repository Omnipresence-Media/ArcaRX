import { Link } from "@tanstack/react-router";
import { Send, ChevronRight } from "lucide-react";
import { interventionQueue } from "@/lib/fit-seed-extra";
import { RiskPill } from "./RiskPill";

export function InterventionQueue() {
  return (
    <ul className="space-y-2">
      {interventionQueue.map((row) => (
        <li
          key={row.client.id}
          className="group flex items-center gap-3 rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3 transition-colors hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_75%,transparent)]"
        >
          <img src={row.client.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-[color:var(--glass-stroke-strong)]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground">{row.client.name}</p>
              <RiskPill level={row.level} compact />
            </div>
            <p className="truncate text-[11px] text-muted-foreground">{row.reason}</p>
          </div>
          <button
            type="button"
            className="hidden items-center gap-1 rounded-full border border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--teal)] transition-opacity hover:opacity-90 md:inline-flex"
            title={row.nudge}
          >
            <Send className="h-3 w-3" />
            Nudge
          </button>
          <Link to="/admin/fit/clients/$id" params={{ id: row.client.id }} className="text-foreground/40 hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
