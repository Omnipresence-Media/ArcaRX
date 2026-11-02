import { useState } from "react";
import { FlaskConical, X } from "lucide-react";
import { toast } from "sonner";
import {
  useSpruce, setScenario, advanceToMonday, demoFailRenewal, demoMissAnotherMonth, decideVisit, shipPending, resetDemo,
  type Scenario,
} from "./store";

// Prototype-only control panel. Stands in for the production dev panel: time
// travel, mock doctor decisions, mock pharmacy shipments, and an outbox
// viewer showing every PHI-free email and Slack alert the system would send.

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: "new", label: "New signup" },
  { id: "pending", label: "Pending review" },
  { id: "changes", label: "Changes requested" },
  { id: "active", label: "Active member" },
  { id: "past_due", label: "Payment past due" },
  { id: "paused", label: "Paused" },
];

export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const s = useSpruce();
  const reviewing = s.visits.filter((v) => v.status === "in_review");
  const waiting = s.visits.filter((v) => v.status === "awaiting_patient").length;
  const shippable = s.orders.some((o) => o.shipments.some((sh) => sh.status === "submitted"));

  return (
    <div className="fixed bottom-20 left-3 z-50 md:bottom-4 md:left-auto md:right-4">
      {open ? (
        <div className="max-h-[75vh] w-[19rem] overflow-y-auto rounded-xl border bg-card p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prototype controls</p>
            <button onClick={() => setOpen(false)} aria-label="Close demo controls" className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>

          <p className="mb-1 text-[11px] font-medium">Patient scenario</p>
          <div className="mb-3 grid grid-cols-2 gap-1.5">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => { setScenario(sc.id); toast.success(`Scenario: ${sc.label}`); }}
                className={`rounded-md border px-2 py-1.5 text-left text-[11px] font-medium transition-colors ${s.scenario === sc.id ? "border-[color:var(--teal)] bg-[color:var(--accent)]" : "hover:bg-muted"}`}
              >
                {sc.label}
              </button>
            ))}
          </div>

          <p className="mb-1 text-[11px] font-medium">Make things happen</p>
          <div className="mb-3 space-y-1.5">
            <button onClick={() => { advanceToMonday(); toast.success("It is Monday. Check-in windows are open."); }} className="w-full rounded-md border px-2 py-1.5 text-left text-[11px] font-medium hover:bg-muted">Time travel to Monday (open check-ins)</button>
            <button onClick={() => { demoFailRenewal(); toast("Renewal charge declined."); }} className="w-full rounded-md border px-2 py-1.5 text-left text-[11px] font-medium hover:bg-muted">Fail the next renewal</button>
            <button onClick={() => { demoMissAnotherMonth(); toast("Another month passed with the card still failing."); }} className="w-full rounded-md border px-2 py-1.5 text-left text-[11px] font-medium hover:bg-muted">Another month passes unpaid</button>
            <button
              disabled={reviewing.length === 0}
              onClick={() => { decideVisit(reviewing[0].id, "approved"); toast.success("Doctor approved the visit."); }}
              className="w-full rounded-md border px-2 py-1.5 text-left text-[11px] font-medium hover:bg-muted disabled:opacity-40"
            >
              Doctor approves visit ({reviewing.length} in review{waiting ? `, ${waiting} not submitted` : ""})
            </button>
            <button
              disabled={reviewing.length === 0}
              onClick={() => { decideVisit(reviewing[0].id, "declined"); toast("Doctor declined the visit."); }}
              className="w-full rounded-md border px-2 py-1.5 text-left text-[11px] font-medium hover:bg-muted disabled:opacity-40"
            >
              Doctor declines visit
            </button>
            <button
              disabled={!shippable}
              onClick={() => { shipPending(); toast.success("Pending shipments sent with tracking."); }}
              className="w-full rounded-md border px-2 py-1.5 text-left text-[11px] font-medium hover:bg-muted disabled:opacity-40"
            >
              Ship everything that is ready
            </button>
            <button onClick={() => { resetDemo(); toast("Demo data reset."); }} className="w-full rounded-md border border-red-200 px-2 py-1.5 text-left text-[11px] font-medium text-red-700 hover:bg-red-50">Reset all demo data</button>
          </div>

          <p className="mb-1 text-[11px] font-medium">Outbox (what the system would send)</p>
          {s.outbox.length === 0 ? (
            <p className="rounded-md bg-muted px-2 py-2 text-[11px] text-muted-foreground">Nothing sent yet. Actions in the app land here, with no names, products or clinical details.</p>
          ) : (
            <ul className="space-y-1.5">
              {s.outbox.slice(0, 8).map((o) => (
                <li key={o.id} className="rounded-md bg-muted px-2 py-1.5 text-[11px]">
                  <span className="mr-1 rounded bg-background px-1 py-0.5 text-[10px] font-semibold uppercase">{o.channel}</span>
                  <span className="text-muted-foreground">to {o.to}</span>
                  <p className="mt-0.5 leading-snug">{o.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background shadow-lg md:h-auto md:w-auto md:gap-1.5 md:px-3 md:py-2"
          aria-label="Open prototype controls"
        >
          <FlaskConical className="h-4 w-4 md:h-3.5 md:w-3.5" />
          <span className="hidden md:inline">Demo</span>
          {s.outbox.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--teal)] px-1 text-[9px] font-bold text-white md:static md:h-auto md:min-w-0 md:bg-background md:px-1.5 md:text-[10px] md:font-semibold md:text-foreground">{s.outbox.length}</span>
          )}
        </button>
      )}
    </div>
  );
}
