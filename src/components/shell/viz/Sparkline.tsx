import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function Sparkline({
  data,
  tone = "pos",
  height = 36,
}: {
  data: number[];
  tone?: "pos" | "neg" | "neutral";
  height?: number;
}) {
  const color =
    tone === "neg"
      ? "var(--data-neg)"
      : tone === "neutral"
      ? "var(--data-neutral)"
      : "var(--data-pos)";
  const series = data.map((v, i) => ({ i, v }));
  const id = `sl-${tone}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.6}
            fill={`url(#${id})`}
            isAnimationActive
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
