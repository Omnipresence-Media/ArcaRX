import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { fitClients } from "@/lib/fit-seed";
import { Play, Pause, SkipForward, Check, Timer, Radio, Zap } from "lucide-react";

export const Route = createFileRoute("/admin/fit/live")({
  head: () => ({ meta: [{ title: "Live workout - ARCA Fit" }] }),
  component: LivePage,
});

type SetLog = { weight: number; reps: number; rpe: number; done: boolean };
type Exercise = { name: string; target: string; rest: number; sets: SetLog[] };

const initialSession: { client: typeof fitClients[number]; program: string; exercises: Exercise[] } = {
  client: fitClients[0],
  program: "Cut Phase 12wk · Day 3 / Push",
  exercises: [
    { name: "Incline DB Press", target: "4 × 8 @ RPE 8", rest: 120, sets: [
      { weight: 65, reps: 8, rpe: 7, done: true },
      { weight: 70, reps: 8, rpe: 8, done: true },
      { weight: 70, reps: 7, rpe: 9, done: false },
      { weight: 70, reps: 0, rpe: 0, done: false },
    ]},
    { name: "Cable Fly", target: "3 × 12 @ RPE 8", rest: 75, sets: [
      { weight: 30, reps: 12, rpe: 7, done: false },
      { weight: 30, reps: 0, rpe: 0, done: false },
      { weight: 30, reps: 0, rpe: 0, done: false },
    ]},
    { name: "OHP", target: "3 × 6 @ RPE 8", rest: 150, sets: [
      { weight: 105, reps: 0, rpe: 0, done: false },
      { weight: 105, reps: 0, rpe: 0, done: false },
      { weight: 105, reps: 0, rpe: 0, done: false },
    ]},
    { name: "Tricep Pushdown", target: "3 × 12 @ RPE 9", rest: 60, sets: [
      { weight: 50, reps: 0, rpe: 0, done: false },
      { weight: 50, reps: 0, rpe: 0, done: false },
      { weight: 50, reps: 0, rpe: 0, done: false },
    ]},
  ],
};

