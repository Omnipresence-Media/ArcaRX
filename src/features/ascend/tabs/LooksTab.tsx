import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Mic, TrendingUp, TrendingDown, Camera, AlertTriangle, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, Pill, TealButton, GhostButton, SegmentControl, ProgressBar, Ring } from "../components/primitives";
import * as M from "../mockData";

type Sub = "Face" | "Hair" | "Skin" | "Posture" | "Voice" | "Style";

export function LooksTab({ empty, loading }: { empty: boolean; loading: boolean }) {
  const [sub, setSub] = useState<Sub>("Face");

  if (loading)
    return (
      <div className="px-4 pb-32 pt-2 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="asc-shimmer rounded-2xl" style={{ height: 140 }} />
        ))}
      </div>
    );
  if (empty)
    return (
      <div className="px-4 pb-32 pt-2">
        <Card className="text-center py-12">
          <Sparkles size={32} style={{ color: "var(--asc-teal)" }} className="mx-auto mb-3" />
          <div className="asc-display">Start your baseline</div>
          <div className="text-sm mt-1" style={{ color: "var(--asc-muted)" }}>
            Take your first face scan to unlock metrics.
          </div>
          <TealButton className="mt-4">Begin Face Scan</TealButton>
        </Card>
      </div>
    );

  return (
    <div className="px-4 pb-32 pt-2 space-y-4">
      <SegmentControl<Sub> options={["Face", "Hair", "Skin", "Posture", "Voice", "Style"]} value={sub} onChange={setSub} />
      {sub === "Face" && <FaceView />}
      {sub === "Hair" && <HairView />}
      {sub === "Skin" && <SkinView />}
      {sub === "Posture" && <PostureView />}
      {sub === "Voice" && <VoiceView />}
      {sub === "Style" && <StyleView />}
    </div>
  );
}

