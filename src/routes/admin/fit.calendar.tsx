import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { calendarWeek } from "@/lib/fit-seed-extra";

export const Route = createFileRoute("/admin/fit/calendar")({
  head: () => ({ meta: [{ title: "Calendar — ARCA Fit" }] }),
  component: CalendarPage,
});

const TYPE_TONE: Record<string, string> = {
  "Lift":        "border-l-[color:var(--teal)]",
  "Check-in":    "border-l-[color:var(--data-pos)]",
  "Onboarding":  "border-l-[color:color-mix(in_oklab,var(--navy)_60%,white)]",
  "Form review": "border-l-[color:color-mix(in_oklab,var(--data-neg)_60%,white)]",
  "Run review":  "border-l-[color:var(--data-neutral)]",
  "Regroup":     "border-l-[color:color-mix(in_oklab,var(--data-neg)_45%,white)]",
  "Group class": "border-l-[color:var(--teal)]",
};

function CalendarPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader eyebrow="Coaching" title="This week" description="Sessions, check-ins, and reviews." />

      <Panel title="Week of June 9">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          {calendarWeek.map((d) => (
            <div key={d.day} className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{d.day}</p>
                <p className="metric-numeral text-lg text-foreground">{d.date}</p>
              </div>
              <ul className="space-y-1.5">
                {d.sessions.length === 0 && <li className="text-[11px] italic text-muted-foreground/70">No sessions</li>}
                {d.sessions.map((s) => (
                  <li key={s.id} className={`rounded-md border-l-2 bg-[color:color-mix(in_oklab,var(--surface-glass)_70%,transparent)] p-2 text-[11px] ${TYPE_TONE[s.type] ?? "border-l-foreground/30"}`}>
                    <p className="font-mono tabular-nums text-foreground/80">{s.time}</p>
                    <p className="font-medium text-foreground">{s.client}</p>
                    <p className="text-muted-foreground">{s.type} · {s.len}m · {s.room}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Sessions this week", value: calendarWeek.reduce((s, d) => s + d.sessions.length, 0) },
          { label: "No-shows YTD",       value: 11 },
          { label: "Avg session length", value: "58m" },
        ].map((k) => (
          <div key={k.label} className="glass-panel p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
            <p className="metric-numeral mt-2 text-3xl text-foreground">{k.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
