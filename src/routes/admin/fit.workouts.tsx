import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { programs as seedPrograms } from "@/lib/fit-seed";
import { programAssignments } from "@/lib/fit-seed-extra";
import { usePrograms, createProgram } from "@/features/coaching/builderStore";
import { useGoToast } from "@/lib/coachToast";
import { Search, Users, BarChart2, Sparkles, ArrowUpRight, Copy, UserPlus, X } from "lucide-react";

export const Route = createFileRoute("/admin/fit/workouts")({
  head: () => ({ meta: [{ title: "Program library - ARCA Fit" }] }),
  component: WorkoutsLibraryPage,
});

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
const TABS = ["Library", "Assignments"] as const;

const COVERS: Record<string, string> = {
  p1: "linear-gradient(135deg,#0e2a3a 0%,#1a6470 60%,#42c4b6 100%)",
  p2: "linear-gradient(135deg,#2a1633 0%,#5d2a8a 55%,#c267e8 100%)",
  p3: "linear-gradient(135deg,#1a2a14 0%,#3a6a2a 55%,#a4d65e 100%)",
  p4: "linear-gradient(135deg,#3a1a0e 0%,#8a3a1a 55%,#f08a3a 100%)",
  p5: "linear-gradient(135deg,#3a0e2a 0%,#8a1a55 55%,#f06aa0 100%)",
  p6: "linear-gradient(135deg,#0e1a3a 0%,#2a3a8a 55%,#5e7af0 100%)",
};

function WorkoutsLibraryPage() {
  const go = useGoToast();
  const navigate = useNavigate();
  const storePrograms = usePrograms();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Library");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const [q, setQ] = useState("");
  const [drawerId, setDrawerId] = useState<string | null>(null);

  // Live programs from the builder store, enriched with seed stats when known.
  const programs = useMemo(() => {
    const statById = new Map(seedPrograms.map((p) => [p.id, p]));
    return storePrograms.map((p) => ({
      ...p,
      assignedTo: statById.get(p.id)?.assignedTo ?? 0,
      completion: statById.get(p.id)?.completion ?? 0,
    }));
  }, [storePrograms]);

  const filtered = useMemo(
    () =>
      programs.filter(
        (p) =>
          (level === "All" || p.level === level) &&
          (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.focus.toLowerCase().includes(q.toLowerCase()))
      ),
    [programs, level, q]
  );

  const totalAssigned = programs.reduce((s, p) => s + p.assignedTo, 0);
  const avgCompletion = Math.round(programs.reduce((s, p) => s + p.completion, 0) / programs.length) || 0;
  const topProgram = [...programs].sort((a, b) => b.assignedTo - a.assignedTo)[0];

  const drawer = drawerId ? programs.find((p) => p.id === drawerId) : null;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Library"
        title="Program library"
        description="Browse, assign, and govern programs. Open any program to edit it in the builder."
        actions={
          <>
            <button
              onClick={() => {
                const id = createProgram(storePrograms[0]?.id);
                navigate({ to: "/admin/fit/workouts/builder", search: { program: id } });
              }}
              className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3 py-1.5 text-[11px] text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" /> New from template
            </button>
            <Link
              to="/admin/fit/workouts/builder"
              search={{ program: storePrograms[0]?.id }}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
            >
              Open builder <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Programs", value: programs.length, sub: `${LEVELS.length - 1} levels` },
          { label: "Active assignments", value: totalAssigned, sub: "across roster" },
          { label: "Avg completion", value: `${avgCompletion}%`, sub: "of all programs" },
          { label: "Most assigned", value: topProgram.name, sub: `${topProgram.assignedTo} clients` },
        ].map((k) => (
          <div key={k.label} className="glass-panel p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
            <p className="metric-numeral mt-1 text-2xl text-foreground truncate">{k.value}</p>
            <p className="text-[11px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full glass-panel-quiet p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Library" && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search programs"
                className="w-56 rounded-full border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
              />
            </div>
            <div className="inline-flex items-center gap-1 rounded-full glass-panel-quiet p-1">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-full px-2.5 py-1 text-[11px] ${
                    level === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {tab === "Library" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setDrawerId(p.id)}
              className="group glass-panel overflow-hidden text-left transition-transform hover:-translate-y-0.5"
            >
              <div
                className="relative h-28 w-full"
                style={{ backgroundImage: COVERS[p.id] ?? COVERS.p1, backgroundSize: "cover" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.25),transparent_60%)]" />
                <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                  {p.level}
                </span>
                <span className="absolute right-3 top-3 font-mono text-[11px] tabular-nums text-white/90">
                  {p.weeks}w · {p.daysPerWeek}d/wk
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{p.focus}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{p.assignedTo} assigned</span>
                  <span className="inline-flex items-center gap-1"><BarChart2 className="h-3 w-3" />{p.completion}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--surface-glass)_70%,transparent)]">
                  <div
                    className="h-full rounded-full bg-[color:var(--teal)]"
                    style={{ width: `${p.completion}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">Week</th>
                <th className="px-4 py-3 font-medium">Adherence</th>
                <th className="px-4 py-3 font-medium">Next session</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--glass-stroke)]">
              {programAssignments.map((a) => (
                <tr key={a.id} className="hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_45%,transparent)]">
                  <td className="px-4 py-3 font-medium text-foreground">{a.client}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.program}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-foreground/90">
                    {a.week}<span className="text-muted-foreground">/{a.total}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-20 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--surface-glass)_70%,transparent)]">
                        <div
                          className={`h-full ${a.adherence >= 85 ? "bg-[color:var(--teal)]" : a.adherence >= 70 ? "bg-amber-400" : "bg-rose-400"}`}
                          style={{ width: `${a.adherence}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-foreground/80">{a.adherence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.next}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/admin/fit/workouts/builder"
                      className="text-[11px] text-[color:var(--teal)] hover:opacity-80"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer */}
      {drawer && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm"
          onClick={() => setDrawerId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel h-full w-full max-w-md overflow-y-auto rounded-none p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{drawer.level}</p>
                <h3 className="metric-numeral text-2xl text-foreground">{drawer.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{drawer.focus}</p>
              </div>
              <button onClick={() => setDrawerId(null)} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Weeks", v: drawer.weeks },
                { l: "Days/wk", v: drawer.daysPerWeek },
                { l: "Assigned", v: drawer.assignedTo },
              ].map((s) => (
                <div key={s.l} className="glass-panel-quiet rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{s.l}</p>
                  <p className="metric-numeral mt-1 text-xl text-foreground">{s.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Split sample</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Push", "Pull", "Legs", "Upper", "Lower", "Conditioning"].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button onClick={() => go(`Assign "${drawer?.name}"`, { description: "Pick which clients get this program.", to: "/admin/fit/clients", label: "Choose clients" })} className="inline-flex items-center justify-center gap-1.5 rounded-full glass-panel-quiet px-3 py-2 text-xs text-foreground">
                <UserPlus className="h-3.5 w-3.5" /> Assign
              </button>
              <button
                onClick={() => {
                  if (!drawer) return;
                  const id = createProgram(drawer.id);
                  toast.success("Program duplicated", {
                    description: `"${drawer.name} (copy)" was created.`,
                    action: { label: "Edit copy", onClick: () => navigate({ to: "/admin/fit/workouts/builder", search: { program: id } }) },
                  });
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-full glass-panel-quiet px-3 py-2 text-xs text-foreground"
              >
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </button>
              <Link
                to="/admin/fit/workouts/builder"
                search={{ program: drawer.id }}
                className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background"
              >
                Open in builder <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
