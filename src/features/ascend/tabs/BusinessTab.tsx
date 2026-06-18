import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, X, AlertTriangle, Sparkles, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, Pill, TealButton, GhostButton, SegmentControl, ProgressBar, Ring } from "../components/primitives";
import * as M from "../mockData";

type Sub = "Finance" | "Deals" | "Tasks" | "Network" | "Goals";

export function BusinessTab({ empty, loading }: { empty: boolean; loading: boolean }) {
  const [sub, setSub] = useState<Sub>("Finance");

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
          <div className="text-4xl mb-3">💼</div>
          <div className="asc-display">Connect your business</div>
          <div className="text-sm mt-1" style={{ color: "var(--asc-muted)" }}>
            Link Stripe and start tracking revenue.
          </div>
          <TealButton className="mt-4">Connect Stripe</TealButton>
        </Card>
      </div>
    );

  return (
    <div className="px-4 pb-32 pt-2 space-y-4">
      <SegmentControl<Sub> options={["Finance", "Deals", "Tasks", "Network", "Goals"]} value={sub} onChange={setSub} />
      {sub === "Finance" && <FinanceView />}
      {sub === "Deals" && <DealsView />}
      {sub === "Tasks" && <TasksView />}
      {sub === "Network" && <NetworkView />}
      {sub === "Goals" && <GoalsView />}
    </div>
  );
}

function FinanceView() {
  const fin = M.financialSnapshot;
  const max = Math.max(...fin.mrrSeries);
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "MRR", value: `$${(fin.mrr.value / 1000).toFixed(1)}k`, delta: fin.mrr.delta, color: "var(--asc-teal)" },
          { label: "Cash", value: `$${(fin.cash.value / 1000).toFixed(0)}k`, delta: fin.cash.runway, color: "var(--asc-amber)" },
          { label: "Net Worth", value: `$${(fin.netWorth.value / 1000).toFixed(0)}k`, delta: fin.netWorth.delta, color: "var(--asc-teal)" },
        ].map((m) => (
          <Card key={m.label}>
            <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
              {m.label}
            </div>
            <div className="asc-num text-lg font-bold mt-1">{m.value}</div>
            <div className="text-[10px]" style={{ color: m.color }}>
              {m.delta}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          MRR (12mo)
        </div>
        <div className="flex items-end gap-1 h-32">
          {fin.mrrSeries.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ delay: i * 0.04 }}
              className="flex-1 rounded-t"
              style={{ background: "var(--asc-teal)", opacity: 0.4 + (i / 11) * 0.6 }}
            />
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Cash Position
        </div>
        {[
          ["Checking", fin.accounts.checking],
          ["Savings", fin.accounts.savings],
          ["Investments", fin.accounts.investments],
        ].map(([k, v]) => (
          <div key={k as string} className="flex justify-between p-2 asc-surface rounded-lg mb-1.5 text-xs">
            <span>{k}</span>
            <span className="asc-num font-semibold">${(v as number).toLocaleString()}</span>
          </div>
        ))}
        <div className="text-[11px] mt-2" style={{ color: "var(--asc-coral)" }}>
          Burn: ${fin.burn.toLocaleString()}/mo
        </div>
      </Card>
      <Card>
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} style={{ color: "var(--asc-amber)" }} className="mt-0.5" />
          <div className="text-xs flex-1">
            <div className="font-semibold">Tax Set-Aside Alert</div>
            <div className="mt-0.5" style={{ color: "var(--asc-muted)" }}>
              Your last payout was $6,200. Set aside $1,550 (25%) for taxes.
            </div>
          </div>
          <button onClick={() => toast("Dismissed")} className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
            <X size={14} />
          </button>
        </div>
      </Card>
    </>
  );
}

