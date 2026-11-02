import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, UserCircle, Stethoscope } from "lucide-react";
import { setScenario, useSpruce, type Scenario } from "@/features/spruce/store";
import { spruceStyleFor, useSpruceTheme, headingFont } from "@/features/spruce/theme";

export const Route = createFileRoute("/spruce/")({
  head: () => ({ meta: [{ title: "Spruce Micro - Prototype" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SpruceEntry,
});

const STARTS: { id: Scenario; label: string; hint: string }[] = [
  { id: "active", label: "Active member", hint: "Full portal, check-in due Friday" },
  { id: "new", label: "Brand new signup", hint: "Walk through onboarding" },
  { id: "pending", label: "Waiting on approval", hint: "Submitted, staff reviewing" },
  { id: "changes", label: "Changes requested", hint: "Fix the ID photo" },
  { id: "past_due", label: "Payment past due", hint: "Restricted access" },
  { id: "paused", label: "Paused membership", hint: "Update card to return" },
];

function SpruceEntry() {
  const brand = useSpruce().branding;
  useSpruceTheme(brand);
  const navigate = useNavigate();
  const s = useSpruce();

  return (
    <div data-no-invert style={spruceStyleFor(brand)} className="min-h-screen bg-background text-foreground">
      <div className="bg-primary px-6 py-14 text-primary-foreground">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold" style={headingFont}>S</div>
            <p className="text-lg font-semibold" style={headingFont}>Spruce Micro</p>
          </div>
          <h1 className="mt-8 text-3xl font-semibold leading-tight md:text-4xl" style={headingFont}>Your skincare practice, in your pocket.</h1>
          <p className="mt-3 max-w-xl text-sm text-white/75">
            Membership, check-ins with photos, protocols, a store with a built-in doctor visit, and chat with your practitioner. This is a clickable prototype on mock data.
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-8 grid max-w-3xl gap-4 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold"><UserCircle className="h-4 w-4 text-[color:var(--teal)]" /> I am a patient</div>
          <p className="mt-1 text-xs text-muted-foreground">Pick where you want to start. You can switch anytime from the Demo button.</p>
          <div className="mt-3 space-y-1.5">
            {STARTS.map((st) => (
              <button
                key={st.id}
                onClick={() => { setScenario(st.id); navigate({ to: "/spruce/portal" }); }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors hover:border-[color:var(--teal)] hover:bg-accent ${s.scenario === st.id ? "border-[color:var(--teal)] bg-accent" : ""}`}
              >
                <span>
                  <span className="block text-sm font-medium">{st.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{st.hint}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold"><Stethoscope className="h-4 w-4 text-[color:var(--teal)]" /> I am staff</div>
          <p className="mt-1 text-xs text-muted-foreground">Approvals, check-in reviews, protocols, inbox, orders, products and promo codes.</p>
          <Link to="/spruce/admin" className="mt-3 flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
            Open staff admin <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-4 rounded-lg bg-muted p-3 text-[11px] leading-relaxed text-muted-foreground">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Prototype notes</p>
            All data is synthetic. Use the floating Demo button to time travel, approve doctor visits, ship orders and see every email and Slack alert the system would send.
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground md:col-span-2">
          Built on ARCA Rx. <Link to="/" className="underline">Back to ARCA Rx</Link>
        </p>
      </div>
    </div>
  );
}
