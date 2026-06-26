import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { formReviews } from "@/lib/fit-seed-extra";
import { Play, Mic, Pencil, Send, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/fit/reviews")({
  head: () => ({ meta: [{ title: "Form reviews - ARCA Fit" }] }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [activeId, setActiveId] = useState(formReviews[0].id);
  const active = formReviews.find((r) => r.id === activeId) ?? formReviews[0];
  const [scrub, setScrub] = useState(0.32);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching"
        title="Form-check reviews"
        description="Clients upload sets. Scrub, annotate, and send a voice note back."
        actions={<span className="rounded-full glass-panel-quiet px-3 py-1 text-[11px] text-muted-foreground">{formReviews.filter(r => r.status === "Pending review").length} pending</span>}
      />

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Panel title="Inbox">
          <ul className="space-y-1.5">
            {formReviews.map((r) => {
              const isActive = r.id === activeId;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => { setActiveId(r.id); setScrub(0.32); }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left ${
                      isActive
                        ? "border-[color:color-mix(in_oklab,var(--teal)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)]"
                        : "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]"
                    }`}
                  >
                    <div className="relative h-12 w-16 overflow-hidden rounded-md">
                      <img src={r.thumb} alt="" className="h-full w-full object-cover" />
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[9px] font-mono text-white">{r.durationSec}s</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{r.client}</p>
                      <p className="text-[11px] text-muted-foreground">{r.lift} · {r.submitted}</p>
                    </div>
                    {r.status === "Pending review" && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--data-neg)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel
            title={`${active.client} · ${active.lift}`}
            actions={<span className="text-[11px] text-muted-foreground">Submitted {active.submitted}</span>}
          >
            <div className="relative overflow-hidden rounded-xl bg-black">
              <img src={active.thumb} alt="" className="h-[360px] w-full object-cover opacity-90" />
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 60" preserveAspectRatio="none">
                <line x1="20" y1="10" x2="50" y2="22" stroke="oklch(0.7 0.13 190)" strokeWidth="0.4" strokeDasharray="0.8 0.4" />
                <line x1="50" y1="22" x2="55" y2="50" stroke="oklch(0.7 0.13 190)" strokeWidth="0.4" strokeDasharray="0.8 0.4" />
                <circle cx="20" cy="10" r="0.9" fill="oklch(0.7 0.13 190)" />
                <circle cx="50" cy="22" r="0.9" fill="oklch(0.7 0.13 190)" />
                <circle cx="55" cy="50" r="0.9" fill="oklch(0.7 0.13 190)" />
                <text x="22" y="9" fill="white" fontSize="2" fontFamily="ui-serif">shoulder over bar</text>
              </svg>
              <button className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/30">
                <Play className="h-6 w-6 fill-white text-white" />
              </button>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={0} max={1} step={0.001}
                value={scrub}
                onChange={(e) => setScrub(parseFloat(e.target.value))}
                className="w-full accent-[color:var(--teal)]"
              />
              <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>0:00</span>
                <span>{Math.round(scrub * active.durationSec)}s / {active.durationSec}s</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3 py-1.5 text-[11px] text-foreground"><Pencil className="h-3 w-3" /> Annotate</button>
              <button className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3 py-1.5 text-[11px] text-foreground"><Mic className="h-3 w-3" /> Voice note</button>
              <button className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3 py-1.5 text-[11px] text-foreground"><Clock className="h-3 w-3" /> Mark timestamp</button>
              <button className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background"><Send className="h-3 w-3" /> Send review</button>
            </div>
          </Panel>

          <Panel title="Coach notes">
            <textarea
              rows={4}
              defaultValue="Bar path is solid. Cue: drive elbows under and stay tight off the chest - looks like you're losing upper back tension at lockout. Drop 5lb next session and rebuild."
              className="w-full resize-none rounded-lg border border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--surface-glass)_60%,transparent)] p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--teal)]"
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
