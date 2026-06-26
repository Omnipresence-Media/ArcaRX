import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel, BarRow } from "@/components/shell/AnalyticsSubPage";
import { Sparkline } from "@/components/shell/viz/Sparkline";
import { AdherenceHeatmap } from "@/components/shell/fit/AdherenceHeatmap";
import { InterventionQueue } from "@/components/shell/fit/InterventionQueue";
import { HabitHeatmap } from "@/components/shell/fit/HabitHeatmap";
import { WeeklyDigestCard } from "@/components/shell/fit/WeeklyDigestCard";
import { adherenceMatrix, fitClients, programs, trainer, weeklyVolume } from "@/lib/fit-seed";
import { clientRisk } from "@/lib/fit-seed-extra";
import { ArrowUp, Users, TrendingUp, Flame, Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/fit/")({
  head: () => ({ meta: [{ title: "Coaching - ARCA Fit" }] }),
  component: FitOverview,
});

function FitOverview() {
  const onTrack = fitClients.filter((c) => c.status === "On track").length;
  const atRisk  = Object.values(clientRisk).filter((r) => r.level === "At-risk").length;
  const avgAdherence = Math.round(fitClients.reduce((s, c) => s + c.adherence, 0) / fitClients.length);

  const kpis = [
    { label: "Active clients", value: String(fitClients.length), delta: { value: "+3", dir: "up" as const }, spark: [38, 40, 41, 43, 44, 45, 46, 47] },
    { label: "Adherence",      value: `${avgAdherence}%`,        delta: { value: "+4%", dir: "up" as const }, spark: [78, 80, 81, 82, 83, 84, 86, avgAdherence] },
    { label: "On track",       value: String(onTrack),            delta: { value: "+2", dir: "up" as const }, spark: [8, 9, 9, 10, 10, 11, 11, onTrack] },
    { label: "At risk",        value: String(atRisk),             delta: { value: "-1", dir: "down" as const }, spark: [4, 4, 4, 3, 3, 3, 3, atRisk] },
    { label: "Coaching MRR",   value: `$${(trainer.mrr / 1000).toFixed(1)}k`, delta: { value: "+12%", dir: "up" as const }, spark: [13, 14, 14, 15, 16, 17, 18, 19] },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching"
        title="Arca Fit · Overview"
        description={`${trainer.name} · ${trainer.handle} - intelligence, programming, nutrition & business.`}
        actions={<span className="rounded-full glass-panel-quiet px-3 py-1 text-[11px] text-muted-foreground">Updated just now</span>}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className="glass-panel relative overflow-hidden p-4 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5"
            style={{ animation: `fade-in 0.5s var(--ease-out-quint) both`, animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
              <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                k.delta.dir === "up"
                  ? "border-[color:color-mix(in_oklab,var(--data-pos)_30%,transparent)] text-[color:var(--data-pos)]"
                  : "border-[color:color-mix(in_oklab,var(--data-neg)_30%,transparent)] text-[color:var(--data-neg)]"
              }`}>
                <ArrowUp className={`h-3 w-3 ${k.delta.dir === "down" ? "rotate-180" : ""}`} />
                {k.delta.value}
              </span>
            </div>
            <p className="metric-numeral mt-3 text-[34px] text-foreground">{k.value}</p>
            <div className="mt-3 -mx-1">
              <Sparkline data={k.spark} tone={k.delta.dir === "up" ? "pos" : "neg"} height={32} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Intervention queue · ranked by risk" className="lg:col-span-2" actions={
          <span className="text-[11px] text-muted-foreground">Weighted: adherence · check-ins · sentiment · weight stall</span>
        }>
          <InterventionQueue />
        </Panel>
        <Panel title="Top programs by adherence" className="lg:col-span-1">
          <div className="space-y-3">
            {programs.slice(0, 5).map((p) => (
              <BarRow key={p.id} label={p.name} value={p.completion} max={100} suffix="%" />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Client adherence · last 6 weeks" actions={<span className="text-[11px] text-muted-foreground">% of programmed sessions completed</span>}>
        <AdherenceHeatmap rows={adherenceMatrix.slice(0, 10)} />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Roster habit signals · 8 weeks" actions={<span className="text-[11px] text-muted-foreground">Higher = better</span>}>
          <HabitHeatmap />
        </Panel>
        <div className="space-y-5">
          <WeeklyDigestCard client="Alex Rivera" />
          <Panel title="Weekly volume · sessions vs check-ins">
            <div className="grid grid-cols-12 gap-2 items-end h-32">
              {weeklyVolume.map((w) => {
                const sessionsH = (w.sessions / 200) * 100;
                const checksH   = (w.checkIns / 60) * 100;
                return (
                  <div key={w.week} className="flex flex-col items-center gap-1">
                    <div className="flex h-full w-full items-end justify-center gap-0.5">
                      <div className="w-2 rounded-t-sm bg-gradient-to-t from-[color:color-mix(in_oklab,var(--navy)_50%,transparent)] to-[color:var(--teal)]" style={{ height: `${sessionsH}%` }} />
                      <div className="w-2 rounded-t-sm bg-[color:color-mix(in_oklab,var(--data-pos)_70%,transparent)]" style={{ height: `${checksH}%` }} />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{w.week}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Link to="/admin/fit/clients"   className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"><Users className="h-5 w-5 text-[color:var(--teal)]" /><div><p className="text-sm font-medium">Open roster</p><p className="text-[11px] text-muted-foreground">{fitClients.length} active</p></div></Link>
        <Link to="/admin/fit/workouts/builder"  className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"><TrendingUp className="h-5 w-5 text-[color:var(--teal)]" /><div><p className="text-sm font-medium">Program builder</p><p className="text-[11px] text-muted-foreground">Periodized + deload</p></div></Link>
        <Link to="/admin/fit/reviews"   className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"><Flame className="h-5 w-5 text-[color:var(--teal)]" /><div><p className="text-sm font-medium">Form reviews</p><p className="text-[11px] text-muted-foreground">2 pending</p></div></Link>
        <Link to="/admin/fit/business"  className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"><Calendar className="h-5 w-5 text-[color:var(--teal)]" /><div><p className="text-sm font-medium">Business ops</p><p className="text-[11px] text-muted-foreground">MRR · leads · billing</p></div></Link>
      </div>
    </div>
  );
}
