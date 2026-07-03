import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useGoToast } from "@/lib/coachToast";
import { VolumeHeatmap } from "@/components/shell/fit/VolumeHeatmap";
import { OneRMChart } from "@/components/shell/fit/OneRMChart";
import { exerciseLibrary, exerciseSubstitutions } from "@/lib/fit-seed-extra";
import {
  useProgram, usePrograms, renameProgram, addSession, removeSession, renameSession,
  addExercise, updateExercise, removeExercise, createProgram,
  type BuilderExercise,
} from "@/features/coaching/builderStore";
import {
  Plus, Repeat, Save, X, Play, ChevronDown,
  Search, Dumbbell, Activity, Timer, Layers, Trash2, CirclePlus,
} from "lucide-react";

export const Route = createFileRoute("/admin/fit/workouts/builder")({
  validateSearch: (s: Record<string, unknown>): { program?: string } => ({
    program: typeof s.program === "string" ? s.program : undefined,
  }),
  head: () => ({ meta: [{ title: "Program builder - ARCA Fit" }] }),
  component: BuilderPage,
});

const MUSCLE_CHIPS = ["All", "Chest", "Back", "Quads", "Hamstrings", "Glutes", "Shoulders", "Arms"];

function BuilderPage() {
  const go = useGoToast();
  const { program: programParam } = Route.useSearch();
  const navigate = Route.useNavigate();
  const programs = usePrograms();
  const program = useProgram(programParam);

  const [sel, setSel] = useState<{ dayId: string; exId: string } | null>(null);
  const [swapFor, setSwapFor] = useState<{ dayId: string; ex: BuilderExercise } | null>(null);
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [libQ, setLibQ] = useState("");
  const [targetDayId, setTargetDayId] = useState<string | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const filteredLib = useMemo(
    () =>
      exerciseLibrary.filter(
        (e) =>
          (muscleFilter === "All" || e.muscle === muscleFilter) &&
          (libQ === "" || e.name.toLowerCase().includes(libQ.toLowerCase()))
      ),
    [muscleFilter, libQ]
  );

  if (!program) return null;

  const subs = swapFor ? exerciseSubstitutions[swapFor.ex.name] ?? [] : [];
  const selected = sel
    ? program.days.find((d) => d.id === sel.dayId)?.exercises.find((e) => e.id === sel.exId) ?? null
    : null;

  const trainingDays = program.days.filter((d) => d.exercises.length > 0 || d.title !== "Rest · Active Recovery");
  const totalSets = program.days.reduce((s, d) => s + d.exercises.reduce((a, e) => a + e.sets, 0), 0);
  const sessionsCount = program.days.filter((d) => d.exercises.length > 0).length;
  const addTarget = program.days.find((d) => d.id === targetDayId) ?? program.days[0];

  function patchSelected(patch: Partial<BuilderExercise>) {
    if (!sel) return;
    updateExercise(program!.id, sel.dayId, sel.exId, patch);
  }

  return (
    <div
      className="relative flex h-[calc(100vh-64px)] flex-col bg-[color:color-mix(in_oklab,var(--background)_92%,black)]"
      style={{
        backgroundImage:
          "linear-gradient(color-mix(in oklab,var(--glass-stroke) 70%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in oklab,var(--glass-stroke) 70%,transparent) 1px,transparent 1px)",
        backgroundSize: "32px 32px",
        backgroundPosition: "-1px -1px",
      }}
    >
      {/* TOOLBAR */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--background)_82%,transparent)] px-5 py-2.5 backdrop-blur">
        <span className="rounded-full bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">
          Editor
        </span>
        <input
          value={program.name}
          onChange={(e) => renameProgram(program.id, e.target.value)}
          className="min-w-0 max-w-[260px] flex-1 bg-transparent text-sm font-semibold text-foreground outline-none focus:ring-0"
          aria-label="Program name"
        />
        {/* Program switcher */}
        <div className="relative">
          <button onClick={() => setSwitcherOpen((v) => !v)} className="inline-flex items-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
            Switch program <ChevronDown className="h-3 w-3" />
          </button>
          {switcherOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-md border border-[color:var(--glass-stroke-strong)] bg-background p-1 shadow-xl">
              {programs.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSwitcherOpen(false); setSel(null); navigate({ search: { program: p.id } }); }}
                  className={`block w-full rounded px-2 py-1.5 text-left text-[12px] ${p.id === program.id ? "bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)] font-semibold text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {p.name}
                </button>
              ))}
              <button
                onClick={() => { setSwitcherOpen(false); const id = createProgram(); navigate({ search: { program: id } }); toast.success("New program created"); }}
                className="mt-1 block w-full rounded border-t border-[color:var(--glass-stroke)] px-2 py-1.5 text-left text-[12px] font-semibold text-[color:var(--teal)]"
              >
                + New blank program
              </button>
            </div>
          )}
        </div>
        <span className="rounded-full bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] px-2 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
          autosaves on every edit
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <Link
            to="/coaching/$id"
            params={{ id: "c1" }}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1 text-[11px] text-foreground"
          >
            <Play className="h-3 w-3" /> Preview as client
          </Link>
          <button onClick={() => go("Program published", { description: `"${program.name}" is saved and ready to assign.`, to: "/admin/fit/workouts", label: "Go to library" })} className="inline-flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background">
            <Save className="h-3 w-3" /> Publish
          </button>
        </div>
      </header>

      {/* 3-COL SHELL */}
      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)_320px]">
        {/* LEFT RAIL · Exercise library */}
        <aside className="flex min-h-0 flex-col border-r border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)]">
          <div className="border-b border-[color:var(--glass-stroke)] p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Exercise library</p>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input
                value={libQ}
                onChange={(e) => setLibQ(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent py-1.5 pl-7 pr-2 text-[12px] text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {MUSCLE_CHIPS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMuscleFilter(m)}
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    muscleFilter === m
                      ? "bg-foreground text-background"
                      : "border border-[color:var(--glass-stroke)] text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {/* Add-to-day target */}
            <label className="mt-2 block">
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Adding to</span>
              <select
                value={addTarget?.id ?? ""}
                onChange={(e) => setTargetDayId(e.target.value)}
                className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 text-[11px] text-foreground outline-none"
              >
                {program.days.map((d) => (
                  <option key={d.id} value={d.id}>{d.day} · {d.title}</option>
                ))}
              </select>
            </label>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto p-2">
            {filteredLib.map((ex) => (
              <li key={ex.id} className="group mb-1 flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-[12px] hover:border-[color:var(--glass-stroke)] hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_45%,transparent)]">
                <Dumbbell className="h-3 w-3 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{ex.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{ex.muscle} · {ex.equipment}</p>
                </div>
                <button
                  onClick={() => {
                    if (!addTarget) return;
                    addExercise(program.id, addTarget.id, { name: ex.name, muscle: ex.muscle, equipment: ex.equipment });
                    toast.success(`${ex.name} added`, { description: `→ ${addTarget.day} · ${addTarget.title}` });
                  }}
                  aria-label={`Add ${ex.name}`}
                  className="rounded p-1 text-[color:var(--teal)] opacity-0 transition-opacity hover:bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] group-hover:opacity-100"
                >
                  <CirclePlus className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* CENTER CANVAS · Sessions */}
        <section className="min-h-0 overflow-y-auto">
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Sessions · {program.name}</h3>
                <p className="text-[11px] text-muted-foreground">{program.weeks} weeks · {sessionsCount} training days/wk · click an exercise to edit it in the inspector</p>
              </div>
              <button
                onClick={() => { addSession(program.id); toast.success("Session added"); }}
                className="inline-flex items-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3" /> Add session
              </button>
            </div>

            {program.days.map((day) => {
              const setsTotal = day.exercises.reduce((a, e) => a + e.sets, 0);
              const avgRPE = day.exercises.length ? (day.exercises.reduce((a, e) => a + e.rpe, 0) / day.exercises.length).toFixed(1) : "-";
              return (
                <div key={day.id} className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--background)_75%,transparent)] backdrop-blur">
                  <div className="flex items-center justify-between border-b border-[color:var(--glass-stroke)] px-3 py-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="rounded-md bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                        {day.day}
                      </span>
                      <input
                        value={day.title}
                        onChange={(e) => renameSession(program.id, day.id, e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none"
                        aria-label={`${day.day} session title`}
                      />
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" />{setsTotal} sets</span>
                      <span className="inline-flex items-center gap-1"><Timer className="h-3 w-3" />~{Math.max(20, day.exercises.length * 12)} min</span>
                      <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" />RPE {avgRPE}</span>
                      <button
                        onClick={() => { removeSession(program.id, day.id); toast(`${day.day} removed`); }}
                        aria-label={`Remove ${day.day}`}
                        className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {day.exercises.length === 0 ? (
                    <p className="px-3 py-3 text-center text-[11px] text-muted-foreground">
                      Rest day — or add exercises from the library (set "Adding to" on the left to {day.day}).
                    </p>
                  ) : (
                    <ul>
                      {day.exercises.map((ex) => {
                        const isSel = sel?.exId === ex.id;
                        return (
                          <li
                            key={ex.id}
                            onClick={() => setSel({ dayId: day.id, exId: ex.id })}
                            className={`flex cursor-pointer items-center gap-3 border-b border-[color:var(--glass-stroke)] px-3 py-2 text-[13px] last:border-b-0 ${
                              isSel ? "bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)]" : "hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_40%,transparent)]"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-foreground">{ex.name}</p>
                              <p className="truncate text-[10px] text-muted-foreground">{ex.muscle} · {ex.equipment} · rest {ex.rest}</p>
                            </div>
                            <span className="font-mono text-[11px] tabular-nums text-foreground/90">{ex.sets}×{ex.reps}</span>
                            <span className="font-mono text-[11px] tabular-nums text-[color:var(--teal)]">RPE {ex.rpe}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSwapFor({ dayId: day.id, ex }); }}
                              className="rounded p-1 text-muted-foreground hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] hover:text-foreground"
                              title="Swap"
                            >
                              <Repeat className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeExercise(program.id, day.id, ex.id); if (isSel) setSel(null); }}
                              className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                              title="Remove"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT RAIL · Inspector */}
        <aside className="min-h-0 overflow-y-auto border-l border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)]">
          {selected && sel ? (
            <div className="space-y-4 p-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Inspector</p>
                <h4 className="mt-1 text-base font-semibold text-foreground">{selected.name}</h4>
                <p className="text-[11px] text-muted-foreground">{selected.muscle} · {selected.equipment}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Sets</span>
                  <input
                    type="number" min={1} max={10}
                    value={selected.sets}
                    onChange={(e) => patchSelected({ sets: Math.max(1, Number(e.target.value) || 1) })}
                    className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-[12px] tabular-nums text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Reps</span>
                  <input
                    value={selected.reps}
                    onChange={(e) => patchSelected({ reps: e.target.value })}
                    className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-[12px] tabular-nums text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">RPE</span>
                  <input
                    type="number" min={5} max={10}
                    value={selected.rpe}
                    onChange={(e) => patchSelected({ rpe: Math.min(10, Math.max(5, Number(e.target.value) || 8)) })}
                    className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-[12px] tabular-nums text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Rest</span>
                  <input
                    value={selected.rest}
                    onChange={(e) => patchSelected({ rest: e.target.value })}
                    className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-[12px] tabular-nums text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                  />
                </label>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Coach notes (the client sees these)</p>
                <textarea
                  rows={3}
                  value={selected.notes ?? ""}
                  onChange={(e) => patchSelected({ notes: e.target.value })}
                  placeholder="Cues, tempo, setup…"
                  className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1.5 text-[12px] text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                />
              </div>
              <button
                onClick={() => setSwapFor({ dayId: sel.dayId, ex: selected })}
                className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1.5 text-[11px] text-foreground"
              >
                <Repeat className="h-3 w-3" /> Find substitutes
              </button>
              <div className="rounded-md border border-[color:var(--glass-stroke)] p-2">
                <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">1RM trend · key lifts</p>
                <OneRMChart />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <p className="text-[11px] text-muted-foreground">Click any exercise in a session to edit its sets, reps, RPE, rest, and coach notes here.</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Volume heatmap</p>
              <VolumeHeatmap />
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">1RM history</p>
              <OneRMChart />
            </div>
          )}
        </aside>
      </div>

      {/* STATUS BAR */}
      <footer className="flex items-center justify-between gap-4 border-t border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--background)_85%,transparent)] px-5 py-1.5 font-mono text-[10px] tabular-nums text-muted-foreground backdrop-blur">
        <div className="flex items-center gap-4">
          <span><span className="text-foreground/80">{sessionsCount}</span> sessions/wk</span>
          <span><span className="text-foreground/80">{totalSets}</span> total sets</span>
          <span><span className="text-foreground/80">{program.days.length}</span> days configured</span>
        </div>
        <span className="text-[color:var(--teal)]">All changes saved</span>
      </footer>

      {/* Substitution modal */}
      {swapFor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm p-4" onClick={() => setSwapFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="glass-panel w-full max-w-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Substitute</p>
                <h4 className="text-base font-semibold text-foreground">{swapFor.ex.name}</h4>
              </div>
              <button onClick={() => setSwapFor(null)} className="rounded-full p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <ul className="mt-3 space-y-2">
              {subs.length === 0 && <li className="text-sm text-muted-foreground">No suggestions seeded for this lift.</li>}
              {subs.map((s) => (
                <li key={s.name} className="flex items-center gap-3 rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">{s.equipment} · {s.reason}</p>
                  </div>
                  <button
                    onClick={() => {
                      updateExercise(program.id, swapFor.dayId, swapFor.ex.id, { name: s.name, equipment: s.equipment });
                      toast.success(`Swapped in ${s.name}`);
                      setSwapFor(null);
                    }}
                    className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-background"
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
