import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { Leaderboard } from "@/components/shell/fit/Leaderboard";
import { challenges } from "@/lib/fit-seed-extra";
import { Trophy, Users, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/fit/challenges")({
  head: () => ({ meta: [{ title: "Challenges - ARCA Fit" }] }),
  component: ChallengesPage,
});

function ChallengesPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Engagement"
        title="Group challenges & leaderboards"
        description="Run cohort competitions to drive streaks, PRs, and retention."
        actions={<button className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background">+ New challenge</button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {challenges.map((c, i) => (
          <div
            key={c.id}
            className="glass-panel relative overflow-hidden p-5"
            style={{ animation: `fade-in 0.5s var(--ease-out-quint) both`, animationDelay: `${i * 50}ms` }}
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[color:color-mix(in_oklab,var(--teal)_18%,transparent)]" />
            <Trophy className="relative h-6 w-6 text-[color:var(--teal)]" />
            <p className="relative mt-3 text-sm font-semibold text-foreground">{c.name}</p>
            <p className="relative text-[11px] text-muted-foreground">Prize · {c.prize}</p>
            <div className="relative mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.participants}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.daysLeft}d left</span>
            </div>
            <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--muted)_60%,transparent)]">
              <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: "linear-gradient(90deg, var(--teal), color-mix(in oklab, var(--navy) 70%, var(--teal)))" }} />
            </div>
            <p className="relative mt-1 text-[10px] font-mono tabular-nums text-muted-foreground">{c.progress}% complete</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Leaderboard · this month" className="lg:col-span-2">
          <Leaderboard />
        </Panel>
        <Panel title="Recent PRs">
          <ul className="space-y-2 text-sm">
            {[
              { c: "Diego Romero", lift: "Back Squat", val: "425 lb × 3" },
              { c: "Alex Rivera",  lift: "Bench Press", val: "245 lb × 5" },
              { c: "Sloane Vega",  lift: "Hip Thrust",  val: "315 lb × 8" },
              { c: "Marcus Webb",  lift: "Deadlift",    val: "500 lb × 1" },
              { c: "Imani Brooks", lift: "RDL",         val: "225 lb × 8" },
            ].map((p, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.c}</p>
                  <p className="text-[11px] text-muted-foreground">{p.lift}</p>
                </div>
                <span className="font-mono text-xs tabular-nums text-[color:var(--teal)]">{p.val}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
