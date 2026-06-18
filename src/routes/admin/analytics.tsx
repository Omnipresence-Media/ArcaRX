import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revenueSeries, mrrSeries } from "@/lib/seed-data";
import { providers } from "@/lib/data/providers";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, RadialBarChart, RadialBar, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — ARCA Rx" }] }),
  component: Analytics,
});

const channels = [
  { name: "Instagram", value: 38, fill: "var(--chart-1)" },
  { name: "Google",    value: 26, fill: "var(--chart-2)" },
  { name: "Referral",  value: 19, fill: "var(--chart-3)" },
  { name: "Website",   value: 12, fill: "var(--chart-4)" },
  { name: "TikTok",    value:  5, fill: "var(--chart-5)" },
];

const funnel = [
  { stage: "Lead",       count: 1240 },
  { stage: "Contacted",  count:  892 },
  { stage: "Consulted",  count:  418 },
  { stage: "Booked",     count:  287 },
  { stage: "Converted",  count:  214 },
];

function Analytics() {
  const stats = [
    { label: "CAC", value: "$148", sub: "−12% MoM" },
    { label: "LTV", value: "$8,420", sub: "+6% YoY" },
    { label: "LTV : CAC", value: "57×", sub: "Healthy" },
    { label: "Churn", value: "3.6%", sub: "Trailing 90D" },
    { label: "NPS",  value: "72",    sub: "+4 vs Q1" },
  ];

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader eyebrow="Revenue" title="Analytics" description="Full-funnel attribution, cohort retention, and provider economics." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map(s => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Revenue trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueSeries} margin={{ left: -10 }}>
                <defs><linearGradient id="r2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
                </linearGradient></defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={v=>`$${v/1000}k`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--teal)" strokeWidth={2} fill="url(#r2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Channel attribution · MTD</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={channels} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={4} />
                <Legend iconSize={8} layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 11 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Acquisition funnel</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0">
            {funnel.map((f,i) => {
              const pct = (f.count / funnel[0].count) * 100;
              return (
                <div key={f.stage}>
                  <div className="flex justify-between text-xs"><span className="font-medium">{f.stage}</span><span className="font-mono tabular-nums text-muted-foreground">{f.count.toLocaleString()} · {pct.toFixed(0)}%</span></div>
                  <div className="mt-1 h-6 overflow-hidden rounded bg-muted">
                    <div className="h-full rounded gradient-brand" style={{ width: `${pct}%`, opacity: 1 - i*0.12 }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Revenue per provider</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={providers} margin={{ left: -10 }} layout="vertical">
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={v=>`$${v/1000}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" width={120} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="var(--chart-2)" radius={[0,3,3,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
