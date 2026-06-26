import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Send, Mic, Paperclip, Check, Trophy, Utensils, Image, MessageCircle, Heart, Play } from "lucide-react";
import { toast } from "sonner";
import { Card, Pill, TealButton, GhostButton, SegmentControl, ProgressBar } from "../components/primitives";
import * as M from "../mockData";

type Sub = "Messages" | "Check-in" | "Reviews";

export function CoachTab({ empty, loading }: { empty: boolean; loading: boolean }) {
  const [sub, setSub] = useState<Sub>("Messages");

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
          <div className="text-4xl mb-3">🧑‍🏫</div>
          <div className="asc-display">No coach assigned yet</div>
          <div className="text-sm mt-1" style={{ color: "var(--asc-muted)" }}>
            Pick a coach to start your journey.
          </div>
          <TealButton className="mt-4">Browse Coaches</TealButton>
        </Card>
      </div>
    );

  return (
    <div className="px-4 pb-32 pt-2 space-y-4">
      <SegmentControl<Sub> options={["Messages", "Check-in", "Reviews"]} value={sub} onChange={setSub} />
      {sub === "Messages" && <MessagesView />}
      {sub === "Check-in" && <CheckInView />}
      {sub === "Reviews" && <ReviewsView />}
    </div>
  );
}

function MessagesView() {
  const [thread, setThread] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!thread) return;
    setTyping(false);
    const t = setTimeout(() => setTyping(true), 2000);
    const t2 = setTimeout(() => setTyping(false), 5000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [thread]);

  if (thread) {
    const coach = M.coaches.find((c) => c.id === thread)!;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setThread(null)} className="text-xs" style={{ color: "var(--asc-teal)" }}>
            ← Back
          </button>
          <div className="w-9 h-9 rounded-full asc-num font-bold flex items-center justify-center text-xs" style={{ background: "var(--asc-teal)", color: "#062520" }}>
            {coach.initials}
          </div>
          <div>
            <div className="text-sm font-semibold">{coach.name}</div>
            <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
              {coach.role}
            </div>
          </div>
        </div>
        <div className="text-[10px] px-2 py-1 rounded asc-surface" style={{ color: "var(--asc-muted)" }}>
          {coach.avail}
        </div>
        <div className="space-y-2 min-h-[400px]">
          {coach.messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[75%] p-2.5 rounded-2xl text-sm"
                style={{
                  background: m.from === "me" ? "var(--asc-teal)" : "var(--asc-card)",
                  color: m.from === "me" ? "#062520" : "var(--asc-text)",
                  border: m.from === "me" ? "none" : "1px solid var(--asc-border)",
                }}
              >
                {m.text}
                <div className="text-[9px] mt-1 opacity-60">{m.time}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="asc-card px-3 py-2 rounded-2xl flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--asc-muted)" }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 asc-card p-2">
          <button className="p-1">
            <Paperclip size={16} style={{ color: "var(--asc-muted)" }} />
          </button>
          <input className="flex-1 !border-0 !bg-transparent" placeholder="Message..." />
          <button className="p-1">
            <Mic size={16} style={{ color: "var(--asc-muted)" }} />
          </button>
          <button onClick={() => toast.success("Sent")} className="p-2 rounded-lg" style={{ background: "var(--asc-teal)" }}>
            <Send size={14} color="#062520" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Coaches
        </div>
        <div className="space-y-2">
          {M.coaches.map((c) => (
            <button key={c.id} onClick={() => setThread(c.id)} className="w-full flex items-center gap-3 p-3 asc-surface rounded-xl text-left">
              <div className="w-10 h-10 rounded-full asc-num font-bold flex items-center justify-center text-xs" style={{ background: "var(--asc-teal)", color: "#062520" }}>
                {c.initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  {c.role}
                </div>
              </div>
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--asc-teal)" }} />
            </button>
          ))}
        </div>
      </Card>
      <Challenges />
      <Community />
    </>
  );
}

