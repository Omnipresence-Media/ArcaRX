import { oneRMHistory } from "@/lib/fit-seed-extra";

const COLORS = ["var(--teal)", "var(--navy)", "var(--data-pos)", "var(--data-neutral)"] as const;

export function OneRMChart() {
  const W = 560, H = 180, PAD = 24;
  const all = oneRMHistory.flatMap((l) => l.series.map((p) => p.weight));
  const min = Math.min(...all) - 10;
  const max = Math.max(...all) + 10;
  const n = oneRMHistory[0].series.length;

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          {oneRMHistory.map((_, i) => (
            <linearGradient key={i} id={`gr-${i}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity="0.25" />
              <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {Array.from({ length: 4 }, (_, i) => {
          const y = PAD + ((H - PAD * 2) / 3) * i;
          return <line key={i} x1={PAD} x2={W - PAD} y1={y} y2={y} stroke="var(--glass-stroke)" />;
        })}
        {oneRMHistory.map((lift, li) => {
          const pts = lift.series.map((p, i) => {
            const x = PAD + ((W - PAD * 2) / (n - 1)) * i;
            const y = PAD + (H - PAD * 2) * (1 - (p.weight - min) / (max - min));
            return [x, y] as const;
          });
          const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
          return (
            <g key={lift.lift}>
              <path d={d} fill="none" stroke={COLORS[li % COLORS.length]} strokeWidth="2" strokeLinecap="round" />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3 : 1.6} fill={COLORS[li % COLORS.length]} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 text-[11px]">
        {oneRMHistory.map((l, i) => {
          const first = l.series[0].weight, last = l.series[l.series.length - 1].weight;
          const pct = (((last - first) / first) * 100).toFixed(1);
          return (
            <span key={l.lift} className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-2.5 py-1">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="font-medium text-foreground">{l.lift}</span>
              <span className="font-mono tabular-nums text-muted-foreground">{last} lb</span>
              <span className="font-mono tabular-nums text-[color:var(--data-pos)]">+{pct}%</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
