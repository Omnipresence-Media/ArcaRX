import { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Sparkline } from "@/components/shell/viz/Sparkline";

export type Stat = {
  label: string;
  value: string;
  sub?: string;
  delta?: { value: string; dir: "up" | "down" };
  spark?: number[];
};

const RANGES = ["Today", "7d", "30d", "90d", "YTD"] as const;
type Range = (typeof RANGES)[number];

function PeriodBar({
  range = "30d",
  onChange,
}: {
  range?: Range;
  onChange?: (r: Range) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full glass-panel-quiet p-1">
      {RANGES.map((r) => {
        const active = r === range;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange?.(r)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-[var(--dur-fast)] ${
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

export function AnalyticsSubPage({
  eyebrow = "Analytics",
  title,
  description,
  stats,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  stats: Stat[];
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            <PeriodBar />
            <span className="hidden text-[11px] text-muted-foreground md:inline">
              Updated just now
            </span>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((s, i) => (
          <KpiCard key={s.label} stat={s} index={i} />
        ))}
      </div>
      {children}
    </div>
  );
}

function KpiCard({ stat, index }: { stat: Stat; index: number }) {
  const tone: "pos" | "neg" | "neutral" =
    stat.delta?.dir === "up" ? "pos" : stat.delta?.dir === "down" ? "neg" : "neutral";
  return (
    <div
      className="glass-panel group relative overflow-hidden p-4 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5"
      style={{ animation: `fade-in 0.5s var(--ease-out-quint) both`, animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {stat.label}
        </p>
        {stat.delta && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
              stat.delta.dir === "up"
                ? "border-[color:color-mix(in_oklab,var(--data-pos)_30%,transparent)] text-[color:var(--data-pos)]"
                : "border-[color:color-mix(in_oklab,var(--data-neg)_30%,transparent)] text-[color:var(--data-neg)]"
            }`}
          >
            {stat.delta.dir === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {stat.delta.value}
          </span>
        )}
      </div>
      <p className="metric-numeral mt-3 text-[34px] text-foreground">{stat.value}</p>
      {stat.sub && (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.sub}</p>
      )}
      {stat.spark && stat.spark.length > 1 && (
        <div className="mt-3 -mx-1">
          <Sparkline data={stat.spark} tone={tone} height={32} />
        </div>
      )}
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
  actions,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={`glass-panel p-5 md:p-6 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  );
}

export function SimpleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[color:var(--glass-stroke)] text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`py-2.5 pr-3 font-semibold ${i === 0 ? "" : "text-right"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-[color:var(--glass-stroke)] transition-colors last:border-0 hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`py-3 pr-3 ${
                    j === 0
                      ? "font-medium text-foreground"
                      : "text-right font-mono tabular-nums text-muted-foreground"
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  suffix = "",
  tone = "primary",
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  tone?: "primary" | "muted";
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="font-medium text-foreground/90">{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--muted)_60%,transparent)]">
        <div
          className="h-full rounded-full transition-[width] duration-[600ms] ease-[var(--ease-out-quint)]"
          style={{
            width: `${pct}%`,
            background:
              tone === "muted"
                ? "var(--data-neutral)"
                : "linear-gradient(90deg, var(--teal), color-mix(in oklab, var(--navy) 70%, var(--teal)))",
          }}
        />
      </div>
    </div>
  );
}