function CheckInView() {
  const [sheet, setSheet] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const submit = () => {
    setDone(true);
    setTimeout(() => {
      setSheet(false);
      setStep(0);
      setDone(false);
      toast.success("Check-in submitted");
    }, 1500);
  };

  return (
    <>
      <Card>
        <div className="text-xs uppercase" style={{ color: "var(--asc-muted)" }}>
          Status
        </div>
        <div className="asc-display text-xl mt-1" style={{ color: "var(--asc-amber)" }}>
          {M.checkIn.status}
        </div>
        <TealButton className="w-full mt-3" onClick={() => setSheet(true)}>
          Start This Week's Check-in
        </TealButton>
      </Card>

      <Card onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs uppercase" style={{ color: "var(--asc-muted)" }}>
              Last Check-in
            </div>
            <div className="text-sm font-semibold mt-0.5">{M.checkIn.last.daysAgo} days ago</div>
          </div>
          <div className="text-xs" style={{ color: "var(--asc-teal)" }}>
            {expanded ? "Collapse" : "Expand"}
          </div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4">
              <div className="text-[11px] uppercase mb-2" style={{ color: "var(--asc-muted)" }}>
                Adherence
              </div>
              <div className="space-y-2">
                {Object.entries(M.checkIn.last.adherence).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-[11px] capitalize">
                      <span>{k}</span>
                      <span className="asc-num">{v}%</span>
                    </div>
                    <ProgressBar pct={v as number} />
                  </div>
                ))}
              </div>
              <div className="text-[11px] uppercase mt-4 mb-2" style={{ color: "var(--asc-muted)" }}>
                Wellbeing
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {M.checkIn.last.wellbeing.map((w) => (
                  <div key={w.name} className="flex justify-between p-2 asc-surface rounded-lg text-[11px]">
                    <span>{w.name}</span>
                    <span className="asc-num font-semibold">{w.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl" style={{ background: "color-mix(in oklab, var(--asc-teal) 12%, transparent)" }}>
                <div className="text-[10px] uppercase mb-1" style={{ color: "var(--asc-teal)" }}>
                  Coach Response
                </div>
                <div className="text-xs">{M.checkIn.last.coachResponse}</div>
                <div className="mt-2 text-[11px] font-semibold p-2 rounded-lg" style={{ background: "var(--asc-card)", color: "var(--asc-teal)" }}>
                  → {M.checkIn.last.update}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <AnimatePresence>
        {sheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setSheet(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full asc-card rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto asc-scroll" onClick={(e) => e.stopPropagation()}>
              {done ? (
                <div className="py-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: "var(--asc-teal)" }}>
                    <Check size={36} color="#062520" />
                  </motion.div>
                  <div className="asc-display mt-4">Submitted</div>
                  <div className="text-xs mt-1" style={{ color: "var(--asc-muted)" }}>
                    Awaiting coach review
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between mb-3">
                    <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
                      Step {step + 1} of 4
                    </div>
                  </div>
                  <ProgressBar pct={((step + 1) / 4) * 100} />
                  <div className="mt-4">
                    {step === 0 && (
                      <>
                        <div className="asc-display mb-3">Body</div>
                        <div className="space-y-3">
                          <input defaultValue="182" placeholder="Weight (lb)" />
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="aspect-[3/4] bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-lg" />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <div className="asc-display mb-3">Adherence</div>
                        {["Training", "Nutrition", "Sleep", "Habits"].map((n, i) => (
                          <div key={n} className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{n}</span>
                              <span className="asc-num">{[95, 88, 82, 91][i]}%</span>
                            </div>
                            <input type="range" defaultValue={[95, 88, 82, 91][i]} max={100} className="w-full" style={{ accentColor: "var(--asc-teal)" }} />
                          </div>
                        ))}
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <div className="asc-display mb-3">Wellbeing</div>
                        {M.checkIn.last.wellbeing.map((w) => (
                          <div key={w.name} className="flex justify-between items-center mb-2 p-2 asc-surface rounded-lg text-xs">
                            <span>{w.name}</span>
                            <input type="range" defaultValue={w.value} max={10} className="w-32" style={{ accentColor: "var(--asc-teal)" }} />
                          </div>
                        ))}
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <div className="asc-display mb-3">Reflection</div>
                        <textarea rows={3} placeholder="What went well?" className="w-full mb-2" />
                        <textarea rows={3} placeholder="What's getting in the way?" className="w-full mb-2" />
                        <textarea rows={2} placeholder="One question for your coach?" className="w-full" />
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {step > 0 && (
                      <GhostButton className="flex-1" onClick={() => setStep(step - 1)}>
                        Back
                      </GhostButton>
                    )}
                    {step < 3 ? (
                      <TealButton className="flex-1" onClick={() => setStep(step + 1)}>
                        Next
                      </TealButton>
                    ) : (
                      <TealButton className="flex-1" onClick={submit}>
                        Submit
                      </TealButton>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ReviewsView() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Form Reviews
        </div>
        <div className="grid grid-cols-3 gap-2">
          {M.reviews.map((r, i) => (
            <button key={i} onClick={() => r.status === "Reviewed" && setOpen(i)} className="asc-surface rounded-xl overflow-hidden text-left">
              <div className="aspect-square bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                <Play size={20} style={{ color: "var(--asc-teal)" }} />
              </div>
              <div className="p-2">
                <div className="text-[11px] font-semibold truncate">{r.exercise}</div>
                <div className="flex justify-between text-[9px] mt-0.5">
                  <span style={{ color: "var(--asc-muted)" }}>{r.date}</span>
                  <Pill color={r.status === "Reviewed" ? "var(--asc-teal)" : "var(--asc-amber)"}>{r.status}</Pill>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] p-4 flex items-center" style={{ background: "rgba(0,0,0,0.8)" }} onClick={() => setOpen(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full asc-card p-4" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={36} style={{ color: "var(--asc-teal)" }} />
                  </div>
                  <div className="absolute w-8 h-8 rounded-full border-2" style={{ borderColor: "var(--asc-coral)", top: "30%", left: "40%" }} />
                  <div className="absolute w-6 h-6 rounded-full border-2" style={{ borderColor: "var(--asc-amber)", top: "60%", left: "55%" }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase mb-2" style={{ color: "var(--asc-muted)" }}>
                    Coach Annotations
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {[
                      ["0:04", "Bar path drifting forward - pull elbows tighter"],
                      ["0:08", "Hip rise too early - pause and lead with chest"],
                      ["0:12", "Lockout looks strong, great finish"],
                    ].map(([t, n]) => (
                      <div key={t} className="p-2 asc-surface rounded-lg">
                        <div className="asc-num" style={{ color: "var(--asc-teal)" }}>
                          {t}
                        </div>
                        <div>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <TealButton className="w-full mt-3" onClick={() => toast("Playing annotated video")}>
                Play Annotated Video
              </TealButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Challenges() {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
        Challenges
      </div>
      <div className="space-y-2">
        {M.challenges.map((c, i) => (
          <div key={i} className="p-3 asc-surface rounded-xl">
            <div className="text-sm font-semibold">{c.name}</div>
            {"day" in c ? (
              <div className="flex justify-between text-[11px] mt-1" style={{ color: "var(--asc-muted)" }}>
                <span>Day {c.day}</span>
                <span style={{ color: "var(--asc-teal)" }}>Rank {c.rank} of {c.of}</span>
              </div>
            ) : (
              <div className="flex justify-between text-[11px] mt-1" style={{ color: "var(--asc-muted)" }}>
                <span>Current: {c.current}</span>
                <span style={{ color: "var(--asc-amber)" }}>Target: {c.target}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Community() {
  const iconMap: Record<string, typeof Trophy> = { Trophy, Utensils, Image, MessageCircle };
  return (
    <Card>
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
        Community
      </div>
      <div className="space-y-2">
        {M.community.map((p, i) => {
          const Icon = iconMap[p.icon] ?? MessageCircle;
          return (
            <div key={i} className="p-3 asc-surface rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color: "var(--asc-teal)" }} />
                <span className="text-xs font-semibold">{p.user}</span>
              </div>
              <div className="text-xs" style={{ color: "var(--asc-text)" }}>
                {p.text}
              </div>
              <div className="flex gap-3 mt-2 text-[10px]" style={{ color: "var(--asc-muted)" }}>
                <span className="flex items-center gap-1">
                  <Heart size={10} /> {p.reacts}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={10} /> {p.comments}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
