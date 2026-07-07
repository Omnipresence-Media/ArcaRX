import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useClientPrograms, PROGRAM_META, type ProgramKey } from "@/features/coaching/programsStore";
import {
  useAssignment, usePrograms, useMealPlans, useDayLog,
  logSet, lastWeightFor, toggleMealDone, toggleStepDone, mealTotals,
  toggleCircuitStation, setCircuitStation,
  type BuilderProgram, type BuilderMealPlan, type BuilderExercise, type SetLog, type Circuit,
} from "@/features/coaching/builderStore";
import { clipFor } from "@/features/coaching/exerciseVideos";
import { protocolFor } from "@/features/coaching/protocolSeed";
import { Dumbbell, Salad, Sparkle, CheckCircle2, Circle, Trophy, Check, Play, Weight, Zap } from "lucide-react";

const PROGRAM_ICON: Record<ProgramKey, typeof Dumbbell> = {
  fitness: Dumbbell,
  health: Salad,
  protocol: Sparkle,
};

/* ------------------------------ shared bits ------------------------------ */

function SectionCard({ title, sub, right, children }: { title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card/60 p-4 md:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const raf = useRef(0);
  useEffect(() => {
    const start = display;
    const t0 = performance.now();
    const dur = 500;
    cancelAnimationFrame(raf.current);
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{display.toLocaleString()}</>;
}

/* ------------------------------ fitness ------------------------------ */

function targetReps(reps: string): number {
  const n = parseInt(reps, 10);
  return Number.isFinite(n) && n > 0 ? n : 8;
}

const DEFAULT_WEIGHT: Record<string, number> = {
  Barbell: 95, Dumbbell: 25, Machine: 70, Cable: 40, Bodyweight: 0,
};

function prefillWeight(clientId: string, ex: BuilderExercise): number {
  return lastWeightFor(clientId, ex.id) ?? DEFAULT_WEIGHT[ex.equipment] ?? 45;
}

function setsFor(logSets: SetLog[] | undefined, ex: BuilderExercise, clientId: string): SetLog[] {
  const base = prefillWeight(clientId, ex);
  return Array.from({ length: ex.sets }, (_, i) =>
    logSets?.[i] ?? { weight: logSets?.[i - 1]?.weight ?? base, reps: targetReps(ex.reps), done: false },
  );
}

const volumeOf = (sets: SetLog[]) => sets.filter((s) => s.done).reduce((a, s) => a + s.weight * s.reps, 0);

function ExerciseVideo({ name, muscle }: { name: string; muscle: string }) {
  const clip = clipFor(name, muscle);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  if (playing && !failed) {
    return (
      <video
        src={clip.src}
        poster={clip.poster}
        autoPlay
        loop
        muted
        playsInline
        controls
        onError={() => setFailed(true)}
        className="aspect-video w-full rounded-lg bg-black object-cover"
      />
    );
  }
  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-black"
      aria-label={`Play ${name} demo`}
    >
      <img src={clip.poster} alt="" className="h-full w-full object-cover opacity-80 transition-transform group-hover:scale-[1.02]" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 backdrop-blur transition-transform group-hover:scale-110">
          <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
        </span>
      </span>
      <span className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        {failed ? "Demo coming soon" : `▶ ${clip.label}`}
      </span>
    </button>
  );
}

// "1:30" -> 90, "2 min" -> 120, "90s" -> 90. Falls back to 90s.
function restToSeconds(rest: string): number {
  if (!rest) return 90;
  const s = String(rest).trim();
  if (s.includes(":")) {
    const [m, sec] = s.split(":").map((x) => parseInt(x, 10) || 0);
    return m * 60 + sec;
  }
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n <= 0) return 90;
  return s.toLowerCase().includes("m") ? n * 60 : n;
}

function mmss(total: number): string {
  const t = Math.max(0, Math.ceil(total));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Short chime when rest ends. Silently no-ops if the browser blocks audio.
function chime() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.setValueAtTime(1175, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.start();
    o.stop(ctx.currentTime + 0.52);
    o.onended = () => ctx.close();
  } catch {
    /* audio unavailable - vibration + visual still fire */
  }
}

type RestSession = { id: number; exName: string; seconds: number };

// Floating rest timer. Portaled to body so the glass shell's backdrop-filter
// can't clip it. Starts fresh whenever a new set is completed.
function RestTimer({ session, onClose }: { session: RestSession | null; onClose: () => void }) {
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const endRef = useRef(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!session) return;
    setTotal(session.seconds);
    setRemaining(session.seconds);
    endRef.current = Date.now() + session.seconds * 1000;
    firedRef.current = false;
    const iv = setInterval(() => {
      const rem = Math.max(0, (endRef.current - Date.now()) / 1000);
      setRemaining(rem);
      if (rem <= 0 && !firedRef.current) {
        firedRef.current = true;
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([120, 60, 120]);
        chime();
      }
    }, 200);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  const done = !!session && remaining <= 0;

  // Auto-dismiss a few seconds after the rest completes.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, session?.id]);

  if (!session || typeof document === "undefined") return null;

  const addTime = (s: number) => {
    endRef.current += s * 1000;
    firedRef.current = false;
    setTotal((t) => t + s);
    setRemaining((r) => r + s);
  };

  const r = 22;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const accent = done ? "var(--success)" : "var(--teal)";

  return createPortal(
    <div
      className="fixed left-1/2 z-[120] -translate-x-1/2"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)" }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-3 rounded-2xl border bg-card/95 px-3 py-2.5 shadow-2xl backdrop-blur"
        style={{ borderColor: `color-mix(in oklab, ${accent} 45%, transparent)` }}
      >
        <div className="relative h-14 w-14 shrink-0">
          <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
            <circle cx="28" cy="28" r={r} fill="none" stroke="var(--muted)" strokeWidth="4" />
            <circle
              cx="28" cy="28" r={r} fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
              style={{ transition: "stroke-dashoffset 0.2s linear" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold tabular-nums" style={{ color: accent }}>
            {done ? <Check className="h-5 w-5" /> : mmss(remaining)}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>
            {done ? "Rest done" : "Rest"}
          </p>
          <p className="max-w-[130px] truncate text-xs text-muted-foreground">
            {done ? "Start your next set" : session.exName}
          </p>
        </div>

        {!done && (
          <button
            onClick={() => addTime(15)}
            className="shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]"
          >
            +15s
          </button>
        )}
        <button
          onClick={onClose}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${done ? "" : "bg-[color:var(--teal)]"}`}
          style={done ? { background: "var(--success)" } : undefined}
        >
          {done ? "Done" : "Skip"}
        </button>
      </div>
    </div>,
    document.body,
  );
}

function SetRow({ clientId, ex, idx, set, onComplete }: { clientId: string; ex: BuilderExercise; idx: number; set: SetLog; onComplete: (exName: string, seconds: number) => void }) {
  const vol = set.weight * set.reps;
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors ${
      set.done ? "border-[color:var(--success)]/45 bg-[color:color-mix(in_oklab,var(--success)_8%,transparent)]" : "bg-card/40"
    }`}>
      <span className="w-9 shrink-0 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Set {idx + 1}</span>
      <div className="flex flex-1 items-center justify-center gap-1.5">
        <input
          type="number"
          inputMode="decimal"
          value={set.weight === 0 ? "" : set.weight}
          placeholder="BW"
          disabled={set.done}
          onChange={(e) => logSet(clientId, ex.id, ex.sets, idx, { weight: Math.max(0, Number(e.target.value) || 0) }, { weight: set.weight, reps: set.reps })}
          className={`w-16 rounded-md border bg-background px-1.5 py-1.5 text-center font-mono text-sm font-semibold tabular-nums outline-none focus:ring-2 focus:ring-[color:var(--teal)]/40 ${set.done ? "border-transparent bg-transparent text-muted-foreground" : ""}`}
          aria-label={`Set ${idx + 1} weight`}
        />
        <span className="text-[10px] text-muted-foreground">lb ×</span>
        <input
          type="number"
          inputMode="numeric"
          value={set.reps === 0 ? "" : set.reps}
          disabled={set.done}
          onChange={(e) => logSet(clientId, ex.id, ex.sets, idx, { reps: Math.max(0, Number(e.target.value) || 0) }, { weight: set.weight, reps: set.reps })}
          className={`w-12 rounded-md border bg-background px-1.5 py-1.5 text-center font-mono text-sm font-semibold tabular-nums outline-none focus:ring-2 focus:ring-[color:var(--teal)]/40 ${set.done ? "border-transparent bg-transparent text-muted-foreground" : ""}`}
          aria-label={`Set ${idx + 1} reps`}
        />
        <span className="text-[10px] text-muted-foreground">reps</span>
      </div>
      <span className={`w-16 shrink-0 text-right font-mono text-[11px] tabular-nums ${set.done ? "font-semibold text-[color:var(--success)]" : "text-muted-foreground"}`}>
        {vol > 0 ? `+${vol.toLocaleString()}` : "-"}
      </span>
      <button
        onClick={() => {
          const nextDone = !set.done;
          logSet(clientId, ex.id, ex.sets, idx, { done: nextDone }, { weight: set.weight, reps: set.reps });
          if (nextDone) onComplete(ex.name, restToSeconds(ex.rest));
        }}
        aria-label={set.done ? `Unlog set ${idx + 1}` : `Log set ${idx + 1}`}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
          set.done
            ? "border-transparent bg-[color:var(--success)] text-white"
            : "border-border text-muted-foreground hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] active:scale-90"
        }`}
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  );
}

// Inline countdown for a timed circuit station (e.g. 30s battle bike).
// Press to start; auto-completes the station and chimes at zero.
function StationTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const rem = Math.max(0, (endRef.current - Date.now()) / 1000);
      setRemaining(rem);
      if (rem <= 0) {
        clearInterval(iv);
        setRunning(false);
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([120, 60, 120]);
        chime();
        onDone();
      }
    }, 200);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  if (running) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[color:color-mix(in_oklab,var(--teal)_16%,transparent)] px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums text-[color:var(--teal)]">
        {mmss(remaining)}
      </span>
    );
  }
  return (
    <button
      onClick={() => { endRef.current = Date.now() + seconds * 1000; setRemaining(seconds); setRunning(true); }}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[color:var(--teal)] px-2.5 py-1.5 text-xs font-semibold text-white active:scale-95"
    >
      <Play className="h-3 w-3 fill-white" /> {mmss(seconds)}
    </button>
  );
}

// Client-side circuit player: works one round at a time, checking off each
// station (timed stations run a countdown). Between rounds it fires the
// floating rest timer via onRest.
function CircuitBlock({ clientId, circuit, done, onRest }: {
  clientId: string;
  circuit: Circuit;
  done: Record<string, boolean>;
  onRest: (label: string, seconds: number) => void;
}) {
  const keyOf = (round: number, stationId: string) => `${circuit.id}:${round}:${stationId}`;
  const roundDone = (round: number) =>
    circuit.stations.length > 0 && circuit.stations.every((s) => !!done[keyOf(round, s.id)]);

  const rounds = Array.from({ length: circuit.rounds }, (_, i) => i + 1);
  const completedRounds = rounds.filter(roundDone).length;
  const complete = circuit.stations.length > 0 && completedRounds === circuit.rounds;
  const activeRound = rounds.find((r) => !roundDone(r)) ?? circuit.rounds;

  // Fire the rest timer once when a round finishes and more rounds remain.
  const prevCompleted = useRef(completedRounds);
  useEffect(() => {
    if (completedRounds > prevCompleted.current && completedRounds < circuit.rounds && circuit.restBetweenRounds > 0) {
      onRest(`${circuit.name} · round ${completedRounds + 1}`, circuit.restBetweenRounds);
    }
    prevCompleted.current = completedRounds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedRounds]);

  return (
    <section className={`overflow-hidden rounded-xl border bg-card/60 ${complete ? "border-[color:var(--success)]/45" : ""}`}>
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-base font-semibold">
            <Zap className="h-4 w-4 text-[color:var(--teal)]" />{circuit.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {circuit.stations.length} stations · {circuit.rounds} rounds{circuit.restBetweenRounds > 0 ? ` · ${circuit.restBetweenRounds}s rest` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {rounds.map((r) => (
            <span
              key={r}
              title={`Round ${r}`}
              className={`h-2.5 w-2.5 rounded-full ${roundDone(r) ? "bg-[color:var(--success)]" : r === activeRound && !complete ? "bg-[color:var(--teal)]" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {complete ? (
        <p className="m-3 flex items-center justify-center gap-2 rounded-lg bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)] p-2 text-sm font-semibold text-[color:var(--success)]">
          <Trophy className="h-4 w-4" /> {circuit.name} complete · {circuit.rounds} rounds
        </p>
      ) : circuit.stations.length === 0 ? (
        <p className="p-3 text-center text-xs text-muted-foreground">Your coach hasn't added stations to this circuit yet.</p>
      ) : (
        <div className="p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--teal)]">
            Round {activeRound} of {circuit.rounds}
          </p>
          <div className="space-y-1.5">
            {circuit.stations.map((s, i) => {
              const k = keyOf(activeRound, s.id);
              const isDone = !!done[k];
              return (
                <div key={s.id} className={`flex items-center gap-3 rounded-lg border px-2.5 py-2 ${isDone ? "border-[color:var(--success)]/45 bg-[color:color-mix(in_oklab,var(--success)_8%,transparent)]" : "bg-card/40"}`}>
                  <button
                    onClick={() => toggleCircuitStation(clientId, k)}
                    aria-label={isDone ? `Undo ${s.name}` : `Complete ${s.name}`}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isDone ? "border-transparent bg-[color:var(--success)] text-white" : "border-border text-muted-foreground hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] active:scale-90"
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${isDone ? "text-muted-foreground line-through" : ""}`}>{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.kind === "time" ? `${s.seconds ?? 0}s hold` : `${s.reps ?? ""} reps`}
                    </p>
                  </div>
                  {s.kind === "time" && !isDone && (
                    <StationTimer seconds={s.seconds ?? 30} onDone={() => setCircuitStation(clientId, k, true)} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function FitnessProgram({ clientId }: { clientId: string }) {
  const assignment = useAssignment(clientId);
  const allPrograms = usePrograms();
  const program: BuilderProgram = allPrograms.find((p) => p.id === assignment.programId) ?? allPrograms[0];
  const log = useDayLog(clientId);

  const [rest, setRest] = useState<RestSession | null>(null);
  const startRest = (exName: string, seconds: number) => setRest({ id: Date.now(), exName, seconds });

  const trainingDays = program.days.filter((d) => d.exercises.length > 0 || (d.circuits?.length ?? 0) > 0);
  const [openDay, setOpenDay] = useState<string>(trainingDays[0]?.id ?? "");
  const day = program.days.find((d) => d.id === openDay);

  const allSets = trainingDays.flatMap((d) => d.exercises.map((ex) => setsFor(log.sets[ex.id], ex, clientId)));
  const weekTotalSets = allSets.reduce((a, s) => a + s.length, 0);
  const weekDoneSets = allSets.reduce((a, s) => a + s.filter((x) => x.done).length, 0);
  const weekVolume = allSets.reduce((a, s) => a + volumeOf(s), 0);
  const pct = weekTotalSets ? Math.round((weekDoneSets / weekTotalSets) * 100) : 0;

  const daySets = day ? day.exercises.map((ex) => setsFor(log.sets[ex.id], ex, clientId)) : [];
  const dayVolume = daySets.reduce((a, s) => a + volumeOf(s), 0);
  const dayDone = daySets.reduce((a, s) => a + s.filter((x) => x.done).length, 0);
  const dayTotal = daySets.reduce((a, s) => a + s.length, 0);
  const dayComplete = dayTotal > 0 && dayDone === dayTotal;

  return (
    <div className="space-y-4">
      <div className="sticky top-2 z-30 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">{day ? `${day.day} · ${day.title}` : program.name}</p>
            <p className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-bold tabular-nums text-[color:var(--teal)]">
                <AnimatedNumber value={dayVolume} />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">lb volume today</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold tabular-nums">{dayDone}<span className="text-muted-foreground">/{dayTotal} sets</span></p>
            <p className="text-[10px] text-muted-foreground">week: {weekVolume.toLocaleString()} lb · {pct}%</p>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--teal)] to-emerald-400 transition-all duration-500" style={{ width: `${dayTotal ? (dayDone / dayTotal) * 100 : 0}%` }} />
        </div>
        {dayComplete && (
          <p className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)] p-2 text-sm font-semibold text-[color:var(--success)]">
            <Trophy className="h-4 w-4" /> Workout complete · {dayVolume.toLocaleString()} lb moved
          </p>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {program.days.map((d) => {
          const isRest = d.exercises.length === 0 && (d.circuits?.length ?? 0) === 0;
          const sets = d.exercises.map((ex) => setsFor(log.sets[ex.id], ex, clientId));
          const done = sets.length > 0 && sets.every((s) => s.every((x) => x.done));
          const active = openDay === d.id;
          return (
            <button
              key={d.id}
              onClick={() => !isRest && setOpenDay(d.id)}
              disabled={isRest}
              className={`flex shrink-0 flex-col items-center rounded-lg border px-3 py-1.5 transition-colors ${
                active ? "border-[color:var(--teal)] bg-[color:color-mix(in_oklab,var(--teal)_10%,transparent)]"
                : isRest ? "opacity-45" : "hover:border-[color:var(--teal)]/40"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{d.day}</span>
              {done
                ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--success)]" />
                : <span className="mt-0.5 text-[10px] text-muted-foreground">{isRest ? "rest" : d.exercises.length === 0 ? "HIIT" : `${sets.reduce((a, s) => a + s.filter((x) => x.done).length, 0)}/${sets.reduce((a, s) => a + s.length, 0)}`}</span>}
            </button>
          );
        })}
      </div>

      {day && day.exercises.map((ex) => {
        const sets = setsFor(log.sets[ex.id], ex, clientId);
        const exVol = volumeOf(sets);
        const exDone = sets.every((s) => s.done);
        return (
          <section key={ex.id} className={`overflow-hidden rounded-xl border bg-card/60 ${exDone ? "border-[color:var(--success)]/45" : ""}`}>
            <div className="p-3 pb-0">
              <ExerciseVideo name={ex.name} muscle={ex.muscle} />
            </div>
            <div className="space-y-2.5 p-3 md:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className={`text-base font-semibold ${exDone ? "text-[color:var(--success)]" : ""}`}>
                    {exDone && <CheckCircle2 className="mr-1.5 inline h-4 w-4" />}{ex.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Target: {ex.sets} × {ex.reps} · RPE {ex.rpe} · rest {ex.rest}
                  </p>
                </div>
                <div className="shrink-0 rounded-lg bg-[color:color-mix(in_oklab,var(--teal)_10%,transparent)] px-2.5 py-1.5 text-right">
                  <p className="flex items-center gap-1 font-mono text-sm font-bold tabular-nums text-[color:var(--teal)]">
                    <Weight className="h-3.5 w-3.5" /><AnimatedNumber value={exVol} />
                  </p>
                  <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">lb volume</p>
                </div>
              </div>

              {ex.notes && (
                <p className="rounded-md border border-[color:var(--warning)]/25 bg-[color:color-mix(in_oklab,var(--warning)_7%,transparent)] px-2.5 py-1.5 text-xs italic text-foreground/85">
                  Coach: {ex.notes}
                </p>
              )}

              <div className="space-y-1.5">
                {sets.map((s, i) => (
                  <SetRow key={i} clientId={clientId} ex={ex} idx={i} set={s} onComplete={startRest} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {day?.circuits?.map((c) => (
        <CircuitBlock key={c.id} clientId={clientId} circuit={c} done={log.circuit ?? {}} onRest={startRest} />
      ))}

      <RestTimer session={rest} onClose={() => setRest(null)} />
    </div>
  );
}

/* ------------------------------ health ------------------------------ */

function HealthProgram({ clientId }: { clientId: string }) {
  const assignment = useAssignment(clientId);
  const allPlans = useMealPlans();
  const plan: BuilderMealPlan = allPlans.find((p) => p.id === assignment.mealPlanId) ?? allPlans[0];
  const log = useDayLog(clientId);

  const eaten = plan.meals.filter((m) => log.meals[m.id]);
  const consumed = eaten.reduce(
    (a, m) => { const t = mealTotals(m); return { kcal: a.kcal + t.kcal, p: a.p + t.p, c: a.c + t.c, f: a.f + t.f }; },
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  return (
    <div className="space-y-4">
      <SectionCard
        title={plan.name}
        sub="Your daily targets · tap each meal when you've eaten it"
        right={
          <div className="text-right">
            <p className="font-mono text-lg font-semibold tabular-nums text-[color:var(--teal)]"><AnimatedNumber value={consumed.kcal} /></p>
            <p className="text-[10px] text-muted-foreground">of {plan.calories} kcal</p>
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          {([["Protein", consumed.p, plan.protein], ["Carbs", consumed.c, plan.carbs], ["Fat", consumed.f, plan.fat]] as const).map(([label, val, target]) => (
            <div key={label} className="rounded-lg border p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{val}<span className="text-muted-foreground">/{target}g</span></p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[color:var(--teal)]" style={{ width: `${Math.min(100, Math.round((val / Math.max(1, target)) * 100))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Today's meals">
        <div className="space-y-2.5">
          {plan.meals.map((m) => {
            const t = mealTotals(m);
            const done = !!log.meals[m.id];
            return (
              <button
                key={m.id}
                onClick={() => toggleMealDone(clientId, m.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  done ? "border-[color:var(--success)]/40 bg-[color:color-mix(in_oklab,var(--success)_7%,transparent)]" : "hover:border-[color:var(--teal)]/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2.5">
                    {done
                      ? <CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" />
                      : <Circle className="h-5 w-5 text-muted-foreground/50" />}
                    <span>
                      <span className={`block text-sm font-semibold ${done ? "text-muted-foreground line-through" : ""}`}>{m.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{m.time}</span>
                    </span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">{t.kcal} kcal · {t.p}p</span>
                </div>
                {m.items.length > 0 && (
                  <ul className="mt-2 space-y-1 border-t pt-2">
                    {m.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between text-xs">
                        <span className="text-foreground/90">{it.name} <span className="text-muted-foreground">· {it.grams}g</span></span>
                        <span className="font-mono tabular-nums text-muted-foreground">{it.kcal} kcal</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

/* ------------------------------ protocol ------------------------------ */

function ProtocolProgram({ clientId }: { clientId: string }) {
  const p = protocolFor(clientId);
  const log = useDayLog(clientId);
  const steps = log.steps ?? {};
  const doneCount = p.regimen.filter((r) => steps[`${p.id}-${r.step}`]).length;
  const pct = p.regimen.length ? Math.round((doneCount / p.regimen.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <SectionCard
        title={p.name}
        sub={`${p.category} · ${p.durationWeeks} weeks · tap each step as you complete it today`}
        right={
          <div className="text-right">
            <p className="font-mono text-lg font-semibold tabular-nums text-[color:var(--teal)]">{doneCount}<span className="text-muted-foreground">/{p.regimen.length}</span></p>
            <p className="text-[10px] text-muted-foreground">today</p>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">{p.summary}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-[color:var(--chart-violet,#a78bfa)] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <p className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)] p-2 text-sm font-semibold text-[color:var(--success)]">
            <Trophy className="h-4 w-4" /> Routine complete for today
          </p>
        )}
      </SectionCard>

      <SectionCard title="Your regimen">
        <div className="space-y-2">
          {p.regimen.map((r) => {
            const key = `${p.id}-${r.step}`;
            const done = !!steps[key];
            return (
              <button
                key={r.step}
                onClick={() => toggleStepDone(clientId, key)}
                className={`flex w-full items-start gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                  done ? "border-[color:var(--success)]/40 bg-[color:color-mix(in_oklab,var(--success)_7%,transparent)]" : "hover:border-[color:var(--chart-violet,#a78bfa)]/50"
                }`}
              >
                {done
                  ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--success)]" />
                  : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: "color-mix(in oklab, var(--chart-violet, #a78bfa) 16%, transparent)", color: "var(--chart-violet, #a78bfa)" }}>{r.time}</span>
                    <span className={`text-sm font-semibold ${done ? "text-muted-foreground line-through" : ""}`}>{r.product}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{r.detail}</span>
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Supplements">
        <ul className="divide-y">
          {p.supplements.map((s) => (
            <li key={s.name} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.dose} · {s.timing}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {p.dosing.length > 0 && (
        <SectionCard title="Dosing schedule">
          <ul className="space-y-2">
            {p.dosing.map((d) => (
              <li key={d.med} className="rounded-lg border p-2.5 text-sm">
                <p className="font-semibold">{d.med} <span className="text-xs font-normal text-muted-foreground">· {d.route}</span></p>
                <p className="text-xs text-muted-foreground">{d.schedule}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}

/* ------------------------------ main view ------------------------------ */

export function ClientCoachingView({ clientId }: { clientId: string }) {
  const programs = useClientPrograms(clientId);
  const enabled = (Object.keys(programs) as ProgramKey[]).filter((k) => programs[k]);
  const [active, setActive] = useState<ProgramKey | null>(enabled[0] ?? null);
  const current = active && programs[active] ? active : enabled[0] ?? null;

  if (enabled.length === 0) {
    return (
      <div className="rounded-xl border bg-card/60 p-8 text-center">
        <p className="text-sm font-medium">No programs assigned yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Your coach will enable your programs soon. Check back shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {enabled.map((key) => {
          const Icon = PROGRAM_ICON[key];
          const on = current === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                on ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: on ? undefined : PROGRAM_META[key].accent }} />
              {PROGRAM_META[key].label}
            </button>
          );
        })}
      </div>

      {current === "fitness" && <FitnessProgram clientId={clientId} />}
      {current === "health" && <HealthProgram clientId={clientId} />}
      {current === "protocol" && <ProtocolProgram clientId={clientId} />}
    </div>
  );
}
