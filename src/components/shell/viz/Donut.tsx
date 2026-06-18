import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export type DonutDatum = { label: string; value: number; color?: string };

export function Donut({
  data,
  total,
  caption,
  size = 200,
}: {
  data: DonutDatum[];
  total?: string;
  caption?: string;
  size?: number;
}) {
  const sum = data.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div className="flex items-center gap-6">
      <div style={{ width: size, height: size }} className="relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive
              animationDuration={700}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color ?? `var(--chart-${(i % 5) + 1})`} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="metric-numeral text-3xl text-foreground">{total ?? sum.toLocaleString()}</div>
          {caption && (
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {caption}
            </div>
          )}
        </div>
      </div>
      <ul className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
        {data.map((d, i) => {
          const pct = ((d.value / sum) * 100).toFixed(1);
          return (
            <li key={d.label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: d.color ?? `var(--chart-${(i % 5) + 1})` }}
                />
                <span className="truncate text-foreground/90">{d.label}</span>
              </div>
              <div className="flex shrink-0 items-baseline gap-2 font-mono tabular-nums">
                <span className="text-foreground">{d.value.toLocaleString()}</span>
                <span className="text-[11px] text-muted-foreground">{pct}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
