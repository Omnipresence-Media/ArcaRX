import { volumeHeatmap } from "@/lib/fit-seed-extra";

function intensity(v: number, max: number) {
  const a = Math.max(0.06, v / max);
  return `color-mix(in oklab, var(--navy) ${Math.round(a * 65)}%, var(--teal) ${Math.round(a * 35)}%)`;
}

export function VolumeHeatmap() {
  const max = Math.max(...volumeHeatmap.flatMap((r) => r.weeks));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-y-1 text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <th className="w-24 text-left font-semibold">Muscle</th>
            {Array.from({ length: 8 }, (_, i) => (
              <th key={i} className={`px-1 text-center font-semibold ${i === 3 || i === 7 ? "text-[color:var(--teal)]" : ""}`}>
                W{i + 1}
                {(i === 3 || i === 7) && <span className="ml-1 opacity-70">·D</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {volumeHeatmap.map((row) => (
            <tr key={row.muscle}>
              <td className="text-xs font-medium text-foreground/90">{row.muscle}</td>
              {row.weeks.map((v, i) => (
                <td key={i} className="px-1">
                  <div
                    className="mx-auto h-7 w-full max-w-[44px] rounded-md ring-1 ring-[color:var(--glass-stroke)] grid place-items-center text-[10px] font-mono tabular-nums text-white/85"
                    style={{ background: intensity(v, max) }}
                    title={`${row.muscle} W${i + 1}: ${v} sets`}
                  >
                    {v}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">D = auto-deload</p>
    </div>
  );
}
