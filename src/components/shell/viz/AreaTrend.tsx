import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AreaTrendSeries = {
  key: string;
  label: string;
  color?: string;
};

export function AreaTrend({
  data,
  series,
  height = 280,
  xKey = "x",
}: {
  data: Record<string, number | string>[];
  series: AreaTrendSeries[];
  height?: number;
  xKey?: string;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <defs>
            {series.map((s, i) => {
              const c = s.color ?? `var(--chart-${(i % 5) + 1})`;
              return (
                <linearGradient key={s.key} id={`at-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid stroke="var(--glass-stroke)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11 }}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "var(--glass-stroke-strong)", strokeWidth: 1 }}
            contentStyle={{
              background: "color-mix(in oklab, var(--surface-glass) 92%, transparent)",
              border: "1px solid var(--glass-stroke-strong)",
              borderRadius: 12,
              backdropFilter: "blur(16px)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--muted-foreground)", fontSize: 11 }}
          />
          {series.map((s, i) => {
            const c = s.color ?? `var(--chart-${(i % 5) + 1})`;
            return (
              <Area
                key={s.key}
                type="monotone"
                name={s.label}
                dataKey={s.key}
                stroke={c}
                strokeWidth={2}
                fill={`url(#at-${s.key})`}
                isAnimationActive
                animationDuration={700}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