function FaceView() {
  const [scanFlow, setScanFlow] = useState<number | null>(null);

  return (
    <>
      <Card className="!p-0 overflow-hidden">
        <div className="aspect-[4/5] relative bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-44 rounded-full bg-gradient-to-b from-zinc-600/40 to-zinc-700/40" />
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
                Overall Face Score
              </div>
              <div className="asc-display text-4xl">{M.faceMetrics.overall}/100</div>
            </div>
            <TealButton onClick={() => setScanFlow(0)}>
              <Camera size={14} /> New Scan
            </TealButton>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {M.faceMetrics.cards.map((c) => (
          <Card key={c.name}>
            <div className="flex justify-between items-start">
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
                {c.name}
              </div>
              {c.trend === "up" ? (
                <TrendingUp size={12} style={{ color: "var(--asc-teal)" }} />
              ) : (
                <TrendingDown size={12} style={{ color: "var(--asc-coral)" }} />
              )}
            </div>
            <div className="asc-num text-2xl font-bold mt-1">{c.score}</div>
            <div className="text-[10px] mt-1 leading-tight" style={{ color: "var(--asc-muted)" }}>
              {c.desc}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex justify-between mb-3">
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--asc-muted)" }}>
            Treatments
          </div>
          <GhostButton onClick={() => toast("Treatment logged")}>Log Treatment</GhostButton>
        </div>
        <div className="space-y-2">
          {M.faceMetrics.treatments.map((t) => (
            <div key={t.type} className="flex justify-between items-center p-3 asc-surface rounded-xl">
              <div className="text-sm font-semibold">{t.type}</div>
              <Pill color="var(--asc-muted)">{t.when}</Pill>
            </div>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {scanFlow !== null && (
          <ScanFlow step={scanFlow} onNext={() => setScanFlow((s) => (s! >= 4 ? null : s! + 1))} onClose={() => setScanFlow(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function ScanFlow({ step, onNext, onClose }: { step: number; onNext: () => void; onClose: () => void }) {
  const steps = ["Front", "3/4 View", "Side Profile", "Smile", "Closed Eyes"];
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (step === 4) {
      setProcessing(true);
      const t = setTimeout(() => {
        setProcessing(false);
        toast.success("Face scan complete");
        onClose();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="ascend-fullscreen fixed inset-0 z-[110] flex flex-col items-center justify-center p-6"
      style={{ background: "var(--asc-base)" }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-xs" style={{ color: "var(--asc-muted)" }}>
        Cancel
      </button>
      {processing ? (
        <>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <Sparkles size={48} style={{ color: "var(--asc-teal)" }} />
          </motion.div>
          <div className="asc-display mt-4">Analyzing...</div>
        </>
      ) : (
        <>
          <div className="text-xs mb-4" style={{ color: "var(--asc-muted)" }}>
            Step {step + 1} of 5
          </div>
          <div className="asc-display text-2xl mb-6">{steps[step]}</div>
          <div className="relative w-72 h-96 rounded-3xl bg-gradient-to-br from-zinc-700 to-zinc-900 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-44 h-60 rounded-full border-2"
                style={{ borderColor: "var(--asc-teal)", transform: step === 1 ? "rotate(-15deg)" : step === 2 ? "rotate(-30deg)" : undefined }}
              />
            </div>
          </div>
          <TealButton className="mt-8 w-64" onClick={onNext}>
            Capture
          </TealButton>
        </>
      )}
    </motion.div>
  );
}

function HairView() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {["Hairline", "Crown"].map((v) => (
          <Card key={v} className="!p-0 overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-amber-900/40 to-zinc-900 flex items-end p-3">
              <div className="text-xs font-semibold">{v}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Norwood Scale
        </div>
        <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: "var(--asc-teal)", left: `${(M.hair.norwood / 7) * 100}%`, transform: "translate(-50%, -50%)", boxShadow: "0 0 8px var(--asc-teal)" }}
          />
        </div>
        <div className="flex justify-between text-[9px] mt-2" style={{ color: "var(--asc-muted)" }}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="text-sm asc-num font-bold mt-2">Stage {M.hair.norwood}</div>
        <div className="mt-4">
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--asc-muted)" }}>Density</span>
            <span className="asc-num font-bold">{M.hair.density}/100</span>
          </div>
          <ProgressBar pct={M.hair.density} />
        </div>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Regimen
        </div>
        <div className="space-y-2">
          {M.hair.regimen.map((r) => (
            <div key={r.name} className="p-3 asc-surface rounded-xl">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--asc-muted)" }}>
                    {r.route}
                  </div>
                </div>
                <TealButton onClick={() => toast.success("Dose logged")}>Log Dose</TealButton>
              </div>
              <div className="flex justify-between text-[11px] mt-2">
                <Pill color="var(--asc-teal)">{r.adherence}% adherence</Pill>
                <span className="asc-num" style={{ color: "var(--asc-amber)" }}>
                  🔥 {r.streak}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: "rgba(245,166,35,0.1)", color: "var(--asc-amber)" }}>
          📷 Time for your monthly photo - last taken 32 days ago.
        </div>
      </Card>
    </>
  );
}

function SkinView() {
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const list = ampm === "AM" ? M.skin.am : M.skin.pm;
  return (
    <>
      <SegmentControl<"AM" | "PM"> options={["AM", "PM"]} value={ampm} onChange={setAmpm} />
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          {ampm} Routine
        </div>
        <div className="space-y-2">
          {list.map((s, i) => (
            <div key={i} className="p-3 asc-surface rounded-xl flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">
                  {i + 1}. {s.step}
                </div>
                {s.wait > 0 && (
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--asc-amber)" }}>
                    Wait {s.wait} min
                  </div>
                )}
              </div>
              <button
                className="w-7 h-7 rounded-full border flex items-center justify-center"
                style={{ borderColor: "var(--asc-teal)", background: i < 2 ? "var(--asc-teal)" : "transparent" }}
                onClick={() => toast.success("Step logged")}
              >
                {i < 2 && <span style={{ color: "#062520" }}>✓</span>}
              </button>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} style={{ color: "var(--asc-coral)" }} className="mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold" style={{ color: "var(--asc-coral)" }}>
              Conflict detected
            </div>
            <div className="mt-0.5" style={{ color: "var(--asc-muted)" }}>
              Retinol and AHA in same night - space these on alternate nights.
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs uppercase" style={{ color: "var(--asc-muted)" }}>
              UV Index Today
            </div>
            <div className="asc-num text-2xl font-bold mt-1" style={{ color: "var(--asc-amber)" }}>
              {M.skin.uv}
            </div>
          </div>
          <div className="text-xs text-right max-w-[60%]" style={{ color: "var(--asc-muted)" }}>
            Apply SPF 50 and reapply at noon.
          </div>
        </div>
      </Card>
    </>
  );
}

function PostureView() {
  return (
    <>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Posture Metrics
        </div>
        <div className="space-y-2">
          {M.posture.map((p) => (
            <div key={p.name} className="p-3 asc-surface rounded-xl flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  Ideal: {p.ideal}
                </div>
              </div>
              <div className="asc-num font-bold text-lg" style={{ color: p.warn ? "var(--asc-coral)" : "var(--asc-teal)" }}>
                {p.value}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Today's Flow
        </div>
        <div className="space-y-2 text-sm">
          <div className="p-2 asc-surface rounded-lg">Cervical Retraction × 15</div>
          <div className="p-2 asc-surface rounded-lg">Thoracic Extension over foam roller × 10</div>
          <div className="p-2 asc-surface rounded-lg">Hip Flexor Stretch 60s each side</div>
        </div>
        <TealButton className="w-full mt-3" onClick={() => toast.success("Flow complete")}>
          Mark Flow Complete
        </TealButton>
      </Card>
    </>
  );
}

function VoiceView() {
  const [phase, setPhase] = useState<"idle" | "recording">("idle");
  useEffect(() => {
    if (phase === "recording") {
      const t = setTimeout(() => {
        setPhase("idle");
        toast.success("Voice analyzed");
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <>
      <Card className="text-center py-8">
        <button
          onClick={() => setPhase("recording")}
          disabled={phase === "recording"}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto active:scale-95 transition-transform"
          style={{ background: "var(--asc-teal)", color: "#062520" }}
        >
          <Mic size={36} />
        </button>
        {phase === "recording" ? (
          <div className="mt-4">
            <div className="flex items-end justify-center gap-1 h-12">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 30 + Math.random() * 20, 8] }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }}
                  className="w-1 rounded-full"
                  style={{ background: "var(--asc-teal)" }}
                />
              ))}
            </div>
            <div className="text-xs mt-2" style={{ color: "var(--asc-teal)" }}>
              Recording...
            </div>
          </div>
        ) : (
          <div className="text-xs mt-3" style={{ color: "var(--asc-muted)" }}>
            Tap to record 30s sample
          </div>
        )}
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Latest Analysis
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Pitch Median", `${M.voiceMetrics.pitchMedian} Hz`],
            ["Resonance", `${M.voiceMetrics.resonance}/100`],
            ["Vocal Fry", `${M.voiceMetrics.fry}%`],
            ["Speech Rate", `${M.voiceMetrics.rate} wpm`],
          ].map(([k, v]) => (
            <div key={k} className="asc-surface p-3 rounded-xl">
              <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                {k}
              </div>
              <div className="asc-num font-bold mt-1">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center asc-num text-2xl font-bold">
          Overall: {M.voiceMetrics.overall}/100
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
          Prescribed Drills
        </div>
        <div className="space-y-2">
          {M.voiceMetrics.drills.map((d) => (
            <div key={d.name} className="p-3 asc-surface rounded-xl">
              <div className="text-sm font-semibold">{d.name}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--asc-muted)" }}>
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function StyleView() {
  type T = "Wardrobe" | "Outfits" | "Daily Log" | "Fragrance" | "Color";
  const [t, setT] = useState<T>("Wardrobe");
  const [critique, setCritique] = useState(false);
  const filters = ["All", "Tops", "Bottoms", "Shoes", "Outerwear"];
  const [filter, setFilter] = useState("All");

  return (
    <>
      <SegmentControl<T> options={["Wardrobe", "Outfits", "Daily Log", "Fragrance", "Color"]} value={t} onChange={setT} />

      {t === "Wardrobe" && (
        <>
          <Card>
            <div className="flex gap-1.5 mb-3 overflow-x-auto asc-scroll">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1 text-[11px] rounded-full whitespace-nowrap"
                  style={{
                    background: filter === f ? "var(--asc-teal)" : "rgba(255,255,255,0.04)",
                    color: filter === f ? "#062520" : "var(--asc-muted)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {M.wardrobe
                .filter((w) => filter === "All" || w.cat === filter)
                .map((w, i) => (
                  <div key={i} className="asc-surface rounded-xl overflow-hidden">
                    <div className={`aspect-[3/4] bg-gradient-to-br ${w.color}`} />
                    <div className="p-2">
                      <div className="text-[11px] font-semibold">{w.name}</div>
                      <div className="text-[9px]" style={{ color: "var(--asc-muted)" }}>
                        {w.cat}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <GhostButton className="w-full mt-3" onClick={() => toast("Add item")}>
              Add Item
            </GhostButton>
          </Card>
        </>
      )}

      {t === "Outfits" && (
        <div className="grid grid-cols-2 gap-3">
          {M.outfits.map((o) => (
            <Card key={o.name}>
              <div className="aspect-square rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 mb-2" />
              <div className="text-sm font-semibold">{o.name}</div>
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--asc-muted)" }}>
                <span>{o.items} items</span>
                <span>{o.lastWorn}</span>
              </div>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} fill={i < o.rating ? "var(--asc-amber)" : "transparent"} color="var(--asc-amber)" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {t === "Daily Log" && (
        <Card>
          <div className="text-sm font-semibold mb-3">What are you wearing today?</div>
          <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 mb-3" />
          <div className="flex gap-2">
            <GhostButton className="flex-1" onClick={() => toast("Outfit selector")}>
              Select Outfit
            </GhostButton>
            <TealButton className="flex-1" onClick={() => setCritique(true)}>
              AI Critique
            </TealButton>
          </div>
          {critique && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-xl text-xs"
              style={{ background: "color-mix(in oklab, var(--asc-teal) 12%, transparent)" }}
            >
              <div className="flex items-center gap-1.5 mb-1.5 font-semibold" style={{ color: "var(--asc-teal)" }}>
                <Sparkles size={12} /> AI Critique
              </div>
              Strong color harmony. The silhouette is clean. Consider swapping the sneakers for leather shoes to match the meeting formality.
            </motion.div>
          )}
        </Card>
      )}

      {t === "Fragrance" && (
        <Card>
          <div className="grid grid-cols-3 gap-2">
            {M.fragrances.map((f) => (
              <div
                key={f.name}
                className="asc-surface p-3 rounded-xl text-center"
                style={{ border: f.today ? "2px solid var(--asc-teal)" : undefined }}
              >
                <div className="aspect-[2/3] rounded-lg bg-gradient-to-b from-amber-200/30 to-amber-600/30 mb-2" />
                <div className="text-xs font-semibold">{f.name}</div>
                <div className="text-[10px]" style={{ color: "var(--asc-muted)" }}>
                  {f.brand}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: "color-mix(in oklab, var(--asc-teal) 12%, transparent)", color: "var(--asc-teal)" }}>
            <Sparkles size={12} className="inline mr-1" /> Aventus - cool day, outdoor lunch - perfect fit.
          </div>
        </Card>
      )}

      {t === "Color" && (
        <>
          <Card>
            <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
              Your Palette - Soft Autumn
            </div>
            <div className="grid grid-cols-4 gap-2">
              {M.colorPalette.map((c) => (
                <div key={c} className="aspect-square rounded-lg" style={{ background: c }} />
              ))}
            </div>
          </Card>
          <Card>
            <div className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--asc-muted)" }}>
              Wardrobe Compatibility
            </div>
            <div className="space-y-1.5">
              {M.wardrobe.slice(0, 8).map((w, i) => (
                <div key={w.name} className="flex justify-between items-center p-2 asc-surface rounded-lg text-xs">
                  <span>{w.name}</span>
                  {i < 6 ? <Pill>In-season</Pill> : <Pill color="var(--asc-amber)">Out-of-season</Pill>}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </>
  );
}
