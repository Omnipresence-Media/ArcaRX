import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, X, Play, ChevronLeft, Camera, Sparkles, Flame } from "lucide-react";
import { toast } from "sonner";
import { Card, Pill, TealButton, GhostButton, SegmentControl, ProgressBar, Ring } from "../components/primitives";
import * as M from "../mockData";

type Sub = "Train" | "Nutrition" | "Body";

export function FitnessTab({
  empty,
  loading,
  workoutOpen,
  setWorkoutOpen,
  scannerOpen,
  setScannerOpen,
}: {
  empty: boolean;
  loading: boolean;
  workoutOpen: boolean;
  setWorkoutOpen: (v: boolean) => void;
  scannerOpen: boolean;
  setScannerOpen: (v: boolean) => void;
}) {
  const [sub, setSub] = useState<Sub>("Train");

  return (
    <div className="px-4 pb-32 pt-2 space-y-4">
      <SegmentControl<Sub> options={["Train", "Nutrition", "Body"]} value={sub} onChange={setSub} />
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="asc-shimmer rounded-2xl" style={{ height: 120 }} />
          ))}
        </div>
      ) : empty ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">💪</div>
          <div className="asc-display">No program assigned</div>
          <div className="text-sm mt-1" style={{ color: "var(--asc-muted)" }}>
            Pick a starter block or wait for your coach.
          </div>
          <TealButton className="mt-4">Browse Programs</TealButton>
        </Card>
      ) : sub === "Train" ? (
        <TrainView onStart={() => setWorkoutOpen(true)} />
      ) : sub === "Nutrition" ? (
        <NutritionView onScan={() => setScannerOpen(true)} />
      ) : (
        <BodyView />
      )}

      <AnimatePresence>{workoutOpen && <WorkoutPlayer onClose={() => setWorkoutOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{scannerOpen && <FoodScanner onClose={() => setScannerOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function TrainView({ onStart }: { onStart: () => void }) {
  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="asc-display text-lg">{M.program.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--asc-muted)" }}>
              Week {M.program.week} of {M.program.totalWeeks} • {M.program.phase}
            </div>
          </div>
          <Pill color="var(--asc-amber)">{M.program.phase}</Pill>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {M.program.days.map((d, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold"
              style={{
                background:
                  d.state === "done"
                    ? "color-mix(in oklab, var(--asc-teal) 20%, transparent)"
                    : d.state === "today"
                    ? "transparent"
                    : "rgba(255,255,255,0.03)",
                border: d.state === "today" ? "2px solid var(--asc-teal)" : "1px solid var(--asc-border)",
                color: d.state === "upcoming" ? "var(--asc-muted)" : "var(--asc-text)",
                animation: d.state === "today" ? "pulse 2s infinite" : undefined,
              }}
            >
              <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                {d.label}
              </div>
              {d.state === "done" && <Check size={12} style={{ color: "var(--asc-teal)" }} />}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex h-2 rounded-full overflow-hidden">
            {M.program.phases.map((p, i) => (
              <div
                key={i}
                style={{
                  background: p.color,
                  flex: p.weeks.length,
                  opacity: p.weeks.includes(M.program.week) ? 1 : 0.4,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[10px]" style={{ color: "var(--asc-muted)" }}>
            {M.program.phases.map((p) => (
              <span key={p.name}>{p.name}</span>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Upcoming
        </div>
        <div className="space-y-2">
          {M.workouts.map((w, i) => (
            <div key={w.id} className="flex items-center justify-between p-3 asc-surface rounded-xl">
              <div>
                <div className="text-sm font-semibold">{w.name}</div>
                <div className="text-[11px]" style={{ color: "var(--asc-muted)" }}>
                  {w.duration} • {w.focus}
                </div>
              </div>
              {i === 0 ? (
                <TealButton onClick={onStart}>Start</TealButton>
              ) : (
                <GhostButton onClick={() => toast("Workout queued")}>Preview</GhostButton>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Movement Library
          </div>
          <div className="flex gap-1">
            {["All", "Push", "Pull", "Legs", "Core"].map((f, i) => (
              <span
                key={f}
                className="px-2 py-0.5 text-[10px] rounded-full"
                style={{
                  background: i === 0 ? "var(--asc-teal)" : "rgba(255,255,255,0.04)",
                  color: i === 0 ? "#062520" : "var(--asc-muted)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Bench Press", "Squat", "Deadlift", "Pull-up", "OHP", "Row"].map((e) => (
            <div key={e} className="asc-surface rounded-lg overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                <Play size={20} style={{ color: "var(--asc-teal)" }} />
              </div>
              <div className="p-2">
                <div className="text-[11px] font-semibold truncate">{e}</div>
                <div className="text-[9px]" style={{ color: "var(--asc-muted)" }}>
                  Compound
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          History (12 weeks)
        </div>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 84 }).map((_, i) => {
            const intensity = Math.random();
            return (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{
                  background:
                    intensity < 0.25
                      ? "rgba(255,255,255,0.04)"
                      : `color-mix(in oklab, var(--asc-teal) ${20 + intensity * 60}%, transparent)`,
                }}
              />
            );
          })}
        </div>
        <div className="mt-4 space-y-2">
          {[
            ["Bench", "215 lb"],
            ["Squat", "315 lb"],
            ["Deadlift", "405 lb"],
            ["OHP", "145 lb"],
          ].map(([lift, w]) => (
            <div key={lift} className="flex justify-between text-xs asc-surface px-3 py-2 rounded-lg">
              <span>{lift} 1RM</span>
              <span className="asc-num font-semibold">{w}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function WorkoutPlayer({ onClose }: { onClose: () => void }) {
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [exercises, setExercises] = useState(M.workouts[0].exercises);
  const [setSheet, setSetSheet] = useState<{ ex: number; set: number } | null>(null);
  const [restOpen, setRestOpen] = useState(false);
  const [restSec, setRestSec] = useState(120);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [complete]);

  useEffect(() => {
    if (!restOpen) return;
    if (restSec <= 0) {
      setRestOpen(false);
      return;
    }
    const t = setTimeout(() => setRestSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [restOpen, restSec]);

  const totalSets = exercises.reduce((acc, e) => acc + e.sets.length, 0);
  const doneSets = exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.done).length, 0);
  const doneExercises = exercises.filter((e) => e.sets.every((s) => s.done)).length;

  if (complete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ascend-fullscreen fixed inset-0 z-[100] flex flex-col items-center justify-center p-6"
        style={{ background: "var(--asc-base)" }}
      >
        <div className="relative">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i / 24) * Math.PI * 2) * 200,
                y: Math.sin((i / 24) * Math.PI * 2) * 200,
                opacity: 0,
              }}
              transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
              style={{ background: "var(--asc-teal)" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="asc-display text-7xl text-center"
            style={{ color: "var(--asc-teal)" }}
          >
            ✓
          </motion.div>
        </div>
        <div className="asc-display text-2xl mt-6">Workout Complete</div>
        <div className="grid grid-cols-3 gap-6 mt-8 text-center">
          <div>
            <div className="asc-num text-2xl font-bold">4,820</div>
            <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
              Volume (kg)
            </div>
          </div>
          <div>
            <div className="asc-num text-2xl font-bold">{Math.floor(elapsed / 60)}</div>
            <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
              Minutes
            </div>
          </div>
          <div>
            <div className="asc-num text-2xl font-bold" style={{ color: "var(--asc-amber)" }}>
              1 PR
            </div>
            <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
              Bench 185×6
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-10 w-full max-w-sm">
          <GhostButton className="flex-1" onClick={() => toast.success("Shared!")}>
            Share PR
          </GhostButton>
          <TealButton className="flex-1" onClick={onClose}>
            Done
          </TealButton>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30 }}
      className="ascend-fullscreen fixed inset-0 z-[100] overflow-y-auto asc-scroll"
      style={{ background: "var(--asc-base)" }}
    >
      <div className="sticky top-0 backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10" style={{ background: "rgba(10,12,15,0.85)" }}>
        <button onClick={onClose} className="p-2">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="text-xs font-semibold">{M.workouts[0].name}</div>
          <div className="asc-num text-[11px]" style={{ color: "var(--asc-teal)" }}>
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
          </div>
        </div>
        <button
          onClick={() => setComplete(true)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: "var(--asc-coral)", color: "white" }}
        >
          End
        </button>
      </div>
      <div className="px-4 pt-2 pb-1">
        <div className="text-[10px] mb-1" style={{ color: "var(--asc-muted)" }}>
          {doneExercises} of {exercises.length} exercises • {doneSets}/{totalSets} sets
        </div>
        <ProgressBar pct={(doneSets / totalSets) * 100} />
      </div>

      <div className="px-4 py-4 space-y-4">
        {exercises.map((ex, ei) => (
          <div key={ei} className="asc-card overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center">
              <Play size={40} style={{ color: "rgba(255,255,255,0.4)" }} />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="asc-display text-base">{ex.name}</div>
                <GhostButton onClick={() => toast("Swap menu")}>Swap</GhostButton>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ex.cues.map((c) => (
                  <Pill key={c} color="var(--asc-muted)">
                    {c}
                  </Pill>
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                {ex.sets.map((s, si) => (
                  <button
                    key={si}
                    onClick={() => !s.done && setSetSheet({ ex: ei, set: si })}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg asc-surface text-left active:scale-[0.99] transition"
                    style={{ opacity: s.done ? 0.7 : 1 }}
                  >
                    <div className="w-6 text-[11px]" style={{ color: "var(--asc-muted)" }}>
                      {si + 1}
                    </div>
                    <div className="asc-num text-sm flex-1">
                      {s.weight}lb × {s.reps}
                    </div>
                    {s.rpe && (
                      <Pill color="var(--asc-amber)">RPE {s.rpe}</Pill>
                    )}
                    {s.done ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "var(--asc-teal)" }}
                      >
                        <Check size={14} color="#062520" />
                      </div>
                    ) : (
                      <div className="text-[10px]" style={{ color: "var(--asc-teal)" }}>
                        Tap to log
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div
                className="mt-3 p-2.5 rounded-lg text-[11px] flex items-start gap-2"
                style={{ background: "color-mix(in oklab, var(--asc-teal) 10%, transparent)" }}
              >
                <Sparkles size={12} style={{ color: "var(--asc-teal)" }} className="mt-0.5 flex-shrink-0" />
                <span style={{ color: "var(--asc-text)" }}>{ex.ai}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {setSheet && (
          <SetLogSheet
            ex={exercises[setSheet.ex]}
            setIdx={setSheet.set}
            onConfirm={(reps, weight, rpe) => {
              const next = [...exercises];
              next[setSheet.ex] = {
                ...next[setSheet.ex],
                sets: next[setSheet.ex].sets.map((s, i) => (i === setSheet.set ? { ...s, reps, weight, rpe, done: true } : s)),
              };
              setExercises(next);
              setSetSheet(null);
              setRestSec(120);
              setRestOpen(true);
              toast.success("Set logged");
            }}
            onClose={() => setSetSheet(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{restOpen && <RestTimer sec={restSec} onSkip={() => setRestOpen(false)} />}</AnimatePresence>
    </motion.div>
  );
}

function SetLogSheet({
  ex,
  setIdx,
  onConfirm,
  onClose,
}: {
  ex: (typeof M.workouts)[0]["exercises"][0];
  setIdx: number;
  onConfirm: (reps: number, weight: number, rpe: number) => void;
  onClose: () => void;
}) {
  const initial = ex.sets[setIdx];
  const [reps, setReps] = useState(initial.reps);
  const [weight, setWeight] = useState(initial.weight);
  const [rpe, setRpe] = useState(8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-end"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28 }}
        className="w-full asc-card rounded-t-3xl rounded-b-none p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="asc-display">
            {ex.name} - Set {setIdx + 1}
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div>
          <div className="text-[11px] mb-1" style={{ color: "var(--asc-muted)" }}>
            Reps
          </div>
          <input type="number" value={reps} onChange={(e) => setReps(+e.target.value)} className="w-full asc-num text-xl" />
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--asc-muted)" }}>
            <span>Weight</span>
            <span className="asc-num">{weight} lb</span>
          </div>
          <input
            type="range"
            min={0}
            max={400}
            step={5}
            value={weight}
            onChange={(e) => setWeight(+e.target.value)}
            className="w-full"
            style={{ accentColor: "var(--asc-teal)" }}
          />
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--asc-muted)" }}>
            <span>RPE</span>
            <span className="asc-num">{rpe}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={rpe}
            onChange={(e) => setRpe(+e.target.value)}
            className="w-full"
            style={{ accentColor: "var(--asc-amber)" }}
          />
        </div>
        <TealButton className="w-full" onClick={() => onConfirm(reps, weight, rpe)}>
          <Check size={16} /> Confirm Set
        </TealButton>
      </motion.div>
    </motion.div>
  );
}

function RestTimer({ sec, onSkip }: { sec: number; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center"
      style={{ background: "rgba(10,12,15,0.95)" }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-48 h-48 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, color-mix(in oklab, var(--asc-teal) 20%, transparent), transparent 70%)",
          border: "2px solid var(--asc-teal)",
        }}
      >
        <div className="asc-num text-5xl font-bold">
          {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, "0")}
        </div>
      </motion.div>
      <div className="text-xs mt-6" style={{ color: "var(--asc-muted)" }}>
        Breathe. Reset.
      </div>
      <GhostButton className="mt-6" onClick={onSkip}>
        Skip Rest
      </GhostButton>
    </motion.div>
  );
}

function NutritionView({ onScan }: { onScan: () => void }) {
  return (
    <>
      <Card>
        <div className="flex justify-between mb-3">
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Today's Macros
          </div>
          <TealButton onClick={onScan}>
            <Camera size={14} /> Scan
          </TealButton>
        </div>
        <div className="flex justify-around">
          {(Object.entries(M.macros) as [string, typeof M.macros.protein][]).slice(0, 4).map(([k, v]) => (
            <div key={k} className="flex flex-col items-center">
              <Ring size={64} stroke={5} pct={v.current / v.target} color="var(--asc-teal)">
                <span className="asc-num text-xs font-bold">{Math.round((v.current / v.target) * 100)}%</span>
              </Ring>
              <div className="text-[10px] mt-1 capitalize">{k}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Today
        </div>
        <div className="space-y-2">
          {M.meals.map((m, i) => (
            <div key={i} className="p-3 asc-surface rounded-xl flex justify-between items-start">
              <div>
                <div className="text-xs" style={{ color: "var(--asc-muted)" }}>
                  {m.time} • {m.name}
                </div>
                <div className="text-sm font-semibold mt-0.5">{m.items}</div>
                <Pill color={m.source === "scan" ? "var(--asc-teal)" : "var(--asc-muted)"}>
                  {m.source === "scan" ? "LiDAR Scan" : "Manual"}
                </Pill>
              </div>
              <div className="asc-num text-sm font-semibold">{m.cal} cal</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function FoodScanner({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"scan" | "confirm">("scan");
  useEffect(() => {
    if (phase === "scan") {
      const t = setTimeout(() => setPhase("confirm"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="ascend-fullscreen fixed inset-0 z-[110]"
      style={{ background: "var(--asc-base)" }}
    >
      <div className="absolute top-0 inset-x-0 backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10">
        <button onClick={onClose} className="p-2">
          <X size={20} />
        </button>
        <div className="text-xs font-semibold">Food Scanner</div>
        <div className="w-8" />
      </div>

      {phase === "scan" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72">
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-xl",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-xl",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl",
            ].map((p, i) => (
              <div key={i} className={`absolute w-12 h-12 ${p}`} style={{ borderColor: "var(--asc-teal)" }} />
            ))}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 270 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              className="absolute left-2 right-2 h-0.5"
              style={{ background: "var(--asc-teal)", boxShadow: "0 0 12px var(--asc-teal)" }}
            />
          </div>
          <div className="text-sm mt-8" style={{ color: "var(--asc-muted)" }}>
            Hold 12–18 inches above plate
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="absolute inset-x-0 bottom-0 top-16 asc-card rounded-t-3xl rounded-b-none p-5 overflow-y-auto asc-scroll"
        >
          <div className="asc-display mb-1">Scan Results</div>
          <div className="text-xs mb-4" style={{ color: "var(--asc-muted)" }}>
            3 items detected
          </div>
          {M.scanResult.items.map((it, i) => (
            <div key={i} className="asc-surface p-3 rounded-xl mb-2">
              <div className="flex justify-between">
                <div className="text-sm font-semibold">{it.name}</div>
                <Pill color={it.confidence > 0.9 ? "var(--asc-teal)" : "var(--asc-amber)"}>
                  {Math.round(it.confidence * 100)}%
                </Pill>
              </div>
              <div className="asc-num text-xs mt-1" style={{ color: "var(--asc-muted)" }}>
                {it.grams}g
              </div>
              <input
                type="range"
                min={0}
                max={500}
                defaultValue={it.grams}
                className="w-full mt-2"
                style={{ accentColor: "var(--asc-teal)" }}
              />
              <div className="flex gap-1.5 mt-1.5">
                <Pill color="var(--asc-teal)">{it.p}P</Pill>
                <Pill color="var(--asc-amber)">{it.c}C</Pill>
                <Pill color="var(--asc-coral)">{it.f}F</Pill>
                <Pill color="var(--asc-muted)">{it.cal} cal</Pill>
              </div>
            </div>
          ))}
          <div className="asc-surface p-3 rounded-xl flex justify-between mt-3">
            <span className="text-xs font-semibold">Total</span>
            <span className="asc-num text-sm font-bold">
              {M.scanResult.total.cal} cal • {M.scanResult.total.p}P / {M.scanResult.total.c}C / {M.scanResult.total.f}F
            </span>
          </div>
          <TealButton
            className="w-full mt-4"
            onClick={() => {
              toast.success("Added to meal timeline");
              onClose();
            }}
          >
            <Check size={16} /> Confirm & Log
          </TealButton>
        </motion.div>
      )}
    </motion.div>
  );
}

function BodyView() {
  type B = "Scans" | "Weight" | "Sleep" | "Readiness";
  const [b, setB] = useState<B>("Scans");
  return (
    <>
      <SegmentControl<B> options={["Scans", "Weight", "Sleep", "Readiness"]} value={b} onChange={setB} />
      {b === "Scans" && (
        <Card>
          <div className="flex justify-between mb-3">
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
              Body Scans
            </div>
            <GhostButton onClick={() => toast("Starting scan")}>New Scan</GhostButton>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-end p-2">
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  Week {i * 2}
                </div>
              </div>
            ))}
          </div>
          <TealButton className="w-full mt-3" onClick={() => toast("Compare view")}>
            Compare Scans
          </TealButton>
        </Card>
      )}
      {b === "Weight" && (
        <Card>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--asc-muted)" }}>
            Weight (30d)
          </div>
          <div className="flex items-baseline gap-2">
            <span className="asc-num text-3xl font-bold">182.4</span>
            <span className="text-xs" style={{ color: "var(--asc-teal)" }}>
              -1.8 lb
            </span>
          </div>
          <svg viewBox="0 0 300 100" className="w-full mt-2" preserveAspectRatio="none" height={100}>
            <polyline
              fill="none"
              stroke="var(--asc-teal)"
              strokeWidth={2}
              points={Array.from({ length: 30 }, (_, i) => `${(i / 29) * 300},${50 + Math.sin(i / 3) * 10 - i / 2}`).join(" ")}
            />
          </svg>
          <TealButton className="w-full mt-3" onClick={() => toast("Weight logged")}>
            Log Weight
          </TealButton>
        </Card>
      )}
      {b === "Sleep" && (
        <Card>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--asc-muted)" }}>
            Last Night
          </div>
          <div className="asc-num text-3xl font-bold">7h 24m</div>
          <div className="text-xs" style={{ color: "var(--asc-teal)" }}>
            94% efficiency
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              ["REM", "1h 40m"],
              ["Deep", "1h 15m"],
              ["HRV", "68ms"],
            ].map(([k, v]) => (
              <div key={k} className="asc-surface p-2 rounded-lg text-center">
                <div className="asc-num font-bold">{v}</div>
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  {k}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs mt-3" style={{ color: "var(--asc-amber)" }}>
            Sleep debt: 0h 20m
          </div>
        </Card>
      )}
      {b === "Readiness" && (
        <Card>
          <div className="flex items-center gap-4">
            <Ring size={120} stroke={10} pct={M.readiness.score / 100} color="var(--asc-teal)">
              <span className="asc-num text-3xl font-bold">{M.readiness.score}</span>
            </Ring>
            <div className="flex-1 space-y-2">
              {[
                ["HRV", M.readiness.hrv],
                ["Sleep", M.readiness.sleep],
                ["Soreness", M.readiness.soreness],
                ["Load", M.readiness.load],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-[10px]" style={{ color: "var(--asc-muted)" }}>
                    <span>{k}</span>
                    <span className="asc-num">{v}</span>
                  </div>
                  <ProgressBar pct={v as number} />
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs mt-4 italic" style={{ color: "var(--asc-teal)" }}>
            {M.readiness.rec}
          </div>
        </Card>
      )}
    </>
  );
}
