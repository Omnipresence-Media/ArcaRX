import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Flame, Wind, Brain, Moon, Activity, BookOpen, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, Pill, TealButton, GhostButton, SegmentControl, ProgressBar } from "../components/primitives";
import * as M from "../mockData";

type Sub = "Habits" | "Mindfulness" | "Learning" | "Journal" | "Time";

export function LifeTab({ empty, loading }: { empty: boolean; loading: boolean }) {
  const [sub, setSub] = useState<Sub>("Habits");

  if (loading)
    return (
      <div className="px-4 pb-32 pt-2 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="asc-shimmer rounded-2xl" style={{ height: 110 }} />
        ))}
      </div>
    );
  if (empty)
    return (
      <div className="px-4 pb-32 pt-2">
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🌱</div>
          <div className="asc-display">Pick your first habits</div>
          <div className="text-sm mt-1" style={{ color: "var(--asc-muted)" }}>
            Start with 3 - small wins compound.
          </div>
          <TealButton className="mt-4">Choose Habits</TealButton>
        </Card>
      </div>
    );

  return (
    <div className="px-4 pb-32 pt-2 space-y-4">
      <SegmentControl<Sub> options={["Habits", "Mindfulness", "Learning", "Journal", "Time"]} value={sub} onChange={setSub} />
      {sub === "Habits" && <HabitsView />}
      {sub === "Mindfulness" && <MindfulnessView />}
      {sub === "Learning" && <LearningView />}
      {sub === "Journal" && <JournalView />}
      {sub === "Time" && <TimeView />}
    </div>
  );
}

