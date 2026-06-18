import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Heart, Activity, Droplet, Scale, Watch, Phone, AlertTriangle, ChevronRight, Wifi } from "lucide-react";

export const Route = createFileRoute("/admin/telehealth")({
  head: () => ({ meta: [{ title: "Telehealth & RPM — ARCA Rx" }] }),
  component: Telehealth,
});

const waiting = [
  { patient: "Eliana Ruiz",     reason: "HRT follow-up",       wait: "0:42", provider: "Dr. Chen",   status: "ready"    },
  { patient: "Naomi Carter",    reason: "Lab review",          wait: "2:18", provider: "Dr. Patel",  status: "ready"    },
  { patient: "Harper Nakamura", reason: "Med titration",       wait: "—",    provider: "S. Whitfield", status: "scheduled" },
  { patient: "Yusuf Aydin",     reason: "Post-op check",       wait: "—",    provider: "Dr. Chen",   status: "scheduled" },
];

const rpmDevices = [
  { kind: "BP cuff",        n: 142, active: 128, color: "var(--teal)",    icon: Heart   },
  { kind: "CGM",            n:  98, active:  92, color: "var(--info)",    icon: Droplet },
  { kind: "Smart scale",    n: 184, active: 156, color: "var(--success)", icon: Scale   },
  { kind: "Wearable HR",    n: 221, active: 198, color: "var(--primary)", icon: Watch   },
];

const rpmAlerts = [
  { patient: "Eliana Ruiz",    metric: "BP",      reading: "168/102", trend: "↑ 14d", severity: "high",   action: "Med adjust"   },
  { patient: "Marcus Kim",     metric: "Glucose", reading: "238 mg/dL postprandial", trend: "↑ 7d", severity: "high",  action: "Call patient" },
  { patient: "Owen Pham",      metric: "Weight",  reading: "+4.2 lb / 7d",  trend: "↑ rapid", severity: "med",  action: "RN outreach" },
  { patient: "Imani Brooks",   metric: "Resting HR", reading: "94 bpm",     trend: "↑ 10d", severity: "med",  action: "Check meds"  },
  { patient: "Naomi Carter",   metric: "BP",      reading: "146/92",  trend: "↑ 5d",  severity: "low",   action: "Recheck 1wk"  },
];

const liveStream = [
  { p: "Eliana Ruiz",    metric: "Systolic", v: 168, range: [110, 140], status: "alert" },
  { p: "Eliana Ruiz",    metric: "Diastolic",v: 102, range: [70, 90],   status: "alert" },
  { p: "Marcus Kim",     metric: "Glucose",  v: 238, range: [70, 180],  status: "alert" },
  { p: "Owen Pham",      metric: "Weight",   v: 198, range: [185, 200], status: "ok"    },
  { p: "Harper Nakamura",metric: "HR avg",   v: 72,  range: [60, 100],  status: "ok"    },
  { p: "Imani Brooks",   metric: "HR rest",  v: 94,  range: [50, 80],   status: "warn"  },
];

function Bar({ v, range, status }: { v: number; range: [number, number]; status: string }) {
  const min = range[0] * 0.8, max = range[1] * 1.25, span = max - min;
  const pct = Math.max(0, Math.min(100, ((v - min) / span) * 100));
  const rMin = ((range[0] - min) / span) * 100;
  const rW   = ((range[1] - range[0]) / span) * 100;
  const color = status === "alert" ? "var(--danger)" : status === "warn" ? "var(--warning)" : "var(--success)";
  return (
    <div className="relative h-2 w-full rounded-full bg-muted">
      <div className="absolute h-full rounded-full bg-[color:var(--success)]/15" style={{ left: `${rMin}%`, width: `${rW}%` }} />
      <div className="absolute top-1/2 -mt-1.5 h-3 w-3 -translate-x-1/2 rounded-full ring-2 ring-card" style={{ left: `${pct}%`, background: color }} />
    </div>
  );
}

