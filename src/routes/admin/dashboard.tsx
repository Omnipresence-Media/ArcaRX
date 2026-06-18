import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, Plus, AlertTriangle, Activity, Sparkles, Crown,
} from "lucide-react";
import {
  kpis, revenueSeries, providers, todaySchedule, alerts, practice, patients,
  membershipMix, recentActivity,
} from "@/lib/seed-data";
import { OnboardingChecklist } from "@/components/shell/OnboardingChecklist";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — ARCA Rx" },
      { name: "description", content: "Bloomberg-grade intelligence for your aesthetics practice." },
    ],
  }),
  component: Dashboard,
});

function Sparkline({ data, color = "var(--teal)" }: { data: number[]; color?: string }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={d}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const statusBadge: Record<string, string> = {
  "checked-in": "badge-active",
  "in-room": "badge-risk-low",
  scheduled: "",
};

function riskBadge(r: string) {
  return r === "high" ? "badge-risk-high" : r === "med" ? "badge-risk-med" : "badge-risk-low";
}

function Dashboard() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Hero */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">
            {practice.name} · {today}
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight md:text-[34px]">
            Good morning, Jordan.
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            Practice is pacing <span className="font-medium text-foreground">+18.2%</span> ahead of target.
            14 appointments today across 6 providers — 2 require your attention.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Sparkles className="mr-1.5 h-4 w-4 text-[color:var(--teal)]" />
            AI insights
          </Button>
          <Button size="sm" className="h-9 gradient-brand text-white hover:opacity-90">
            <Plus className="mr-1.5 h-4 w-4" />
            New appointment
          </Button>
        </div>
      </div>

      {/* Alert banner */}
      <div className="flex items-start gap-3 rounded-lg border border-[color:var(--warning)]/30 bg-[color-mix(in_oklab,var(--warning)_8%,transparent)] p-3.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--warning)]" />
        <div className="flex-1 text-sm">
          <span className="font-medium">Botox 100u is at 3 vials.</span>
          <span className="text-muted-foreground"> Auto-PO ready for 12 units · $6,300 to Allergan.</span>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs">Review PO</Button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const up = k.trend === "up";
          return (
            <Card key={k.label} className="surface-elevated group transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </p>
                  <span className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    up ? "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[color:var(--success)]"
                       : "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-destructive"
                  }`}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {k.delta}
                  </span>
                </div>
                <p className="mt-2 text-[26px] font-semibold tracking-tight tabular-nums">{k.value}</p>
                <div className="mt-1 -mx-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={k.spark} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main 62/38 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 surface-elevated">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-semibold">Revenue · last 30 days</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Daily collected vs $4,200 target</p>
            </div>
            <div className="flex gap-1 rounded-md border bg-muted/40 p-0.5 text-[11px]">
              {["30D","90D","YTD"].map((r,i) => (
                <button key={r} className={`px-2 py-0.5 rounded ${i===0 ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}>{r}</button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueSeries} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--teal)" strokeWidth={2} fill="url(#rev)" />
                <Line type="monotone" dataKey="target" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <OnboardingChecklist />
          <Card className="surface-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-[color:var(--risk-high)]" />
                Alerts queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-2 rounded-md border bg-card/60 p-2.5">
                  <div>
                    <p className="text-sm font-medium leading-tight">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.meta}</p>
                  </div>
                  <Badge variant="outline" className={
                    a.severity === "high" ? "badge-risk-high" :
                    a.severity === "med"  ? "badge-risk-med"  : "badge-risk-low"
                  }>{a.severity}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule + Membership health + Top performers */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="h-4 w-4 text-primary" />
              Today's schedule
              <Badge variant="secondary" className="ml-auto text-[10px]">{todaySchedule.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5 pt-0">
            {todaySchedule.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50">
                <span className="w-12 font-mono text-[11px] tabular-nums text-muted-foreground">{s.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.patient}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.type} · {s.provider}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${statusBadge[s.status] ?? ""}`}>{s.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Crown className="h-4 w-4 text-[color:var(--warning)]" />
              Membership health
            </CardTitle>
            <p className="text-xs text-muted-foreground">847 active · 96.4% retention</p>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={membershipMix} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={3} stroke="none">
                  {membershipMix.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {membershipMix.map((m) => (
                <div key={m.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: m.color }} />
                  <span className="flex-1">{m.name}</span>
                  <span className="font-mono tabular-nums text-muted-foreground">{m.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top performers · MTD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {providers.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-4 font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-[color:var(--teal)]" style={{ width: `${p.utilization}%` }} />
                  </div>
                </div>
                <span className="font-mono text-xs tabular-nums">${(p.revenue/1000).toFixed(1)}k</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Provider table + activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Provider performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Utilization</TableHead>
                  <TableHead className="text-right">Patients</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.role}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{p.utilization}%</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{p.patients}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">${p.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={p.status === "active" ? "badge-active" : "badge-risk-med"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 pt-0">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 border-b py-2.5 last:border-0">
                <div className="h-7 w-7 shrink-0 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                  {a.who.split(" ").map(w => w[0]).slice(0,2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-tight">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.when}</p>
                </div>
                {a.amount > 0 && (
                  <span className="font-mono text-xs tabular-nums text-[color:var(--success)]">
                    +${a.amount.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Patients */}
      <Card className="surface-elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Recent patients</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>MRN</TableHead>
                <TableHead>Last visit</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">LTV</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.mrn}</TableCell>
                  <TableCell className="text-xs">{p.lastVisit}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{p.tag}</Badge></TableCell>
                  <TableCell className="text-right font-mono tabular-nums">${p.ltv.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{p.balance > 0 ? `$${p.balance}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={riskBadge(p.risk)}>{p.risk}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
