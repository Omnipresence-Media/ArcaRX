import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { fitClients } from "@/lib/fit-seed";
import { ScanLine, Activity, Droplets, HeartPulse, Camera, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/fit/scans")({
  head: () => ({ meta: [{ title: "Body scans - ARCA Fit" }] }),
  component: ScansPage,
});

// 8-week composition arc per client (synthetic but consistent)
function compositionFor(seed: number) {
  const baseFat = 22 + (seed % 6);
  const baseMuscle = 38 + (seed % 5);
  return Array.from({ length: 8 }, (_, w) => ({
    week: w + 1,
    fat: +(baseFat - w * 0.45 + Math.sin(w + seed) * 0.3).toFixed(1),
    muscle: +(baseMuscle + w * 0.32 + Math.cos(w + seed) * 0.2).toFixed(1),
    hydration: 60 + ((w + seed) % 8),
    bmi: +(24.4 - w * 0.12).toFixed(1),
  }));
}

const scans = fitClients.slice(0, 8).map((c, i) => ({
  client: c,
  history: compositionFor(i + 1),
  posture: ["A+", "A", "A-", "B+", "B", "A", "A-", "A+"][i],
  hr: 58 + (i * 3) % 14,
  lastScan: ["2h ago", "Today", "Yesterday", "2d ago", "3d ago", "Today", "1d ago", "5h ago"][i],
}));

function Metric({ label, value, unit, tone = "neutral" }: { label: string; value: string; unit?: string; tone?: "pos" | "neg" | "neutral" }) {
  const toneColor = tone === "pos" ? "text-[color:var(--data-pos)]" : tone === "neg" ? "text-[color:var(--data-neg)]" : "text-foreground";
  return (
    <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={`metric-numeral mt-1 text-2xl ${toneColor}`}>{value}<span className="ml-1 text-xs text-muted-foreground">{unit}</span></p>
    </div>
  );
}

function TrendLine({ data, accessor, color }: { data: any[]; accessor: (d: any) => number; color: string }) {
  const vals = data.map(accessor);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${30 - ((v - min) / range) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-12 w-full">
      <polyline fill="none" stroke={color} strokeWidth="0.8" points={pts} />
      <polyline fill={`color-mix(in oklab, ${color} 14%, transparent)`} stroke="none" points={`0,30 ${pts} 100,30`} />
    </svg>
  );
}