function Telehealth() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clinical · Virtual care"
        title="Telehealth & remote monitoring"
        description="Video visits, async messaging, and live vitals from 645 connected devices — care that doesn't stop at the clinic door."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><Phone className="mr-1.5 h-4 w-4" />Phone visit</Button>
            <Button size="sm" className="h-9 gradient-brand text-white"><Video className="mr-1.5 h-4 w-4" />Start video visit</Button>
          </div>
        }
      />

      <Tabs defaultValue="visits">
        <TabsList>
          <TabsTrigger value="visits"><Video className="mr-1.5 h-3.5 w-3.5" />Video visits</TabsTrigger>
          <TabsTrigger value="rpm"><Activity className="mr-1.5 h-3.5 w-3.5" />Remote monitoring · 645 devices</TabsTrigger>
        </TabsList>

        {/* VIDEO VISITS */}
        <TabsContent value="visits">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Mock video tile */}
            <Card className="surface-elevated lg:col-span-2 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,color-mix(in_oklab,var(--teal)_15%,transparent)_0%,transparent_60%)]" />
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--danger)]/90 px-2.5 py-1 text-[10px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />LIVE · 08:42
                  </span>
                  <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] text-white"><Wifi className="mr-1 inline h-3 w-3" />HD · 2.4 Mbps</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Eliana Ruiz</p>
                    <p className="text-[11px] text-white/70">HRT follow-up · with Dr. Chen</p>
                  </div>
                  <div className="aspect-video h-24 overflow-hidden rounded-md border-2 border-white/30 bg-gradient-to-br from-slate-700 to-slate-900">
                    <div className="flex h-full items-center justify-center text-[10px] text-white/60">You</div>
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.2em] text-white/30">patient video</div>
              </div>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9">Mute</Button>
                  <Button variant="outline" size="sm" className="h-9">Camera</Button>
                  <Button variant="outline" size="sm" className="h-9">Share screen</Button>
                  <Button variant="outline" size="sm" className="h-9">Captions</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9">Invite</Button>
                  <Button size="sm" className="h-9 bg-[color:var(--danger)] hover:bg-[color:var(--danger)]/90">End visit</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-elevated">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Virtual waiting room</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0">
                {waiting.map((w) => (
                  <div key={w.patient} className="flex items-center justify-between rounded-md border bg-card px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{w.patient}</p>
                      <p className="text-[10px] text-muted-foreground">{w.reason} · {w.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {w.status === "ready"
                        ? <Badge className="badge-active">Waiting {w.wait}</Badge>
                        : <Badge variant="outline" className="text-[10px]">Scheduled</Badge>}
                      {w.status === "ready" && <Button size="sm" className="h-7 text-xs">Admit</Button>}
                    </div>
                  </div>
                ))}
                <div className="mt-3 rounded-md border border-[color:var(--teal)]/20 bg-[color:var(--teal)]/[0.04] p-3 text-xs">
                  <p className="font-medium">Async messaging · 12 open</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Billable @ $35 avg · respond w/in 24h SLA</p>
                  <Button variant="outline" size="sm" className="mt-2 h-7 w-full text-xs">Open inbox <ChevronRight className="ml-1 h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* RPM */}
        <TabsContent value="rpm">
          {/* Device fleet */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {rpmDevices.map((d) => (
              <Card key={d.kind} className="surface-elevated">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">{d.kind}</p>
                    <d.icon className="h-4 w-4" style={{ color: d.color }} />
                  </div>
                  <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{d.active}<span className="text-base text-muted-foreground">/{d.n}</span></p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full" style={{ width: `${(d.active/d.n)*100}%`, background: d.color }} />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">{Math.round((d.active/d.n)*100)}% syncing · 24h</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* Live stream */}
            <Card className="surface-elevated">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">Live readings · last 5 min</CardTitle>
                <Badge variant="outline" className="text-[10px]"><span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--success)] inline-block" />Streaming</Badge>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {liveStream.map((r, i) => (
                  <div key={i} className="rounded-md border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium">{r.p}</p>
                        <p className="text-[10px] text-muted-foreground">{r.metric} · target {r.range[0]}–{r.range[1]}</p>
                      </div>
                      <p className={`font-mono text-base tabular-nums ${r.status === "alert" ? "text-[color:var(--danger)]" : r.status === "warn" ? "text-[color:var(--warning)]" : "text-foreground"}`}>{r.v}</p>
                    </div>
                    <div className="mt-2"><Bar v={r.v} range={r.range as [number,number]} status={r.status} /></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="surface-elevated">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">RPM alerts queue</CardTitle>
                <Badge variant="outline" className="border-[color:var(--danger)]/40 text-[10px] text-[color:var(--danger)]"><AlertTriangle className="mr-1 h-3 w-3" />2 high</Badge>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {rpmAlerts.map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border bg-card p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{a.patient}</p>
                        <Badge variant="outline" className="text-[10px]">{a.metric}</Badge>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{a.reading} · <span className={a.severity === "high" ? "text-[color:var(--danger)]" : "text-[color:var(--warning)]"}>{a.trend}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.severity === "high" && <Badge variant="outline" className="border-[color:var(--danger)]/40 text-[color:var(--danger)]">High</Badge>}
                      {a.severity === "med"  && <Badge variant="outline" className="border-[color:var(--warning)]/40 text-[color:var(--warning)]">Med</Badge>}
                      {a.severity === "low"  && <Badge variant="outline">Low</Badge>}
                      <Button size="sm" variant="outline" className="h-7 text-xs">{a.action}</Button>
                    </div>
                  </div>
                ))}
                <div className="mt-2 rounded-md border bg-gradient-to-br from-[color:var(--teal)]/8 to-transparent p-3 text-[11px] text-muted-foreground">
                  RPM CPT 99457 · <span className="font-mono text-foreground">$48.10</span> per 20-min care interaction · this month <span className="font-mono text-[color:var(--success)]">$6,184</span> captured
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
