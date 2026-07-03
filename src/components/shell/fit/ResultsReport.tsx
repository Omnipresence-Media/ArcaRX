import { type FitClient } from "@/lib/fit-seed";
import { buildResults, deltaPct, improved, type Biomarker } from "@/features/coaching/resultsSeed";
import { AreaTrend } from "@/components/shell/viz/AreaTrend";
import { ProgressPhotoCompare } from "@/components/shell/fit/ProgressPhotoCompare";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function DeltaBadge({ b }: { b: Biomarker }) {
  const good = improved(b);
  const pct = deltaPct(b);
  const Arrow = pct < 0 ? ArrowDownRight : ArrowUpRight;
  const color = good ? "var(--data-pos)" : "var(--data-neg)";
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold" style={{ color }}>
      <Arrow className="h-3 w-3" />
      {Math.abs(pct)}%
    </span>
  );
}

function BiomarkerCard({ b }: { b: Biomarker }) {
  const good = improved(b);
  return (
    <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">{b.label}</p>
        <DeltaBadge b={b} />
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="metric-numeral text-2xl" style={{ color: good ? "var(--data-pos)" : "var(--foreground)" }}>
          {b.current}
        </span>
        <span className="text-[11px] text-muted-foreground">{b.unit}</span>
      </div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">from {b.before} {b.unit}</p>
    </div>
  );
}

export function ResultsReport({ client }: { client: FitClient }) {
  const r = buildResults(client);
  const weightSeries = client.weightTrend.map((v, i) => ({ x: `W${i}`, weight: v }));

  const body = r.biomarkers.filter((b) => b.category === "Body");
  const clinical = r.biomarkers.filter((b) => b.category === "Clinical");

  // Headline stats for the hero row.
  const weight = r.biomarkers.find((b) => b.label === "Weight")!;
  const bodyFat = r.biomarkers.find((b) => b.label === "Body fat")!;
  const a1c = r.biomarkers.find((b) => b.label === "A1c")!;
  const ldl = r.biomarkers.find((b) => b.label === "LDL cholesterol")!;
  const headline = [
    { label: "Weight", value: `${Math.round(weight.current - weight.before)} lb`, sub: `${weight.before} → ${weight.current}` },
    { label: "Body fat", value: `${(bodyFat.current - bodyFat.before).toFixed(1)}%`, sub: `${bodyFat.before} → ${bodyFat.current}%` },
    { label: "A1c", value: `${(a1c.current - a1c.before).toFixed(1)}%`, sub: `${a1c.before} → ${a1c.current}` },
    { label: "LDL", value: `${ldl.current - ldl.before} mg/dL`, sub: `${ldl.before} → ${ldl.current}` },
  ];

  return (
    <div className="space-y-6">
      {/* Headline deltas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {headline.map((h) => (
          <div key={h.label} className="rounded-xl border border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--surface-glass)_65%,transparent)] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{h.label}</p>
            <p className="metric-numeral mt-1 text-3xl text-[color:var(--data-pos)]">{h.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{h.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Before / after */}
        <div className="rounded-2xl border border-[color:var(--glass-stroke)] glass-panel p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Before / after</p>
          <ProgressPhotoCompare
            before={r.beforePhoto}
            after={r.afterPhoto}
            beforeLabel="Week 0"
            afterLabel={`Week ${r.weeks}`}
          />
        </div>

        {/* Weight trend */}
        <div className="rounded-2xl border border-[color:var(--glass-stroke)] glass-panel p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Weight trend · {r.weeks} weeks</p>
          <AreaTrend data={weightSeries} series={[{ key: "weight", label: "Weight (lb)", color: "var(--teal)" }]} height={240} />
        </div>
      </div>

      {/* Body composition */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Body composition</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {body.map((b) => <BiomarkerCard key={b.label} b={b} />)}
        </div>
      </div>

      {/* Clinical markers — the moat */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Clinical markers</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {clinical.map((b) => <BiomarkerCard key={b.label} b={b} />)}
        </div>
      </div>

      {/* Measurements */}
      <div className="rounded-2xl border border-[color:var(--glass-stroke)] glass-panel p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Measurements</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {r.measurements.map((m) => {
            const diff = Math.round((m.current - m.start) * 10) / 10;
            return (
              <div key={m.site} className="rounded-lg border border-[color:var(--glass-stroke)] p-2.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{m.site}</p>
                <p className="metric-numeral mt-0.5 text-lg text-foreground">{m.current}<span className="text-[10px] text-muted-foreground"> {m.unit}</span></p>
                <p className="text-[10px]" style={{ color: diff <= 0 ? "var(--data-pos)" : "var(--data-neutral)" }}>{diff > 0 ? "+" : ""}{diff} {m.unit}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--teal)_30%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_7%,transparent)] p-4">
        <p className="text-sm leading-relaxed text-foreground/90">{r.summary}</p>
      </div>
    </div>
  );
}