function HabitsView() {
  const [habits, setHabits] = useState(M.habits);
  const toggle = (i: number) => {
    setHabits((h) => h.map((x, idx) => (idx === i ? { ...x, done: true, streak: x.streak + (x.done ? 0 : 1) } : x)));
    toast.success("Habit checked");
  };
  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Today
        </div>
        <div className="space-y-2">
          {habits.map((h, i) => (
            <div key={h.name} className="p-3 asc-surface rounded-xl flex items-center gap-3">
              <div className="text-2xl">{h.emoji}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{h.name}</div>
                <div className="text-[10px] asc-num flex items-center gap-1" style={{ color: "var(--asc-muted)" }}>
                  Streak: {h.streak}
                  {h.streak >= 14 && <Flame size={10} style={{ color: "var(--asc-amber)" }} />}
                </div>
              </div>
              {h.done ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "var(--asc-teal)" }}
                >
                  <Check size={14} color="#062520" />
                </motion.div>
              ) : (
                <button onClick={() => toggle(i)} className="text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
                  Mark Done
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-start gap-2">
          <Sparkles size={14} style={{ color: "var(--asc-teal)" }} className="mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold mb-0.5">Habit Insight</div>
            <div style={{ color: "var(--asc-muted)" }}>
              Your readiness averages 82 on days you do cold exposure vs 67 on days you skip it.
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

function MindfulnessView() {
  const [breath, setBreath] = useState(false);
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(4);
  const sessions = [
    { name: "Breathwork", icon: Wind, color: "var(--asc-teal)" },
    { name: "Focus", icon: Brain, color: "var(--asc-amber)" },
    { name: "Sleep Prep", icon: Moon, color: "#7c5cff" },
    { name: "HRV Biofeedback", icon: Activity, color: "var(--asc-coral)" },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {sessions.map((s) => (
          <Card key={s.name} onClick={() => s.name === "Breathwork" ? setBreath(true) : toast(s.name + " starting")}>
            <s.icon size={24} style={{ color: s.color }} />
            <div className="text-sm font-semibold mt-3">{s.name}</div>
            <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
              {s.name === "Breathwork" ? "4-1-4 box" : s.name === "Focus" ? "20 min flow" : s.name === "Sleep Prep" ? "Wind down" : "Live coherence"}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Morning Check-in
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Mood</span>
              <span className="asc-num">{mood}/10</span>
            </div>
            <input type="range" min={1} max={10} value={mood} onChange={(e) => setMood(+e.target.value)} className="w-full" style={{ accentColor: "var(--asc-teal)" }} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Stress</span>
              <span className="asc-num">{stress}/10</span>
            </div>
            <input type="range" min={1} max={10} value={stress} onChange={(e) => setStress(+e.target.value)} className="w-full" style={{ accentColor: "var(--asc-amber)" }} />
          </div>
        </div>
        <TealButton className="w-full mt-3" onClick={() => toast.success("Check-in saved")}>
          Save
        </TealButton>
      </Card>
      <AnimatePresence>{breath && <BreathingScreen onClose={() => setBreath(false)} />}</AnimatePresence>
    </>
  );
}

function BreathingScreen({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [sec, setSec] = useState(180);
  useEffect(() => {
    const cycle = setInterval(() => {
      setPhase((p) => (p === "in" ? "hold" : p === "hold" ? "out" : "in"));
    }, 3000);
    const tick = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => {
      clearInterval(cycle);
      clearInterval(tick);
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="ascend-fullscreen fixed inset-0 z-[110] flex flex-col items-center justify-center"
      style={{ background: "var(--asc-base)" }}
    >
      <motion.div
        animate={{ scale: phase === "in" ? 1.4 : phase === "hold" ? 1.4 : 0.9 }}
        transition={{ duration: phase === "hold" ? 1 : 4, ease: "easeInOut" }}
        className="w-60 h-60 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, color-mix(in oklab, var(--asc-teal) 30%, transparent), transparent 70%)",
          border: "2px solid var(--asc-teal)",
        }}
      >
        <div className="text-center">
          <div className="asc-display text-3xl uppercase">{phase === "in" ? "Inhale" : phase === "hold" ? "Hold" : "Exhale"}</div>
          <div className="asc-num text-xs mt-1" style={{ color: "var(--asc-muted)" }}>
            {phase === "in" ? "4s" : phase === "hold" ? "1s" : "4s"}
          </div>
        </div>
      </motion.div>
      <div className="asc-num text-2xl mt-8">
        {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, "0")}
      </div>
      <GhostButton className="mt-6" onClick={onClose}>
        Stop
      </GhostButton>
    </motion.div>
  );
}

function LearningView() {
  const [detail, setDetail] = useState<number | null>(null);
  const [cards, setCards] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);

  const review = (good: boolean) => {
    toast(good ? "Remembered ✓" : "Review again");
    setCardIdx((i) => (i + 1) % M.flashcards.length);
  };

  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Active
        </div>
        <div className="space-y-2">
          {M.learning.map((l, i) => (
            <div key={l.name} onClick={() => setDetail(i)} className="p-3 asc-surface rounded-xl cursor-pointer">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{l.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                    {l.type} • {l.logged}
                  </div>
                </div>
                <BookOpen size={16} style={{ color: "var(--asc-muted)" }} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ProgressBar pct={l.pct} />
                <span className="asc-num text-[11px]">{l.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex justify-between mb-2">
          <span className="text-xs" style={{ color: "var(--asc-muted)" }}>
            Weekly Learning Hours
          </span>
          <span className="asc-num font-bold">6.5 / 8h</span>
        </div>
        <ProgressBar pct={(6.5 / 8) * 100} />
      </Card>

      <AnimatePresence>
        {detail !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setDetail(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full asc-card rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto asc-scroll"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="asc-display">{M.learning[detail].name}</div>
              <div className="text-[11px] mb-3" style={{ color: "var(--asc-muted)" }}>
                Notes
              </div>
              <textarea rows={5} className="w-full" defaultValue="Greene's pattern of using mentors and patrons. The 48 laws read like a survival manual." />
              <TealButton
                className="w-full mt-3"
                onClick={() => {
                  setGenLoading(true);
                  setTimeout(() => {
                    setGenLoading(false);
                    setCards(true);
                    setDetail(null);
                  }, 2000);
                }}
              >
                {genLoading ? "Generating..." : "Generate Flashcards"}
              </TealButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)" }}
          >
            <motion.div
              key={cardIdx}
              initial={{ x: 0, scale: 0.95, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1 }}
              className="w-full max-w-sm asc-card p-8 text-center"
            >
              <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
                Card {cardIdx + 1}/{M.flashcards.length}
              </div>
              <div className="asc-display text-lg my-4">{M.flashcards[cardIdx].q}</div>
              <div className="text-sm" style={{ color: "var(--asc-teal)" }}>
                {M.flashcards[cardIdx].a}
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => review(false)}
                  className="flex-1 py-2 rounded-xl font-semibold text-xs"
                  style={{ background: "color-mix(in oklab, var(--asc-coral) 20%, transparent)", color: "var(--asc-coral)" }}
                >
                  Review
                </button>
                <button
                  onClick={() => review(true)}
                  className="flex-1 py-2 rounded-xl font-semibold text-xs"
                  style={{ background: "var(--asc-teal)", color: "#062520" }}
                >
                  Got it
                </button>
              </div>
              <button onClick={() => setCards(false)} className="mt-3 text-xs" style={{ color: "var(--asc-muted)" }}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function JournalView() {
  const [editor, setEditor] = useState(false);
  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--asc-muted)" }}>
          Today's Prompt
        </div>
        <div className="text-sm italic">"What's the one decision you've been avoiding that would move your life forward most?"</div>
        <TealButton className="w-full mt-3" onClick={() => setEditor(true)}>
          Start Entry
        </TealButton>
      </Card>
      <Card>
        <div className="flex justify-between mb-3 items-center">
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Past Entries
          </div>
          <Search size={14} style={{ color: "var(--asc-muted)" }} />
        </div>
        <div className="space-y-2">
          {M.journalEntries.map((j) => (
            <div key={j.date} className="p-3 asc-surface rounded-xl flex items-start gap-2">
              <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: j.mood }} />
              <div className="flex-1">
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  {j.date}
                </div>
                <div className="text-xs mt-0.5">{j.first}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <AnimatePresence>
        {editor && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="ascend-fullscreen fixed inset-0 z-[110] flex flex-col p-5"
            style={{ background: "var(--asc-base)" }}
          >
            <div className="flex justify-between mb-3">
              <button onClick={() => setEditor(false)} className="text-xs">Cancel</button>
              <button
                onClick={() => {
                  setEditor(false);
                  toast.success("Entry saved");
                }}
                className="text-xs font-semibold"
                style={{ color: "var(--asc-teal)" }}
              >
                Save
              </button>
            </div>
            <textarea
              autoFocus
              rows={14}
              placeholder="Start writing..."
              className="w-full flex-1 !bg-transparent !border-0 text-base resize-none"
            />
            <div className="flex justify-between text-xs items-center mt-3">
              <span>Coach Visible</span>
              <div className="w-9 h-5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="w-4 h-4 rounded-full mt-0.5 ml-0.5" style={{ background: "white" }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TimeView() {
  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Today
        </div>
        <div className="space-y-1.5">
          {M.timeBlocks.map((b) => (
            <div key={b.time} className="flex items-center gap-3 p-2 asc-surface rounded-lg">
              <div className="asc-num text-[11px] w-16" style={{ color: "var(--asc-muted)" }}>
                {b.time}
              </div>
              <div className="w-1 self-stretch rounded-full" style={{ background: b.color }} />
              <div className="text-sm font-semibold">{b.label}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Yesterday's Time
        </div>
        <PieChart data={M.timePie} />
      </Card>
      <Card>
        <div className="flex items-start gap-2">
          <Sparkles size={14} style={{ color: "var(--asc-teal)" }} className="mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold mb-0.5">Yesterday in Review</div>
            <div style={{ color: "var(--asc-muted)" }}>
              You hit your deep work target and trained. Two unplanned meetings cut into your afternoon block. Consider batching calls before noon tomorrow.
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

function PieChart({ data }: { data: { label: string; hours: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.hours, 0);
  let cum = 0;
  const R = 50;
  return (
    <div className="flex gap-4 items-center">
      <svg viewBox="0 0 120 120" width={120} height={120}>
        {data.map((d, i) => {
          const start = (cum / total) * 2 * Math.PI;
          cum += d.hours;
          const end = (cum / total) * 2 * Math.PI;
          const x1 = 60 + R * Math.cos(start - Math.PI / 2);
          const y1 = 60 + R * Math.sin(start - Math.PI / 2);
          const x2 = 60 + R * Math.cos(end - Math.PI / 2);
          const y2 = 60 + R * Math.sin(end - Math.PI / 2);
          const large = end - start > Math.PI ? 1 : 0;
          return (
            <path
              key={i}
              d={`M 60 60 L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={d.color}
              stroke="var(--asc-card)"
              strokeWidth={1}
            />
          );
        })}
      </svg>
      <div className="flex-1 space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-[11px]">
            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span>{d.label}</span>
            <span className="ml-auto asc-num">{d.hours}h</span>
          </div>
        ))}
      </div>
    </div>
  );
}