function ScansPage() {
  const [activeId, setActiveId] = useState(scans[0].client.id);
  const [compareWeek, setCompareWeek] = useState(7);
  const active = scans.find((s) => s.client.id === activeId) ?? scans[0];
  const start = active.history[0];
  const latest = active.history[active.history.length - 1];
  const cmp = active.history[compareWeek];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching · Body Intelligence"
        title="AI Body Scans"
        description="Weekly composition scans. Body fat, lean mass, posture grade, and hydration - captured from the client's phone camera."
        actions={
          <button onClick={() => toast.success("Scan requested", { description: "The client gets a prompt to capture a new body scan from their phone." })} className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background">
            <ScanLine className="h-3.5 w-3.5" /> Request new scan
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Scans this week" value="34" tone="pos" />
        <Metric label="Avg body-fat Δ (4wk)" value="−1.8" unit="%" tone="pos" />
        <Metric label="Avg lean-mass Δ" value="+1.3" unit="%" tone="pos" />
        <Metric label="Posture flags open" value="3" tone="neg" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Panel title="Recent scans">
          <ul className="space-y-1.5">
            {scans.map((s) => {
              const isActive = s.client.id === activeId;
              const fatDelta = +(s.history.at(-1)!.fat - s.history[0].fat).toFixed(1);
              return (
                <li key={s.client.id}>
                  <button
                    onClick={() => { setActiveId(s.client.id); setCompareWeek(7); }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left ${
                      isActive
                        ? "border-[color:color-mix(in_oklab,var(--teal)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)]"
                        : "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]"
                    }`}
                  >
                    <img src={s.client.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{s.client.name}</p>
                      <p className="text-[11px] text-muted-foreground">Scan · {s.lastScan}</p>
                    </div>
                    <span className={`font-mono text-[11px] tabular-nums ${fatDelta < 0 ? "text-[color:var(--data-pos)]" : "text-[color:var(--data-neg)]"}`}>
                      {fatDelta > 0 ? "+" : ""}{fatDelta}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel
            title={`${active.client.name} · scan composition`}
            actions={<span className="text-[11px] text-muted-foreground">Week {compareWeek + 1} of 8 · Posture {active.posture}</span>}
          >
            <div className="grid gap-3 md:grid-cols-5">
              <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><Activity className="h-3 w-3" /> Body fat</p>
                <p className="metric-numeral mt-1 text-2xl text-foreground">{cmp.fat}<span className="ml-1 text-xs text-muted-foreground">%</span></p>
                <p className="text-[10px] font-mono text-[color:var(--data-pos)]">Δ {(cmp.fat - start.fat).toFixed(1)}%</p>
              </div>
              <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Lean mass</p>
                <p className="metric-numeral mt-1 text-2xl text-foreground">{cmp.muscle}<span className="ml-1 text-xs text-muted-foreground">%</span></p>
                <p className="text-[10px] font-mono text-[color:var(--data-pos)]">Δ +{(cmp.muscle - start.muscle).toFixed(1)}%</p>
              </div>
              <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">BMI</p>
                <p className="metric-numeral mt-1 text-2xl text-foreground">{cmp.bmi}</p>
                <p className="text-[10px] font-mono text-muted-foreground">healthy band</p>
              </div>
              <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><Droplets className="h-3 w-3" /> Hydration</p>
                <p className="metric-numeral mt-1 text-2xl text-foreground">{cmp.hydration}<span className="ml-1 text-xs text-muted-foreground">%</span></p>
              </div>
              <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><HeartPulse className="h-3 w-3" /> Resting HR</p>
                <p className="metric-numeral mt-1 text-2xl text-foreground">{active.hr}<span className="ml-1 text-xs text-muted-foreground">bpm</span></p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Body fat trend (8 wks)</p>
                <TrendLine data={active.history} accessor={(d) => d.fat} color="oklch(0.65 0.18 25)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Lean mass trend (8 wks)</p>
                <TrendLine data={active.history} accessor={(d) => d.muscle} color="oklch(0.7 0.13 190)" />
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Compare week</p>
              <input
                type="range" min={0} max={7} step={1}
                value={compareWeek}
                onChange={(e) => setCompareWeek(parseInt(e.target.value))}
                className="w-full accent-[color:var(--teal)]"
              />
              <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground">
                {active.history.map((h) => <span key={h.week}>W{h.week}</span>)}
              </div>
            </div>
          </Panel>

          <Panel title="Side-by-side comparison" actions={<span className="text-[11px] text-muted-foreground">Week 1 vs Week {compareWeek + 1}</span>}>
            <div className="grid gap-4 md:grid-cols-2">
              {[start, cmp].map((snap, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-[color:var(--glass-stroke)]">
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-[color:color-mix(in_oklab,var(--teal)_18%,transparent)] to-[color:color-mix(in_oklab,var(--navy)_45%,transparent)]">
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                      <Camera className="h-10 w-10 opacity-40" />
                    </div>
                    <div className="absolute left-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white">
                      WK {snap.week}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 grid grid-cols-3 gap-1 text-[10px] font-mono text-white">
                      <span className="rounded bg-black/55 px-1 py-0.5">FAT {snap.fat}%</span>
                      <span className="rounded bg-black/55 px-1 py-0.5">LEAN {snap.muscle}%</span>
                      <span className="rounded bg-black/55 px-1 py-0.5">BMI {snap.bmi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[color:color-mix(in_oklab,var(--data-pos)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--data-pos)_8%,transparent)] p-2.5 text-xs text-foreground">
              <ArrowRight className="h-3.5 w-3.5 text-[color:var(--data-pos)]" />
              Δ {(cmp.fat - start.fat).toFixed(1)}% fat · Δ +{(cmp.muscle - start.muscle).toFixed(1)}% lean over {compareWeek} weeks. Posture upgraded {active.posture}.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
