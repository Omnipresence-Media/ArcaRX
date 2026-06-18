import { habitMatrix, habitCorrelations } from "@/lib/fit-seed-extra";

function cell(v: number) {
  const a = Math.max(0.06, v / 100);
  return `color-mix(in oklab, var(--teal) ${Math.round(a * 70)}%, transparent)`;
}

export function HabitHeatmap() {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-y-1.5 text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="w-24 text-left font-semibold">Habit</th>
              {Array.from({ length: 8 }, (_, i) => (
                <th key={i} className="px-1 text-center font-semibold">W{i + 1}</th>
              ))}
              <th className="w-16 text-right font-semibold">Avg</th>
            </tr>
          </thead>
          <tbody>
            {habitMatrix.map((row) => {
              const avg = Math.round(row.weeks.reduce((s, v) => s + v, 0) / row.weeks.length);
              return (
                <tr key={row.habit}>
                  <td className="text-xs font-medium text-foreground/90">{row.habit}</td>
                  {row.weeks.map((v, i) => (
                    <td key={i} className="px-1">
                      <div
                        className="mx-auto h-7 w-full max-w-[44px] rounded-md ring-1 ring-[color:var(--glass-stroke)] grid place-items-center text-[10px] font-mono tabular-nums text-foreground/80"
                        style={{ background: cell(v) }}
                        title={`W${i + 1}: ${v}`}
                      >
                        {v}
                      </div>
                    </td>
                  ))}
                  <td className="text-right text-xs font-mono tabular-nums text-foreground">{avg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {habitCorrelations.map((c, i) => (
          <div
            key={i}
            className={`rounded-lg border px-3 py-2 text-[11px] ${
              c.tone === "pos"
                ? "border-[color:color-mix(in_oklab,var(--data-pos)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--data-pos)_8%,transparent)] text-[color:var(--data-pos)]"
                : c.tone === "neg"
                ? "border-[color:color-mix(in_oklab,var(--data-neg)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--data-neg)_8%,transparent)] text-[color:var(--data-neg)]"
                : "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] text-muted-foreground"
            }`}
          >
            {c.insight}
          </div>
        ))}
      </div>
    </div>
  );
}
