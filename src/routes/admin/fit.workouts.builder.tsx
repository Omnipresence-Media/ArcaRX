import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { VolumeHeatmap } from "@/components/shell/fit/VolumeHeatmap";
import { OneRMChart } from "@/components/shell/fit/OneRMChart";
import { sampleWeek } from "@/lib/fit-seed";
import { exerciseLibrary, exerciseSubstitutions } from "@/lib/fit-seed-extra";
import {
  Plus, GripVertical, Repeat, Save, X, Undo2, Redo2, Play, ChevronDown,
  Search, Dumbbell, Activity, AlertTriangle, Timer, Layers
} from "lucide-react";

export const Route = createFileRoute("/admin/fit/workouts/builder")({
  head: () => ({ meta: [{ title: "Program builder — ARCA Fit" }] }),
  component: BuilderPage,
});

const MUSCLE_CHIPS = ["All", "Chest", "Back", "Quads", "Hamstrings", "Glutes", "Shoulders", "Arms"];

function BuilderPage() {
  const [deload, setDeload] = useState(true);
  const [swapFor, setSwapFor] = useState<string | null>(null);
  const [selectedEx, setSelectedEx] = useState<string | null>("Barbell Bench Press");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [libQ, setLibQ] = useState("");
  const [activeWeek, setActiveWeek] = useState(0);
  const subs = swapFor ? exerciseSubstitutions[swapFor] ?? [] : [];

  const filteredLib = useMemo(
    () =>
      exerciseLibrary.filter(
        (e) =>
          (muscleFilter === "All" || e.muscle === muscleFilter) &&
          (libQ === "" || e.name.toLowerCase().includes(libQ.toLowerCase()))
      ),
    [muscleFilter, libQ]
  );

  const activeSessions = sampleWeek.filter((d) => d.exercises.length > 0);
  const totalSets = activeSessions.reduce((s, d) => s + d.exercises.reduce((a, e) => a + e.sets, 0), 0);
  const estMins = activeSessions.length * 62;

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
          defaultValue="Cut Phase · 12wk"
          className="min-w-0 max-w-[260px] flex-1 bg-transparent text-sm font-semibold text-foreground outline-none focus:ring-0"
        />
        <button className="inline-flex items-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
          Mesocycle A <ChevronDown className="h-3 w-3" />
        </button>
        <span className="rounded-full bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] px-2 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
          v3 · autosaved 2m ago
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] hover:text-foreground"><Undo2 className="h-4 w-4" /></button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] hover:text-foreground"><Redo2 className="h-4 w-4" /></button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1 text-[11px]">
            <input type="checkbox" checked={deload} onChange={(e) => setDeload(e.target.checked)} className="h-3 w-3 accent-[color:var(--teal)]" />
            Auto-deload
          </label>
          <button className="inline-flex items-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1 text-[11px] text-foreground">
            <Play className="h-3 w-3" /> Preview
          </button>
          <button className="inline-flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background">
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
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto p-2">
            {filteredLib.map((ex) => (
              <li
                key={ex.id}
                draggable
                onClick={() => setSelectedEx(ex.name)}
                className={`group mb-1 flex cursor-grab items-center gap-2 rounded-md border px-2 py-1.5 text-[12px] active:cursor-grabbing ${
                  selectedEx === ex.name
                    ? "border-[color:color-mix(in_oklab,var(--teal)_45%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_10%,transparent)]"
                    : "border-transparent hover:border-[color:var(--glass-stroke)] hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_45%,transparent)]"
                }`}
              >
                <Dumbbell className="h-3 w-3 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{ex.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{ex.muscle} · {ex.equipment}</p>
                </div>
                <GripVertical className="h-3 w-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100" />
              </li>
            ))}
          </ul>
        </aside>

        {/* CENTER CANVAS */}
        <section className="min-h-0 overflow-y-auto">
          {/* Mesocycle strip */}
          <div className="border-b border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--background)_60%,transparent)] px-5 py-3">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mesocycle · 8 weeks</p>
              <span className="text-[10px] text-muted-foreground">Click a week to edit · drag to reorder</span>
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }, (_, i) => {
                const isDeload = deload && (i === 3 || i === 7);
                const active = i === activeWeek;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveWeek(i)}
                    className={`rounded-md border p-2 text-left transition-colors ${
                      active
                        ? "border-[color:var(--teal)] bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)]"
                        : isDeload
                        ? "border-[color:color-mix(in_oklab,var(--teal)_30%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_5%,transparent)]"
                        : "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_40%,transparent)] hover:border-[color:var(--glass-stroke-strong)]"
                    }`}
                  >
                    <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Week</p>
                    <p className="metric-numeral text-base text-foreground">{i + 1}</p>
                    <p className="text-[9px] text-muted-foreground">{isDeload ? "Deload" : `${100 + i * 5}% vol`}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sessions */}
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Week {activeWeek + 1} · sessions
              </h3>
              <button className="inline-flex items-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
                <Plus className="h-3 w-3" /> Add session
              </button>
            </div>

            {activeSessions.map((day) => {
              const setsTotal = day.exercises.reduce((a, e) => a + e.sets, 0);
              const avgRPE = (day.exercises.reduce((a, e) => a + e.rpe, 0) / day.exercises.length).toFixed(1);
              return (
                <div
                  key={day.day}
                  className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--background)_75%,transparent)] backdrop-blur"
                >
                  <div className="flex items-center justify-between border-b border-[color:var(--glass-stroke)] px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                        {day.day}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground">{day.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" />{setsTotal} sets</span>
                      <span className="inline-flex items-center gap-1"><Timer className="h-3 w-3" />~62 min</span>
                      <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" />RPE {avgRPE}</span>
                    </div>
                  </div>
                  <ul>
                    {day.exercises.map((ex) => {
                      const pct1RM = 65 + (ex.rpe - 6) * 8;
                      const isSel = selectedEx === ex.name;
                      return (
                        <li
                          key={ex.id}
                          onClick={() => setSelectedEx(ex.name)}
                          className={`flex cursor-pointer items-center gap-3 border-b border-[color:var(--glass-stroke)] px-3 py-2 text-[13px] last:border-b-0 ${
                            isSel ? "bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)]" : "hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_40%,transparent)]"
                          }`}
                        >
                          <GripVertical className="h-3 w-3 cursor-grab text-muted-foreground/60" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-foreground">{ex.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{ex.muscle} · {ex.equipment} · rest {ex.rest}</p>
                          </div>
                          <span className="font-mono text-[11px] tabular-nums text-foreground/90">{ex.sets}×{ex.reps}</span>
                          <span className="font-mono text-[11px] tabular-nums text-[color:var(--teal)]">{pct1RM}%</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSwapFor(ex.name); }}
                            className="rounded p-1 text-muted-foreground hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] hover:text-foreground"
                            title="Swap"
                          >
                            <Repeat className="h-3 w-3" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT RAIL · Inspector */}
        <aside className="min-h-0 overflow-y-auto border-l border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)]">
          {selectedEx ? (
            <div className="space-y-4 p-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Inspector</p>
                <h4 className="mt-1 text-base font-semibold text-foreground">{selectedEx}</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: "Sets", v: "4" },
                  { l: "Reps", v: "6-8" },
                  { l: "RPE", v: "8" },
                  { l: "%1RM", v: "82%" },
                  { l: "Tempo", v: "3-0-1" },
                  { l: "Rest", v: "2:30" },
                ].map((f) => (
                  <label key={f.l} className="block">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{f.l}</span>
                    <input
                      defaultValue={f.v}
                      className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-[12px] tabular-nums text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                    />
                  </label>
                ))}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Coach notes</p>
                <textarea
                  rows={3}
                  defaultValue="Keep elbows tucked ~45°. Pause 1s on chest, drive through mid-foot."
                  className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1.5 text-[12px] text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                />
              </div>
              <div className="rounded-md border border-[color:var(--glass-stroke)] p-2">
                <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">1RM trend · key lifts</p>
                <OneRMChart />
              </div>
              <button
                onClick={() => setSwapFor(selectedEx)}
                className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-[color:var(--glass-stroke)] px-2 py-1.5 text-[11px] text-foreground"
              >
                <Repeat className="h-3 w-3" /> Find substitutes
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-4">
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
          <span><span className="text-foreground/80">{activeSessions.length}</span> sessions/wk</span>
          <span><span className="text-foreground/80">{totalSets}</span> total sets</span>
          <span>~<span className="text-foreground/80">{estMins}</span> min/session</span>
          <span className="text-[color:var(--teal)]">+5% vol vs last meso</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-amber-400/90"><AlertTriangle className="h-3 w-3" /> 1 conflict · OHP twice in 36h</span>
          <span>Saved 2m ago</span>
        </div>
      </footer>

      {/* Substitution modal */}
      {swapFor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm p-4" onClick={() => setSwapFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="glass-panel w-full max-w-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Substitute</p>
                <h4 className="text-base font-semibold text-foreground">{swapFor}</h4>
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
                  <button className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-background">Use</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
