export function MacroRing({
  protein,
  carbs,
  fat,
  proteinTarget,
  carbsTarget,
  fatTarget,
  size = 180,
}: {
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  size?: number;
}) {
  const totalKcal = protein * 4 + carbs * 4 + fat * 9;
  const rings = [
    { label: "Protein", value: protein, target: proteinTarget, color: "var(--teal)",   r: 78 },
    { label: "Carbs",   value: carbs,   target: carbsTarget,   color: "var(--navy)",   r: 60 },
    { label: "Fat",     value: fat,     target: fatTarget,     color: "var(--data-pos)", r: 42 },
  ];
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 200 200" className="shrink-0">
        {rings.map((ring) => {
          const c = 2 * Math.PI * ring.r;
          const pct = Math.min(1, ring.value / ring.target);
          return (
            <g key={ring.label} transform="rotate(-90 100 100)">
              <circle cx="100" cy="100" r={ring.r} fill="none" stroke="color-mix(in oklab, var(--glass-stroke-strong) 80%, transparent)" strokeWidth="10" />
              <circle
                cx="100"
                cy="100"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={c * (1 - pct)}
                style={{ transition: "stroke-dashoffset 700ms var(--ease-out-quint)" }}
              />
            </g>
          );
        })}
        <text x="100" y="98"  textAnchor="middle" className="fill-foreground" style={{ fontSize: 24, fontFamily: "Instrument Serif, serif" }}>
          {totalKcal}
        </text>
        <text x="100" y="115" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, letterSpacing: 2 }}>
          KCAL
        </text>
      </svg>
      <div className="space-y-2 text-sm">
        {rings.map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
            <span className="w-16 text-xs font-medium text-foreground/90">{r.label}</span>
            <span className="font-mono tabular-nums text-foreground">{r.value}g</span>
            <span className="text-xs text-muted-foreground">/ {r.target}g</span>
          </div>
        ))}
      </div>
    </div>
  );
}