const liveCues = [
  { t: "00:42", text: "Heart-rate above 142 bpm - within zone 3", tone: "pos" as const },
  { t: "01:18", text: "Bar speed dropped 12% - RPE flagged 8.5", tone: "neutral" as const },
  { t: "02:04", text: "Form check: elbows flaring on rep 6", tone: "neg" as const },
  { t: "02:36", text: "Rest interval suggestion: extend to 150s", tone: "neutral" as const },
];

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(1, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function LivePage() {
  const [session, setSession] = useState(initialSession);
  const [activeIdx, setActiveIdx] = useState(0);
  const [rest, setRest] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || rest <= 0) return;
    const t = setInterval(() => setRest((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [running, rest]);

  const active = session.exercises[activeIdx];
  const completedSets = session.exercises.flatMap((e) => e.sets).filter((s) => s.done).length;
  const totalSets = session.exercises.flatMap((e) => e.sets).length;
  const totalVolume = session.exercises
    .flatMap((e) => e.sets.filter((s) => s.done).map((s) => s.weight * s.reps))
    .reduce((a, b) => a + b, 0);

  function logSet(setIdx: number) {
    setSession((s) => {
      const next = structuredClone(s);
      next.exercises[activeIdx].sets[setIdx].done = true;
      return next;
    });
    setRest(active.rest);
    setRunning(true);
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching · Live"
        title="Live workout session"
        description="Real-time tracking of the active client's session - sets logged, rest timers, and AI form cues piped from the wearable."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:color-mix(in_oklab,var(--data-pos)_15%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--data-pos)]">
            <Radio className="h-3 w-3" /> Live · 04:21
          </span>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl glass-panel p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Client</p>
          <div className="mt-1 flex items-center gap-2">
            <img src={session.client.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium text-foreground">{session.client.name}</p>
              <p className="text-[10px] text-muted-foreground">{session.program}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl glass-panel p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Sets completed</p>
          <p className="metric-numeral mt-1 text-2xl">{completedSets}<span className="text-sm text-muted-foreground">/{totalSets}</span></p>
        </div>
        <div className="rounded-xl glass-panel p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Volume</p>
          <p className="metric-numeral mt-1 text-2xl">{totalVolume.toLocaleString()}<span className="text-sm text-muted-foreground"> lb</span></p>
        </div>
        <div className="rounded-xl glass-panel p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Heart-rate zone</p>
          <p className="metric-numeral mt-1 text-2xl text-[color:var(--data-pos)]">Z3<span className="ml-2 text-sm font-mono text-foreground">144 bpm</span></p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Panel title="Rest timer" actions={
            <button
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3 py-1 text-[11px] text-foreground"
            >
              {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {running ? "Pause" : "Start"}
            </button>
          }>
            <div className="flex items-center justify-between rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_50%,transparent)] p-6">
              <div className="flex items-center gap-3">
                <Timer className="h-6 w-6 text-[color:var(--teal)]" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Next set in</p>
                  <p className="metric-numeral text-[60px] leading-none tracking-tight text-foreground">{fmt(rest || active.rest)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Target</p>
                <p className="text-sm font-medium text-foreground">{active.target}</p>
                <button
                  onClick={() => { setRest(0); setRunning(false); }}
                  className="mt-2 inline-flex items-center gap-1 rounded-full glass-panel-quiet px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  <SkipForward className="h-3 w-3" /> Skip
                </button>
              </div>
            </div>
          </Panel>

          <Panel title={`${active.name} · set log`} actions={<span className="text-[11px] text-muted-foreground">{activeIdx + 1} / {session.exercises.length}</span>}>
            <div className="space-y-1.5">
              <div className="grid grid-cols-[40px_1fr_1fr_1fr_70px] gap-2 px-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <span>Set</span><span>Weight</span><span>Reps</span><span>RPE</span><span></span>
              </div>
              {active.sets.map((s, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[40px_1fr_1fr_1fr_70px] items-center gap-2 rounded-lg border p-2 ${
                    s.done
                      ? "border-[color:color-mix(in_oklab,var(--data-pos)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--data-pos)_6%,transparent)]"
                      : "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_50%,transparent)]"
                  }`}
                >
                  <span className="font-mono text-sm tabular-nums text-foreground">{i + 1}</span>
                  <input
                    defaultValue={s.weight || ""}
                    className="w-full rounded border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-sm text-foreground"
                  />
                  <input
                    defaultValue={s.reps || ""}
                    className="w-full rounded border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-sm text-foreground"
                  />
                  <input
                    defaultValue={s.rpe || ""}
                    className="w-full rounded border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 font-mono text-sm text-foreground"
                  />
                  <button
                    onClick={() => logSet(i)}
                    disabled={s.done}
                    className={`inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                      s.done
                        ? "bg-[color:color-mix(in_oklab,var(--data-pos)_22%,transparent)] text-[color:var(--data-pos)]"
                        : "bg-foreground text-background"
                    }`}
                  >
                    <Check className="h-3 w-3" /> {s.done ? "Done" : "Log"}
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Exercise queue">
            <ul className="space-y-1.5">
              {session.exercises.map((e, i) => {
                const done = e.sets.filter((x) => x.done).length;
                const total = e.sets.length;
                const isActive = i === activeIdx;
                return (
                  <li key={e.name}>
                    <button
                      onClick={() => setActiveIdx(i)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left ${
                        isActive
                          ? "border-[color:color-mix(in_oklab,var(--teal)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)]"
                          : "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_50%,transparent)]"
                      }`}
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--surface-glass)_70%,transparent)] font-mono text-[11px] tabular-nums text-foreground">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground">{e.target}</p>
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{done}/{total}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <Panel title="AI form cues" actions={<span className="text-[11px] text-muted-foreground">streaming</span>}>
          <ul className="space-y-2">
            {liveCues.map((c, i) => (
              <li key={i} className={`rounded-lg border p-2.5 ${
                c.tone === "pos" ? "border-[color:color-mix(in_oklab,var(--data-pos)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--data-pos)_6%,transparent)]" :
                c.tone === "neg" ? "border-[color:color-mix(in_oklab,var(--data-neg)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--data-neg)_6%,transparent)]" :
                "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_50%,transparent)]"
              }`}>
                <div className="flex items-center gap-2">
                  <Zap className={`h-3.5 w-3.5 ${c.tone === "neg" ? "text-[color:var(--data-neg)]" : c.tone === "pos" ? "text-[color:var(--data-pos)]" : "text-foreground/70"}`} />
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{c.t}</span>
                </div>
                <p className="mt-1 text-xs text-foreground">{c.text}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
