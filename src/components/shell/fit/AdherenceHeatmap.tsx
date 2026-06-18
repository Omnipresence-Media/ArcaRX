export function AdherenceHeatmap({
  rows,
  weekLabels,
}: {
  rows: { client: string; weeks: number[] }[];
  weekLabels?: string[];
}) {
  const cols = rows[0]?.weeks.length ?? 6;
  const labels = weekLabels ?? Array.from({ length: cols }, (_, i) => `W${i + 1}`);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid items-center gap-1.5" style={{ gridTemplateColumns: `160px repeat(${cols}, minmax(0, 1fr))` }}>
          <div />
          {labels.map((l) => (
            <div key={l} className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {l}
            </div>
          ))}
          {rows.map((r) => (
            <Row key={r.client} client={r.client} weeks={r.weeks} />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Low</span>
          <div className="flex gap-0.5">
            {[20, 40, 60, 80, 100].map((v) => (
              <div key={v} className="h-3 w-6 rounded-sm" style={{ background: cellBg(v) }} />
            ))}
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

function Row({ client, weeks }: { client: string; weeks: number[] }) {
  return (
    <>
      <div className="truncate pr-2 text-xs text-foreground/90">{client}</div>
      {weeks.map((v, i) => (
        <div
          key={i}
          title={`${client} · ${v}% adherence`}
          className="relative aspect-[2.4/1] rounded-md ring-1 ring-[color:var(--glass-stroke)] transition-transform duration-200 hover:scale-[1.04] hover:ring-[color:var(--glass-stroke-strong)]"
          style={{ background: cellBg(v) }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono tabular-nums text-foreground/80">
            {v}
          </span>
        </div>
      ))}
    </>
  );
}

function cellBg(v: number) {
  const t = Math.max(0.06, Math.min(1, v / 100));
  // Blend teal (high) with neutral surface at low values
  return `color-mix(in oklab, var(--teal) ${t * 70}%, color-mix(in oklab, var(--surface-glass) 60%, transparent))`;
}
