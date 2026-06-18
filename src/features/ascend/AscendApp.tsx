import { AnimatePresence, motion } from "framer-motion";
import { useReducer, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Home, Dumbbell, Sparkles, Leaf, Briefcase, MessageCircle, Plus, X,
  Camera, Scale, User, Shirt, CheckSquare, ListTodo, DollarSign,
} from "lucide-react";
import "./theme.css";
import { TodayTab } from "./tabs/TodayTab";
import { FitnessTab } from "./tabs/FitnessTab";
import { LooksTab } from "./tabs/LooksTab";
import { LifeTab } from "./tabs/LifeTab";
import { BusinessTab } from "./tabs/BusinessTab";
import { CoachTab } from "./tabs/CoachTab";
import * as M from "./mockData";

const tabs = [
  { key: "today", label: "Today", icon: Home },
  { key: "fitness", label: "Fitness", icon: Dumbbell },
  { key: "looks", label: "Looks", icon: Sparkles },
  { key: "life", label: "Life", icon: Leaf },
  { key: "business", label: "Business", icon: Briefcase },
  { key: "coach", label: "Coach", icon: MessageCircle },
] as const;

type TabKey = (typeof tabs)[number]["key"];

type State = { tab: TabKey; prev: TabKey; workoutOpen: boolean; scannerOpen: boolean };
type Action =
  | { type: "set"; tab: TabKey }
  | { type: "workout"; open: boolean }
  | { type: "scanner"; open: boolean };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "set":
      return { ...s, prev: s.tab, tab: a.tab };
    case "workout":
      return { ...s, workoutOpen: a.open };
    case "scanner":
      return { ...s, scannerOpen: a.open };
  }
}

const fabIconMap: Record<string, typeof Camera> = {
  Camera, Dumbbell, Scale, User, Shirt, CheckSquare, ListTodo, DollarSign,
};

export function AscendApp() {
  const [s, dispatch] = useReducer(reducer, { tab: "today", prev: "today", workoutOpen: false, scannerOpen: false });
  const [fabOpen, setFabOpen] = useState(false);
  const [dataMode, setDataMode] = useState<"mock" | "empty">("mock");
  const [loading, setLoading] = useState(false);

  const idx = tabs.findIndex((t) => t.key === s.tab);
  const prevIdx = tabs.findIndex((t) => t.key === s.prev);
  const dir = idx >= prevIdx ? 1 : -1;
  const empty = dataMode === "empty";

  return (
    <div className="ascend-root ascend-fullscreen fixed inset-0 z-40 overflow-hidden flex flex-col" style={{ background: "var(--asc-base)" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Dev toggles */}
      <div className="flex justify-center gap-2 px-4 pt-2 text-[10px]">
        <button
          onClick={() => setDataMode((m) => (m === "mock" ? "empty" : "mock"))}
          className="px-2 py-1 rounded-full"
          style={{ background: "var(--asc-surface)", color: "var(--asc-muted)" }}
        >
          Data: <span style={{ color: "var(--asc-teal)" }}>{dataMode}</span>
        </button>
        <button
          onClick={() => setLoading((l) => !l)}
          className="px-2 py-1 rounded-full"
          style={{ background: "var(--asc-surface)", color: "var(--asc-muted)" }}
        >
          Loading: <span style={{ color: "var(--asc-teal)" }}>{loading ? "on" : "off"}</span>
        </button>
        <a href="/" className="px-2 py-1 rounded-full" style={{ background: "var(--asc-surface)", color: "var(--asc-muted)" }}>
          Exit
        </a>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto asc-scroll relative">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={s.tab}
            custom={dir}
            initial={{ x: dir * 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -dir * 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {s.tab === "today" && (
              <TodayTab
                empty={empty}
                loading={loading}
                onNavigate={(t) => dispatch({ type: "set", tab: (tabs.find((x) => x.key === t)?.key ?? "today") as TabKey })}
                onStartWorkout={() => dispatch({ type: "workout", open: true })}
              />
            )}
            {s.tab === "fitness" && (
              <FitnessTab
                empty={empty}
                loading={loading}
                workoutOpen={s.workoutOpen}
                setWorkoutOpen={(v) => dispatch({ type: "workout", open: v })}
                scannerOpen={s.scannerOpen}
                setScannerOpen={(v) => dispatch({ type: "scanner", open: v })}
              />
            )}
            {s.tab === "looks" && <LooksTab empty={empty} loading={loading} />}
            {s.tab === "life" && <LifeTab empty={empty} loading={loading} />}
            {s.tab === "business" && <BusinessTab empty={empty} loading={loading} />}
            {s.tab === "coach" && <CoachTab empty={empty} loading={loading} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FAB */}
      {!s.workoutOpen && !s.scannerOpen && (
        <div className="absolute right-4 bottom-24 z-50 flex flex-col items-end gap-2">
          <AnimatePresence>
            {fabOpen &&
              M.fabActions.map((a, i) => {
                const Icon = fabIconMap[a.icon] ?? Plus;
                return (
                  <motion.button
                    key={a.label}
                    initial={{ opacity: 0, y: 12, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.7 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      setFabOpen(false);
                      if (a.label === "Scan Food") dispatch({ type: "scanner", open: true });
                      else if (a.label === "Log Workout") dispatch({ type: "workout", open: true });
                      else toast.success(`${a.label} — Logged!`);
                    }}
                    className="flex items-center gap-2 px-3 py-2 asc-card text-xs font-semibold"
                  >
                    <Icon size={14} style={{ color: "var(--asc-teal)" }} />
                    {a.label}
                  </motion.button>
                );
              })}
          </AnimatePresence>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setFabOpen((v) => !v)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{ background: "var(--asc-teal)", color: "#062520", boxShadow: "0 8px 24px color-mix(in oklab, var(--asc-teal) 40%, transparent)" }}
          >
            <motion.div animate={{ rotate: fabOpen ? 45 : 0 }}>
              <Plus size={26} />
            </motion.div>
          </motion.button>
        </div>
      )}

      {/* Bottom tab bar */}
      {!s.workoutOpen && !s.scannerOpen && (
        <div
          className="z-40 backdrop-blur-xl px-2 py-2 flex justify-around"
          style={{ background: "rgba(19,23,28,0.85)", borderTop: "1px solid var(--asc-border)" }}
        >
          {tabs.map((t) => {
            const active = t.key === s.tab;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => dispatch({ type: "set", tab: t.key })}
                className="flex flex-col items-center gap-0.5 px-2 py-1 active:scale-95 transition-transform"
              >
                <Icon size={20} style={{ color: active ? "var(--asc-teal)" : "var(--asc-muted)" }} />
                {active && <div className="text-[9px] font-semibold" style={{ color: "var(--asc-teal)" }}>{t.label}</div>}
              </button>
            );
          })}
        </div>
      )}

      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "var(--asc-card)",
            color: "var(--asc-text)",
            border: "1px solid var(--asc-border)",
          },
        }}
      />
    </div>
  );
}
