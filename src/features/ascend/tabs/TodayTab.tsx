import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Bell, Dumbbell, Flame, MessageCircle, MoreVertical, Trophy, Users, Shirt, ChevronRight } from "lucide-react";
import { Ring, Card, Pill, TealButton, ProgressBar } from "../components/primitives";
import * as M from "../mockData";

export function TodayTab({
  empty,
  loading,
  onNavigate,
  onStartWorkout,
}: {
  empty: boolean;
  loading: boolean;
  onNavigate: (tab: string) => void;
  onStartWorkout: () => void;
}) {
  const [showNotif, setShowNotif] = useState(false);

  if (loading) {
    return (
      <div className="px-4 pb-32 pt-2 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="asc-shimmer rounded-2xl" style={{ height: i === 0 ? 320 : 140 }} />
        ))}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="px-4 pb-32 pt-2 space-y-4">
        <Hero showNotif={showNotif} setShowNotif={setShowNotif} />
        <Card className="text-center py-12">
          <div className="text-5xl mb-3">🏔️</div>
          <div className="asc-display text-lg mb-1">Your climb starts here</div>
          <div className="text-sm" style={{ color: "var(--asc-muted)" }}>
            Complete onboarding to populate your Ascend Index.
          </div>
          <TealButton className="mt-4">Begin Onboarding</TealButton>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 pb-32 pt-2 space-y-4">
      <Hero showNotif={showNotif} setShowNotif={setShowNotif} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="flex flex-col items-center py-6">
          <Ring size={280} stroke={14} pct={M.ascendIndex.total / 1000} color="var(--asc-teal)">
            <div className="text-center">
              <div className="asc-display text-[72px] leading-none">{M.ascendIndex.total}</div>
              <div className="text-xs mt-2" style={{ color: "var(--asc-muted)" }}>
                ASCEND INDEX
              </div>
            </div>
          </Ring>
          <div className="mt-4 asc-num font-semibold" style={{ color: "var(--asc-teal)" }}>
            +{M.ascendIndex.delta} today
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--asc-muted)" }}>
            Weakest: <span style={{ color: "var(--asc-coral)" }}>{M.ascendIndex.weakest}</span>
          </div>
          <div className="flex gap-4 mt-5">
            {M.ascendIndex.pillars.map((p) => (
              <div key={p.key} className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <Card>
          <div className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Six Pillars
          </div>
          <div className="grid grid-cols-3 gap-3">
            {M.ascendIndex.pillars.map((p, i) => (
              <button
                key={p.key}
                onClick={() => onNavigate(p.key === "status" || p.key === "coach" ? "coach" : p.key)}
                className="flex flex-col items-center py-2 rounded-xl active:scale-95 transition-transform"
              >
                <Ring size={72} stroke={5} pct={p.score / 100} color={p.color} delay={i * 0.1}>
                  <span className="asc-num font-bold text-base">{p.score}</span>
                </Ring>
                <div className="text-[11px] mt-1.5 font-medium">{p.label}</div>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
                Today's Workout
              </div>
              <div className="asc-display text-lg mt-1">{M.workouts[0].name}</div>
              <div className="text-xs mt-1" style={{ color: "var(--asc-muted)" }}>
                {M.workouts[0].duration} • {M.workouts[0].focus}
              </div>
              <div className="flex gap-2 mt-2">
                {M.workouts[0].tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </div>
            <button>
              <MoreVertical size={18} style={{ color: "var(--asc-muted)" }} />
            </button>
          </div>
          <TealButton className="w-full mt-4" onClick={onStartWorkout}>
            <Dumbbell size={16} /> Start Workout
          </TealButton>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card>
          <div className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Macro Budget
          </div>
          <div className="space-y-3">
            {(Object.entries(M.macros) as [string, typeof M.macros.protein][]).map(([k, v]) => {
              const pct = (v.current / v.target) * 100;
              return (
                <div key={k} className="flex items-center gap-3">
                  <div className="w-14 text-xs capitalize" style={{ color: "var(--asc-muted)" }}>
                    {k}
                  </div>
                  <div className="flex-1">
                    <ProgressBar pct={pct} />
                  </div>
                  <div className="w-24 text-right asc-num text-xs">
                    {v.current}/{v.target}
                    {v.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
              Readiness
            </div>
            <div
              className="px-3 py-1 rounded-full asc-num font-bold text-sm"
              style={{ background: "color-mix(in oklab, var(--asc-teal) 20%, transparent)", color: "var(--asc-teal)" }}
            >
              {M.readiness.score}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["HRV", M.readiness.hrv],
              ["Sleep", M.readiness.sleep],
              ["Soreness", M.readiness.soreness],
              ["Load", M.readiness.load],
            ].map(([n, v]) => (
              <div key={n as string}>
                <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--asc-muted)" }}>
                  <span>{n}</span>
                  <span className="asc-num">{v}</span>
                </div>
                <ProgressBar pct={v as number} />
              </div>
            ))}
          </div>
          <div className="text-xs mt-3 italic" style={{ color: "var(--asc-teal)" }}>
            {M.readiness.rec}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <div className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Streaks
          </div>
          <div className="flex justify-between">
            {M.habits.slice(0, 5).map((h) => (
              <div key={h.name} className="flex flex-col items-center gap-1">
                <div className="text-2xl">{h.emoji}</div>
                <div className="asc-num text-xs font-semibold flex items-center gap-0.5">
                  {h.streak}
                  {h.streak >= 14 && <Flame size={10} style={{ color: "var(--asc-amber)" }} />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <Card>
          <div className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Style of the Day
          </div>
          <div className="aspect-[4/3] rounded-xl mb-3 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
          <div className="text-sm font-medium">{M.styleToday.outfit}</div>
          <div className="flex gap-2 mt-2">
            <Pill color="var(--asc-amber)">{M.styleToday.weather}</Pill>
            <Pill color="var(--asc-muted)">{M.styleToday.calendar}</Pill>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <Card>
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center asc-num font-bold text-sm"
              style={{ background: "var(--asc-teal)", color: "#062520" }}
            >
              {M.coachNote.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{M.coachNote.coach}</div>
                  <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                    {M.coachNote.role}
                  </div>
                </div>
                <button className="text-xs flex items-center gap-1" style={{ color: "var(--asc-teal)" }}>
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <div className="text-sm mt-2 leading-snug">{M.coachNote.note}</div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        <Card>
          <div className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Tomorrow
          </div>
          <div className="flex gap-3">
            {M.tomorrow.map((t, i) => {
              const Icon = t.icon === "Dumbbell" ? Dumbbell : t.icon === "Users" ? Users : Shirt;
              return (
                <div key={i} className="flex-1 asc-surface rounded-xl p-3 text-center">
                  <Icon size={18} style={{ color: "var(--asc-teal)" }} className="mx-auto mb-2" />
                  <div className="text-[11px]">{t.label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );

  function Hero({ showNotif, setShowNotif }: { showNotif: boolean; setShowNotif: (v: boolean) => void }) {
    return (
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="asc-display text-lg tracking-widest" style={{ color: "var(--asc-teal)" }}>
          ASCEND
        </div>
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="relative p-2">
            <Bell size={20} />
            <span
              className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
              style={{ background: "var(--asc-coral)", color: "white" }}
            >
              3
            </span>
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="absolute right-0 top-12 w-72 asc-card p-2 z-50 space-y-1"
              >
                {M.notifications.map((n, i) => {
                  const Icon = n.icon === "MessageCircle" ? MessageCircle : n.icon === "Trophy" ? Trophy : Flame;
                  return (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                      <Icon size={16} style={{ color: "var(--asc-teal)" }} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs">{n.text}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--asc-muted)" }}>
                          {n.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
}
