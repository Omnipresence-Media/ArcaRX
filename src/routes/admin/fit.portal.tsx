import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { trainer } from "@/lib/fit-seed";
import { Instagram, Youtube, ArrowUpRight, Sparkles, Trophy, Users, Eye, Edit3 } from "lucide-react";

export const Route = createFileRoute("/admin/fit/portal")({
  head: () => ({ meta: [{ title: "Coach portal - ARCA Fit" }] }),
  component: PortalPage,
});

const portals = [
  {
    id: "mara",
    name: trainer.name,
    handle: trainer.handle,
    headline: "Hypertrophy-first programming. Data-driven, brutally consistent.",
    bio: "10+ years coaching elite physique athletes. CSCS-certified. Built for clients who want measurable change every 14 days.",
    cover: "linear-gradient(135deg, oklch(0.42 0.14 195) 0%, oklch(0.22 0.08 240) 100%)",
    stats: [
      { label: "Followers", value: "184K" },
      { label: "Yrs coaching", value: "10+" },
      { label: "Active members", value: trainer.clients.toString() },
      { label: "Programs", value: "24" },
    ],
    methodology: ["Progressive overload tracking", "Weekly check-in + scan", "Refeed-driven cuts", "RPE-based autoregulation"],
    sample: [
      { day: "Mon", focus: "Push · Hypertrophy", vol: "18 sets" },
      { day: "Tue", focus: "Pull · Strength", vol: "16 sets" },
      { day: "Wed", focus: "Rest · Mobility", vol: "30 min" },
      { day: "Thu", focus: "Legs · Volume", vol: "20 sets" },
      { day: "Fri", focus: "Arms + Delts", vol: "16 sets" },
      { day: "Sat", focus: "Conditioning", vol: "Zone 2 45m" },
      { day: "Sun", focus: "Rest", vol: "-" },
    ],
  },
  {
    id: "ryan",
    name: "Coach Ryan Vega",
    handle: "@vegastrength",
    headline: "Powerbuilding for the everyday athlete.",
    bio: "IFBB Pro background. Built to drive PRs on the big three without sacrificing aesthetics.",
    cover: "linear-gradient(135deg, oklch(0.35 0.16 30) 0%, oklch(0.18 0.06 25) 100%)",
    stats: [
      { label: "Followers", value: "62K" },
      { label: "Yrs coaching", value: "8" },
      { label: "Active members", value: "31" },
      { label: "Programs", value: "12" },
    ],
    methodology: ["Conjugate periodization", "Block deload every 4 wks", "Macro cycling", "Speed work fortnightly"],
    sample: [
      { day: "Mon", focus: "Squat + accessories", vol: "12 sets" },
      { day: "Tue", focus: "Bench + horizontal", vol: "14 sets" },
      { day: "Wed", focus: "Rest", vol: "-" },
      { day: "Thu", focus: "Deadlift + back", vol: "12 sets" },
      { day: "Fri", focus: "OHP + arms", vol: "14 sets" },
      { day: "Sat", focus: "Hypertrophy upper", vol: "18 sets" },
      { day: "Sun", focus: "Rest", vol: "-" },
    ],
  },
];

function PortalPage() {
  const [activeId, setActiveId] = useState(portals[0].id);
  const active = portals.find((p) => p.id === activeId) ?? portals[0];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching · Public surface"
        title="Coach portals"
        description="Public-facing trainer pages. Edit the methodology, sample week, and pricing - share the link to convert leads."
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3 py-1.5 text-xs text-foreground">
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background">
              <Edit3 className="h-3.5 w-3.5" /> Edit portal
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {portals.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
              p.id === activeId
                ? "border-[color:color-mix(in_oklab,var(--teal)_45%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)] text-foreground"
                : "border-[color:var(--glass-stroke)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--glass-stroke-strong)] glass-panel">
        <div className="relative h-56 md:h-64" style={{ background: active.cover }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_color-mix(in_oklab,white_18%,transparent),_transparent_60%)]" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Coach portal</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-white md:text-4xl">{active.name}</h2>
              <p className="mt-1 text-sm text-white/80">{active.handle}</p>
            </div>
            <div className="hidden gap-2 md:flex">
              <a className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur ring-1 ring-white/30"><Instagram className="h-3.5 w-3.5" /> Instagram</a>
              <a className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur ring-1 ring-white/30"><Youtube className="h-3.5 w-3.5" /> YouTube</a>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <p className="text-2xl font-medium leading-snug text-foreground md:text-3xl">{active.headline}</p>
            <p className="max-w-prose text-sm text-muted-foreground">{active.bio}</p>

            <div className="grid grid-cols-4 gap-3">
              {active.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
                  <p className="metric-numeral mt-1 text-2xl text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Methodology</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {active.methodology.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1 rounded-full glass-panel-quiet px-2.5 py-1 text-[11px] text-foreground">
                    <Sparkles className="h-3 w-3 text-[color:var(--teal)]" /> {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
                Train with {active.name.split(" ")[1]} <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-4 py-2 text-xs font-medium text-foreground">
                Book intro call
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Panel title="Sample week">
              <ul className="space-y-1.5">
                {active.sample.map((d) => (
                  <li key={d.day} className="flex items-center justify-between rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] px-3 py-2">
                    <span className="w-10 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{d.day}</span>
                    <span className="flex-1 text-sm font-medium text-foreground">{d.focus}</span>
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{d.vol}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Plans">
              <div className="space-y-2">
                <div className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-foreground">Monthly</p>
                    <p className="metric-numeral text-xl text-foreground">$179<span className="ml-1 text-xs text-muted-foreground">/mo</span></p>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Weekly check-in · custom program · macros</p>
                </div>
                <div className="rounded-lg border border-[color:color-mix(in_oklab,var(--teal)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)] p-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-foreground">Quarterly <span className="ml-1 rounded-full bg-[color:color-mix(in_oklab,var(--teal)_25%,transparent)] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-foreground">save 15%</span></p>
                    <p className="metric-numeral text-xl text-foreground">$459</p>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Everything in Monthly · biweekly scan call · merch drop</p>
                </div>
              </div>
            </Panel>

            <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-[color:var(--data-pos)]" />
                <span>92% of {active.stats[2].value} active members hit their 12-week goal.</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-[color:var(--teal)]" />
                <span>14 leads this week · 4 booked intro calls</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
