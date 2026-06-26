import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Sparkline } from "@/components/shell/viz/Sparkline";
import { fitClients, type Goal, type Status } from "@/lib/fit-seed";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/fit/clients/")({
  head: () => ({ meta: [{ title: "Clients - ARCA Fit" }] }),
  component: ClientsPage,
});

const GOALS: ("All" | Goal)[] = ["All", "Cut", "Recomp", "Bulk", "Perform"];

function statusTone(s: Status) {
  if (s === "On track") return "bg-[color:color-mix(in_oklab,var(--data-pos)_20%,transparent)] text-[color:var(--data-pos)]";
  if (s === "At risk")  return "bg-[color:color-mix(in_oklab,#e0a83a_22%,transparent)] text-[#caa14a]";
  if (s === "Stalled")  return "bg-[color:color-mix(in_oklab,var(--data-neg)_22%,transparent)] text-[color:var(--data-neg)]";
  return "bg-[color:color-mix(in_oklab,var(--teal)_22%,transparent)] text-[color:var(--teal)]";
}

function ClientsPage() {
  const [q, setQ] = useState("");
  const [goal, setGoal] = useState<(typeof GOALS)[number]>("All");

  const filtered = fitClients.filter((c) => {
    if (goal !== "All" && c.goal !== goal) return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching"
        title="Clients"
        description={`${fitClients.length} active clients across goals, programs, and stages.`}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name…"
            className="h-10 w-full rounded-full glass-panel-quiet pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-[color:var(--teal)]"
          />
        </div>
        <div className="inline-flex items-center gap-1 rounded-full glass-panel-quiet p-1">
          {GOALS.map((g) => {
            const active = g === goal;
            return (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--glass-stroke)] text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="py-3 px-4 font-semibold">Client</th>
              <th className="py-3 px-4 font-semibold">Goal</th>
              <th className="py-3 px-4 font-semibold">Program</th>
              <th className="py-3 px-4 font-semibold text-right">Weight</th>
              <th className="py-3 px-4 font-semibold">Trend</th>
              <th className="py-3 px-4 font-semibold text-right">Adherence</th>
              <th className="py-3 px-4 font-semibold">Last check-in</th>
              <th className="py-3 px-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const delta = c.currentWeight - c.startWeight;
              const deltaStr = `${delta > 0 ? "+" : ""}${delta.toFixed(1)} lb`;
              return (
                <tr
                  key={c.id}
                  className="border-b border-[color:var(--glass-stroke)] transition-colors last:border-0 hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]"
                >
                  <td className="py-3 px-4">
                    <Link to="/admin/fit/clients/$id" params={{ id: c.id }} className="flex items-center gap-2.5 hover:text-[color:var(--teal)]">
                      <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-[color:var(--glass-stroke-strong)]" />
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.city} · wk {c.startedWeeksAgo}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-xs text-foreground/90">{c.goal}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{c.program}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    <span className="text-foreground">{c.currentWeight}</span>
                    <span className={`ml-1.5 text-[10px] ${delta < 0 ? "text-[color:var(--data-pos)]" : delta > 0 ? "text-foreground/70" : "text-muted-foreground"}`}>{deltaStr}</span>
                  </td>
                  <td className="py-3 px-4 w-32">
                    <div className="h-8 w-28">
                      <Sparkline data={c.weightTrend} tone={delta < 0 ? "pos" : delta > 0 ? "neutral" : "neutral"} height={32} />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-foreground">{c.adherence}%</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{c.lastCheckIn}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusTone(c.status)}`}>{c.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
