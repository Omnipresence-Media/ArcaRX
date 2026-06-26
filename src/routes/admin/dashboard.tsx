import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { ArrowUpRight, Plus, AlertTriangle, Sparkles, TrendingUp, Users, DollarSign, Calendar, Activity, CheckCircle2, Clock, AlertCircle, ChevronRight, DoorOpen, Timer, UserCheck, BedDouble } from "lucide-react";
import { usePatients } from "@/hooks/queries/usePatients";
import { useTodaySchedule } from "@/hooks/queries/useAppointments";
import { locations } from "@/lib/data/locations";
import { providers } from "@/lib/data/providers";
import { revenueSeries, mrrSeries, membershipMix, alerts as seedAlerts, recentActivity, kpis } from "@/lib/seed-data";
import { OnboardingChecklist } from "@/components/shell/OnboardingChecklist";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Command Center - ArcaRX" }] }),
  component: Dashboard,
});

const CHECKIN_TIMES: Record<string, string> = {
  "apt-1": "08:27",
  "apt-2": "08:52",
};

function waitMinutes(checkInTime: string, now: Date): number {
  const [h, m] = checkInTime.split(":").map(Number);
  return Math.max(0, (now.getHours() - h) * 60 + (now.getMinutes() - m));
}

function WaitingRoom({ schedule }: { schedule: any[] }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const checkedIn = schedule.filter((a) => a.status === "checked-in" || a.status === "in-room");
  const upNext = schedule.filter((a) => a.status === "scheduled").slice(0, 3);

  if (checkedIn.length === 0 && upNext.length === 0) return null;

  return (
    <Card className="surface-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <DoorOpen className="h-4 w-4 text-[color:var(--teal)]" />
            Waiting Room
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {checkedIn.length} in clinic
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {checkedIn.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">In clinic now</p>
            {checkedIn.map((a) => {
              const prov = providers.find((p) => p.id === a.providerId);
              const checkIn = CHECKIN_TIMES[a.id] ?? a.time;
              const waited = now ? waitMinutes(checkIn, now) : 0;
              const isOverdue = waited > 20;
              const statusIcon = a.status === "in-room"
                ? <BedDouble className="h-3.5 w-3.5 text-emerald-400" />
                : <UserCheck className="h-3.5 w-3.5 text-amber-400" />;
              return (
                <div key={a.id} className={`flex items-center gap-3 rounded-md border p-3 ${a.status === "in-room" ? "border-emerald-500/20 bg-emerald-500/5" : isOverdue ? "border-red-500/20 bg-red-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                  {statusIcon}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.patientName}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.type} · {prov?.name?.replace("Dr. ", "")}</p>
                  </div>
                  {a.roomNumber && (
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">Rm {a.roomNumber}</span>
                  )}
                  <div className={`flex items-center gap-1 text-xs shrink-0 ${isOverdue ? "text-red-400" : "text-muted-foreground"}`}>
                    <Timer className="h-3 w-3" />
                    {waited}m
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${a.status === "in-room" ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"}`}>
                    {a.status === "in-room" ? "In room" : "Checked in"}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
        {upNext.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Up next</p>
            {upNext.map((a) => {
              const prov = providers.find((p) => p.id === a.providerId);
              return (
                <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground w-10">{a.time}</span>
                    <div>
                      <span className="text-xs font-medium">{a.patientName}</span>
                      <span className="text-xs text-muted-foreground"> · {a.type}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">{prov?.name?.replace("Dr. ", "")}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Sparkline({ data, color = "var(--teal)" }: { data: number[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const statusStyle: Record<string, string> = {
  "checked-in": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "in-room": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "scheduled": "bg-muted text-muted-foreground",
  "completed": "bg-muted text-muted-foreground",
  "no-show": "bg-red-500/10 text-red-400 border-red-500/20",
};

const memberColor: Record<string, string> = { Platinum: "#a78bfa", Gold: "#fbbf24", Silver: "#94a3b8", None: "#6b7280" };
const PIE_COLORS = ["#a78bfa", "#fbbf24", "#94a3b8"];

function Dashboard() {
  const [today, setToday] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("loc-atx");

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
  }, []);

  const { data: patients = [], isLoading: patientsLoading } = usePatients({ locationId: selectedLocation });
  const { data: todaySchedule = [], isLoading: scheduleLoading } = useTodaySchedule(selectedLocation);

  const totalRevenue = todaySchedule.filter(a => a.status === "completed").length * 420;
  const memberCount = patients.filter(p => p.membershipTier !== "None").length;
  const highRisk = patients.filter(p => p.risk === "high").length;

  const liveKpis = [
    { label: "Today's Revenue", value: patientsLoading ? null : `$${(4280).toLocaleString()}`, delta: "+18.2%", up: true, spark: kpis[0].spark, icon: DollarSign },
    { label: "Appointments", value: scheduleLoading ? null : `${todaySchedule.length}`, delta: "+3 vs avg", up: true, spark: kpis[1].spark, icon: Calendar },
    { label: "Active Members", value: patientsLoading ? null : memberCount.toString(), delta: "+2 MTD", up: true, spark: kpis[2].spark, icon: Users },
    { label: "Monthly Recurring", value: "$48,279", delta: "+6.4%", up: true, spark: kpis[3].spark, icon: TrendingUp },
  ];

  const memberMix = [
    { name: "Platinum", value: patients.filter(p => p.membershipTier === "Platinum").length || 6 },
    { name: "Gold", value: patients.filter(p => p.membershipTier === "Gold").length || 8 },
    { name: "Silver", value: patients.filter(p => p.membershipTier === "Silver").length || 6 },
  ];

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">
            ArcaRX Command Center · {today}
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight md:text-[34px]">Good morning.</h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            Practice is pacing <span className="font-medium text-foreground">+18.2%</span> ahead of target.
            {scheduleLoading ? " Loading schedule..." : ` ${todaySchedule.length} appointments today - ${todaySchedule.filter(a => a.status === "checked-in" || a.status === "in-room").length} require attention.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md border overflow-hidden">
            {locations.map(l => (
              <button key={l.id} onClick={() => setSelectedLocation(l.id)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedLocation === l.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}>
                {l.city.split(",")[0]}
              </button>
            ))}
          </div>
          <Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />New appointment</Button>
        </div>
      </div>

      {highRisk > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <p className="text-sm"><span className="font-semibold text-red-400">{highRisk} high-risk patients</span> in this location need follow-up. <Link to="/admin/patients" className="underline text-red-400">Review now</Link></p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {liveKpis.map((k) => (
          <Card key={k.label} className="surface-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</p>
                <k.icon className="h-4 w-4 text-muted-foreground/40" />
              </div>
              {k.value === null
                ? <Skeleton className="mt-2 h-8 w-24" />
                : <p className="mt-1 text-2xl font-semibold tabular-nums">{k.value}</p>
              }
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-emerald-400 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />{k.delta}</span>
              </div>
              <div className="mt-2"><Sparkline data={k.spark} /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <WaitingRoom schedule={todaySchedule} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Revenue · 30 days</CardTitle>
            <Badge variant="outline" className="text-[10px]">Target $4,200/day</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="target" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false} strokeWidth={1} />
                <Area type="monotone" dataKey="revenue" stroke="var(--teal)" fill="url(#rev)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Membership mix</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center pt-0">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={memberMix} cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={3} dataKey="value">
                  {memberMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [v, n]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1.5 mt-1">
              {memberMix.map((m, i) => (
                <div key={m.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />{m.name}</div>
                  <span className="font-mono font-medium">{m.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Today's schedule</CardTitle>
            <Link to="/admin/calendar" className="text-xs text-[color:var(--teal)] hover:underline flex items-center gap-1">Full calendar <ChevronRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent className="pt-0">
            {scheduleLoading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : todaySchedule.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No appointments scheduled today.</div>
            ) : (
              <div className="space-y-2">
                {todaySchedule.map((a) => {
                  const prov = providers.find(p => p.id === a.providerId);
                  return (
                    <div key={a.id} className="flex items-center gap-3 rounded-md border bg-card/60 p-3">
                      <div className="w-12 text-center">
                        <p className="font-mono text-sm font-semibold">{a.time}</p>
                        <p className="text-[10px] text-muted-foreground">{a.duration}m</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to="/admin/patients/$id" params={{ id: a.patientId }} className="text-sm font-medium hover:text-[color:var(--teal)] truncate block">{a.patientName}</Link>
                        <p className="text-xs text-muted-foreground truncate">{a.type} · {prov?.name}</p>
                      </div>
                      {a.roomNumber && <span className="text-[10px] text-muted-foreground">Rm {a.roomNumber}</span>}
                      <Badge variant="outline" className={`text-[10px] ${statusStyle[a.status] ?? ""}`}>{a.status}</Badge>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">Chart</Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="surface-elevated">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-0">
              {seedAlerts.map((a) => (
                <div key={a.id} className={`flex gap-2.5 rounded-md border p-2.5 ${a.severity === "high" ? "border-red-500/20 bg-red-500/5" : a.severity === "med" ? "border-amber-500/20 bg-amber-500/5" : "border-border bg-card/60"}`}>
                  <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${a.severity === "high" ? "text-red-400" : a.severity === "med" ? "text-amber-400" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-medium">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground">{a.meta}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-elevated">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Provider utilization</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-0">
              {providers.slice(0, 4).map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate max-w-[140px]">{p.name.replace("Dr. ", "").replace(", MD", "").replace(", NP", "")}</span>
                    <span className="font-mono font-medium">{p.utilization}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[color:var(--teal)]" style={{ width: `${p.utilization}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="surface-elevated">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">MRR trend</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={mrrSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="mrr" fill="var(--teal)" radius={[3, 3, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <OnboardingChecklist />
    </div>
  );
}
