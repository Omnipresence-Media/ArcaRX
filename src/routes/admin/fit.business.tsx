import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { Sparkline } from "@/components/shell/viz/Sparkline";
import { Donut } from "@/components/shell/viz/Donut";
import { businessKpis, packageCatalog, invoices } from "@/lib/fit-seed-extra";
import { ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/admin/fit/business")({
  head: () => ({ meta: [{ title: "Business - ARCA Fit" }] }),
  component: BusinessPage,
});

function BusinessPage() {
  const kpis = [
    { label: "MRR",            value: `$${(businessKpis.mrr / 1000).toFixed(1)}k`, delta: { value: "+12%", dir: "up" as const }, spark: businessKpis.mrrSeries },
    { label: "LTV",            value: `$${businessKpis.ltv.toLocaleString()}`,     delta: { value: "+6%",  dir: "up" as const }, spark: [22, 23, 24, 25, 26, 27, 28, 28.4] },
    { label: "Churn",          value: `${businessKpis.churnPct}%`,                  delta: { value: "-0.4%",dir: "down" as const}, spark: [6, 5.6, 5.4, 5.1, 4.8, 4.5, 4.3, 4.2] },
    { label: "Trial → Paid",   value: `${businessKpis.trialConvPct}%`,             delta: { value: "+3%",  dir: "up" as const }, spark: [29, 31, 32, 33, 34, 36, 37, 38] },
    { label: "ARPU",           value: `$${businessKpis.arpu}`,                      delta: { value: "+$18", dir: "up" as const }, spark: [360, 372, 380, 388, 392, 396, 400, 403] },
  ];
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader eyebrow="Business" title="Revenue dashboard" description="Coaching MRR, churn, packages, and conversion." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <div key={k.label} className="glass-panel relative overflow-hidden p-4" style={{ animation: `fade-in 0.5s var(--ease-out-quint) both`, animationDelay: `${i * 40}ms` }}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
              <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                k.delta.dir === "up"
                  ? "border-[color:color-mix(in_oklab,var(--data-pos)_30%,transparent)] text-[color:var(--data-pos)]"
                  : "border-[color:color-mix(in_oklab,var(--data-neg)_30%,transparent)] text-[color:var(--data-neg)]"
              }`}>
                {k.delta.dir === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {k.delta.value}
              </span>
            </div>
            <p className="metric-numeral mt-3 text-[34px] text-foreground">{k.value}</p>
            <div className="mt-3 -mx-1"><Sparkline data={k.spark as number[]} tone={k.delta.dir === "up" ? "pos" : "neg"} height={32} /></div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Package mix · active subs" className="lg:col-span-1">
          <Donut
            size={180}
            caption="Subs"
            total={String(packageCatalog.reduce((s, p) => s + p.active, 0))}
            data={packageCatalog.map((p, i) => ({
              label: p.name.split(" · ")[0],
              value: p.active,
              color: ["var(--teal)", "var(--navy)", "var(--data-pos)", "var(--data-neutral)"][i % 4],
            }))}
          />
        </Panel>

        <Panel title="Packages" className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-2">
            {packageCatalog.map((p) => (
              <div key={p.id} className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{p.active} active</span>
                </div>
                <p className="metric-numeral mt-1 text-2xl text-foreground">
                  ${p.price.toLocaleString()}<span className="text-xs text-muted-foreground">{p.period}</span>
                </p>
                <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                  {p.includes.map((it) => <li key={it}>· {it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Recent invoices">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--glass-stroke)] text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="py-2 font-semibold">Invoice</th>
                <th className="font-semibold">Client</th>
                <th className="font-semibold">Package</th>
                <th className="text-right font-semibold">Amount</th>
                <th className="text-right font-semibold">Status</th>
                <th className="text-right font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[color:var(--glass-stroke)] last:border-0">
                  <td className="py-2.5 font-mono text-[11px] tabular-nums text-foreground">{inv.id}</td>
                  <td className="text-foreground/90">{inv.client}</td>
                  <td className="text-muted-foreground">{inv.pkg}</td>
                  <td className="text-right font-mono tabular-nums text-foreground">${inv.amount.toLocaleString()}</td>
                  <td className="text-right">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      inv.status === "Paid"     ? "border-[color:color-mix(in_oklab,var(--data-pos)_30%,transparent)] text-[color:var(--data-pos)]" :
                      inv.status === "Failed"   ? "border-[color:color-mix(in_oklab,var(--data-neg)_30%,transparent)] text-[color:var(--data-neg)]" :
                                                  "border-[color:var(--glass-stroke-strong)] text-muted-foreground"
                    }`}>{inv.status}</span>
                  </td>
                  <td className="text-right text-muted-foreground">{inv.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