function DealsView() {
  const [deals, setDeals] = useState(M.deals);
  const [detail, setDetail] = useState<string | null>(null);
  const move = (id: string, dir: 1 | -1) => {
    setDeals((ds) =>
      ds.map((d) => {
        if (d.id !== id) return d;
        const idx = M.dealStages.indexOf(d.stage);
        const next = Math.max(0, Math.min(M.dealStages.length - 1, idx + dir));
        return { ...d, stage: M.dealStages[next] };
      })
    );
    toast.success("Deal moved");
  };

  return (
    <>
      <div className="overflow-x-auto asc-scroll -mx-4 px-4">
        <div className="flex gap-3" style={{ minWidth: "max-content" }}>
          {M.dealStages.map((stage) => (
            <div key={stage} className="w-56 flex-shrink-0">
              <div className="text-[11px] uppercase font-semibold mb-2 px-1" style={{ color: stage === "Won" ? "var(--asc-teal)" : "var(--asc-muted)" }}>
                {stage} • {deals.filter((d) => d.stage === stage).length}
              </div>
              <div className="space-y-2 min-h-[80px]">
                {deals
                  .filter((d) => d.stage === stage)
                  .map((d) => (
                    <motion.div
                      layout
                      key={d.id}
                      onClick={() => setDetail(d.id)}
                      className="p-3 asc-card cursor-pointer"
                      style={{
                        borderColor: d.stale ? "var(--asc-amber)" : stage === "Won" ? "var(--asc-teal)" : undefined,
                      }}
                    >
                      <div className="text-xs font-semibold">{d.company}</div>
                      <div className="asc-num text-sm font-bold mt-1">${(d.value / 1000).toFixed(0)}k</div>
                      {d.stale && (
                        <div className="text-[9px] mt-1" style={{ color: "var(--asc-amber)" }}>
                          ⚠ 14d no activity
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        <button onClick={(e) => { e.stopPropagation(); move(d.id, -1); }} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>
                          ←
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); move(d.id, 1); }} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>
                          →
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {detail && (
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
              className="w-full asc-card rounded-t-3xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const d = deals.find((x) => x.id === detail)!;
                return (
                  <>
                    <div className="asc-display text-lg">{d.company}</div>
                    <div className="flex gap-3 mt-3">
                      <div>
                        <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
                          Value
                        </div>
                        <div className="asc-num font-bold">${d.value.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
                          Stage
                        </div>
                        <div className="asc-num font-bold">{d.stage}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase" style={{ color: "var(--asc-muted)" }}>
                          Close
                        </div>
                        <div className="asc-num font-bold">Apr 30</div>
                      </div>
                    </div>
                    <div className="text-xs uppercase mt-4 mb-2" style={{ color: "var(--asc-muted)" }}>
                      Activity
                    </div>
                    <div className="space-y-1.5">
                      {["Email exchange — Mar 12", "Discovery call — Mar 8", "Inbound lead — Mar 1"].map((a) => (
                        <div key={a} className="text-xs p-2 asc-surface rounded-lg">
                          {a}
                        </div>
                      ))}
                    </div>
                    <TealButton className="w-full mt-3" onClick={() => toast.success("Activity logged")}>
                      Log Activity
                    </TealButton>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TasksView() {
  const [top3, setTop3] = useState(M.tasks.top3);
  const [someday, setSomeday] = useState(M.tasks.someday);
  const [focusOn, setFocusOn] = useState(false);
  const [focusSec, setFocusSec] = useState(0);
  const [focusLen, setFocusLen] = useState(25);

  useEffect(() => {
    if (!focusOn) return;
    const t = setInterval(() => setFocusSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [focusOn]);

  const triage = (i: number, keep: boolean) => {
    setSomeday((s) => s.filter((_, idx) => idx !== i));
    toast(keep ? "Kept" : "Deleted");
  };

  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Today's Top 3
        </div>
        <div className="space-y-2">
          {top3.map((t, i) => (
            <div
              key={i}
              onClick={() => setTop3((arr) => arr.map((x, idx) => (idx === i ? { ...x, done: !x.done } : x)))}
              className="p-3 asc-surface rounded-xl flex items-center gap-3 cursor-pointer"
            >
              <div
                className="w-6 h-6 rounded border flex items-center justify-center"
                style={{ borderColor: t.done ? "var(--asc-teal)" : "var(--asc-border)", background: t.done ? "var(--asc-teal)" : "transparent" }}
              >
                {t.done && <Check size={12} color="#062520" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ textDecoration: t.done ? "line-through" : undefined, opacity: t.done ? 0.6 : 1 }}>
                  {t.name}
                </div>
                <Pill color="var(--asc-muted)">{t.tag}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex justify-between mb-3">
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Someday
          </div>
          <GhostButton onClick={() => toast("Add task")}>
            <Plus size={12} /> Add
          </GhostButton>
        </div>
        <div className="space-y-1.5">
          {someday.map((s, i) => (
            <div key={i} className="p-2 asc-surface rounded-lg flex items-center gap-2 text-xs">
              <span className="flex-1">{s}</span>
              <button onClick={() => triage(i, false)} className="px-2 py-0.5 rounded" style={{ background: "color-mix(in oklab, var(--asc-coral) 20%, transparent)", color: "var(--asc-coral)" }}>
                ✕
              </button>
              <button onClick={() => triage(i, true)} className="px-2 py-0.5 rounded" style={{ background: "color-mix(in oklab, var(--asc-teal) 20%, transparent)", color: "var(--asc-teal)" }}>
                ✓
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Deep Work Timer
        </div>
        <div className="flex justify-center my-3">
          <Ring size={140} stroke={8} pct={focusOn ? Math.min(1, focusSec / (focusLen * 60)) : 0} color="var(--asc-teal)">
            <div className="text-center">
              <div className="asc-num text-2xl font-bold">
                {focusOn ? `${Math.floor(focusSec / 60)}:${String(focusSec % 60).padStart(2, "0")}` : `${focusLen}:00`}
              </div>
              <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                {focusOn ? "FOCUSING" : "READY"}
              </div>
            </div>
          </Ring>
        </div>
        {!focusOn && (
          <div className="flex gap-2 justify-center mb-3">
            {[25, 50].map((m) => (
              <button
                key={m}
                onClick={() => setFocusLen(m)}
                className="px-3 py-1 rounded-lg text-xs"
                style={{
                  background: focusLen === m ? "var(--asc-teal)" : "rgba(255,255,255,0.04)",
                  color: focusLen === m ? "#062520" : "var(--asc-muted)",
                }}
              >
                {m}m
              </button>
            ))}
          </div>
        )}
        <TealButton
          className="w-full"
          onClick={() => {
            if (focusOn) {
              toast.success(`Session logged: ${Math.floor(focusSec / 60)}m`);
              setFocusOn(false);
              setFocusSec(0);
            } else {
              setFocusOn(true);
            }
          }}
        >
          {focusOn ? "End Session" : "Start"}
        </TealButton>
      </Card>
    </>
  );
}

function NetworkView() {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-coral)" }}>
          Overdue Reach-outs
        </div>
        <div className="space-y-2">
          {M.contacts.filter((c) => c.overdue).map((c) => (
            <div key={c.name} className="p-3 rounded-xl flex justify-between items-center" style={{ background: "color-mix(in oklab, var(--asc-amber) 10%, transparent)", border: "1px solid color-mix(in oklab, var(--asc-amber) 25%, transparent)" }}>
              <div>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-[10px]" style={{ color: "var(--asc-amber)" }}>
                  {c.days} days
                </div>
              </div>
              <TealButton onClick={() => setDraft(c.name)}>Draft</TealButton>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Contacts
        </div>
        <div className="space-y-1.5">
          {M.contacts.map((c) => (
            <div key={c.name} className="p-2 asc-surface rounded-lg flex items-center gap-2">
              <div className="flex-1">
                <div className="text-xs font-semibold">{c.name}</div>
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  {c.company} • {c.days}d ago
                </div>
              </div>
              <Pill color={c.strength === "Strong" ? "var(--asc-teal)" : c.strength === "Warm" ? "var(--asc-amber)" : "var(--asc-muted)"}>{c.strength}</Pill>
            </div>
          ))}
        </div>
      </Card>
      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setDraft(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full asc-card rounded-t-3xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="asc-display mb-2">Message to {draft}</div>
              <div className="flex items-center gap-1.5 text-[10px] mb-2" style={{ color: "var(--asc-teal)" }}>
                <Sparkles size={10} /> AI Drafted
              </div>
              <textarea
                rows={6}
                defaultValue={`Hey ${draft?.split(" ")[0]}, been a minute. Last time we talked you were heading into the new fund — how's that shaping up? Wanted to share a quick update on what we've been building. Free for a call next week?`}
              />
              <TealButton
                className="w-full mt-3"
                onClick={() => {
                  setDraft(null);
                  toast.success("Sent");
                }}
              >
                Send
              </TealButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GoalsView() {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
        Q2 Objectives
      </div>
      <div className="space-y-4">
        {M.objectives.map((o) => (
          <div key={o.name} className="p-4 asc-surface rounded-xl">
            <div className="flex items-center gap-3">
              <Ring size={56} stroke={5} pct={o.pct / 100} color={o.pillar === "Status" ? "var(--asc-amber)" : "var(--asc-teal)"}>
                <span className="asc-num text-xs font-bold">{o.pct}%</span>
              </Ring>
              <div className="flex-1">
                <div className="text-sm font-semibold">{o.name}</div>
                <Pill color={o.pillar === "Status" ? "var(--asc-amber)" : "var(--asc-teal)"}>{o.pillar}</Pill>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {o.krs.map((k) => (
                <div key={k.name}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>{k.name}</span>
                    <span className="asc-num">
                      {k.unit}
                      {k.current.toLocaleString()} / {k.unit}
                      {k.target.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar pct={(k.current / k.target) * 100} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
