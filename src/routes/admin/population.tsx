import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateModal } from "@/components/shell/CreateButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, TrendingUp, AlertTriangle, Mail, Phone, MessageSquare, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/population")({
  head: () => ({ meta: [{ title: "Population Health - ARCA Rx" }] }),
  component: Population,
});

const registries = [
  { name: "Diabetes type 2",        size: 184, gaps: 38, due: 12, color: "var(--teal)" },
  { name: "Hypertension",           size: 312, gaps: 64, due: 22, color: "var(--info)" },
  { name: "Hyperlipidemia",         size: 248, gaps: 51, due: 17, color: "var(--warning)" },
  { name: "Hormone optimization",   size: 168, gaps: 28, due:  9, color: "var(--primary)" },
  { name: "Weight management",      size: 296, gaps: 42, due: 18, color: "var(--success)" },
  { name: "Annual wellness",        size: 894, gaps:189, due: 76, color: "var(--danger)" },
];

const gaps = [
  { patient: "Eliana Ruiz",     mrn: "APX-10293", gap: "A1c overdue (12mo)",              registry: "T2DM",     severity: "high",  due: "31d overdue",   action: "Order + outreach" },
  { patient: "Owen Pham",       mrn: "APX-10288", gap: "BP not at goal <130/80",          registry: "HTN",      severity: "high",  due: "Last 142/88",   action: "Med titration"    },
  { patient: "Naomi Carter",    mrn: "APX-10271", gap: "Annual physical",                  registry: "Wellness", severity: "med",   due: "Due in 21d",    action: "Auto-book"        },
  { patient: "Yusuf Aydin",     mrn: "APX-10260", gap: "Lipid panel (12mo)",               registry: "HLD",      severity: "med",   due: "Due in 14d",    action: "SMS reminder"     },
  { patient: "Harper Nakamura", mrn: "APX-10254", gap: "DEXA scan baseline",               registry: "Hormones", severity: "low",   due: "New patient",   action: "Order"            },
  { patient: "Imani Brooks",    mrn: "APX-10241", gap: "Mammography screening",            registry: "Wellness", severity: "high",  due: "47d overdue",   action: "Outreach"         },
  { patient: "Marcus Kim",      mrn: "APX-10232", gap: "Eye exam (diabetic retinopathy)",  registry: "T2DM",     severity: "high",  due: "92d overdue",   action: "Refer + book"     },
];

const quality = [
  { measure: "HbA1c <8 (diabetics)",       num: 142, denom: 184, target: 80, code: "CMS122" },
  { measure: "BP <140/90 (hypertensives)", num: 251, denom: 312, target: 75, code: "CMS165" },
  { measure: "Statin therapy in ASCVD",    num:  98, denom: 124, target: 80, code: "CMS347" },
  { measure: "Tobacco cessation counsel",  num: 178, denom: 224, target: 85, code: "CMS138" },
  { measure: "Depression screening (PHQ)", num: 421, denom: 894, target: 70, code: "CMS2"   },
  { measure: "BMI screening + follow-up",  num: 712, denom: 894, target: 85, code: "CMS69"  },
];

const campaigns = [
  { name: "Overdue A1c - diabetics",    channel: "SMS+Email", sent: 38, opened: 31, booked: 14, status: "running"   },
  { name: "Annual physicals Q3",         channel: "Email",     sent: 189,opened:124, booked: 62, status: "running"   },
  { name: "Statin recommendation",       channel: "Portal+Call",sent:  26,opened: 22, booked: 11, status: "running"   },
  { name: "Mammogram reminder",          channel: "SMS",       sent:  47,opened: 41, booked: 19, status: "scheduled" },
];

function Population() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="space-y-5 p-4 md:p-8">
      <CreateModal
        open={creating}
        onClose={() => setCreating(false)}
        title="New registry"
        description="Define a patient cohort by condition, measure, or custom filter."
        submitLabel="Create registry"
        fields={[
          { name: "name", label: "Registry name", placeholder: "e.g. Diabetes type 2" },
          { name: "condition", label: "Condition / measure", type: "select", options: ["Diabetes type 2", "Hypertension", "Hyperlipidemia", "Hormone optimization", "Weight management", "Annual wellness"] },
          { name: "criteria", label: "Inclusion criteria", type: "textarea", placeholder: "A1c > 7, last visit > 6 months, no lab in 90 days…" },
        ]}
      />
      <PageHeader
        eyebrow="Clinical · Population Health"
        title="Care gaps & quality measures"
        description="Every patient panel, every overdue screening, every quality gap - closed before it becomes a problem."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setCreating(true)}><Plus className="mr-1.5 h-4 w-4" />New registry</Button>
            <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => toast.success("Outreach queued", { description: "124 patients will receive care-gap reminders across SMS, email, and call." })}><Target className="mr-1.5 h-4 w-4" />Run outreach (124)</Button>
          </div>
        }
      />

      {/* Hero KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Patients in registries", v: "2,102", s: "across 6 panels",          i: Users      },
          { l: "Open care gaps",          v: "412",   s: "154 high priority",        i: AlertTriangle },
          { l: "Closed this month",       v: "186",   s: "+34% vs last",             i: TrendingUp },
          { l: "Quality score",           v: "84",    s: "MIPS composite · top 10%", i: Target     },
        ].map((k) => (
          <Card key={k.l} className="surface-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k.l}</p>
                <k.i className="h-4 w-4 text-[color:var(--teal)]" />
              </div>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{k.v}</p>
              <p className="text-[11px] text-muted-foreground">{k.s}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registries */}
      <Card className="surface-elevated">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Patient registries</CardTitle></CardHeader>
        <CardContent className="grid gap-3 pt-0 sm:grid-cols-2 lg:grid-cols-3">
          {registries.map((r) => (
            <button key={r.name} onClick={() => toast.info(`${r.name} registry`, { description: `${r.size} patients · ${r.gaps} open care gaps · ${r.due} due within 30 days.` })} className="group rounded-lg border bg-card p-4 text-left transition hover:border-[color:var(--teal)]/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.name}</p>
                <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">{r.size}</p>
              <p className="text-[11px] text-muted-foreground">patients</p>
              <div className="mt-3 flex items-center justify-between border-t pt-2">
                <span className="text-[10px] text-muted-foreground"><span className="font-mono text-[color:var(--danger)]">{r.gaps}</span> gaps</span>
                <span className="text-[10px] text-muted-foreground"><span className="font-mono text-[color:var(--warning)]">{r.due}</span> due 30d</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="gaps">
        <TabsList>
          <TabsTrigger value="gaps">Care gaps worklist</TabsTrigger>
          <TabsTrigger value="quality">HEDIS / MIPS measures</TabsTrigger>
          <TabsTrigger value="campaigns">Outreach campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="gaps">
          <Card className="surface-elevated">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">Patient</th>
                      <th className="px-3 py-2 text-left">Gap</th>
                      <th className="px-3 py-2 text-left">Registry</th>
                      <th className="px-3 py-2 text-left">Severity</th>
                      <th className="px-3 py-2 text-left">Due</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {gaps.map((g) => (
                      <tr key={g.patient + g.gap} className="hover:bg-muted/30">
                        <td className="px-3 py-2">
                          <p className="font-medium">{g.patient}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{g.mrn}</p>
                        </td>
                        <td className="px-3 py-2">{g.gap}</td>
                        <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{g.registry}</Badge></td>
                        <td className="px-3 py-2">
                          {g.severity === "high" && <Badge variant="outline" className="border-[color:var(--danger)]/40 text-[color:var(--danger)]">High</Badge>}
                          {g.severity === "med"  && <Badge variant="outline" className="border-[color:var(--warning)]/40 text-[color:var(--warning)]">Med</Badge>}
                          {g.severity === "low"  && <Badge variant="outline">Low</Badge>}
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{g.due}</td>
                        <td className="px-3 py-2 text-right"><Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success(`${g.action} · ${g.patient}`, { description: `Action logged for "${g.gap}".` })}>{g.action}</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card className="surface-elevated">
            <CardContent className="space-y-2 p-4">
              {quality.map((q) => {
                const pct = Math.round((q.num / q.denom) * 100);
                const hit = pct >= q.target;
                return (
                  <div key={q.measure} className="rounded-md border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{q.measure}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{q.code} · {q.num} / {q.denom} · target ≥{q.target}%</p>
                      </div>
                      <span className={`font-mono text-lg font-semibold tabular-nums ${hit ? "text-[color:var(--success)]" : "text-[color:var(--warning)]"}`}>{pct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="relative h-full" style={{ width: `${pct}%`, background: hit ? "var(--success)" : "var(--warning)" }} />
                    </div>
                    <div className="relative mt-[-8px] h-2">
                      <div className="absolute top-0 h-2 w-px bg-foreground/40" style={{ left: `${q.target}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card className="surface-elevated">
            <CardContent className="space-y-2 p-4">
              {campaigns.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-md border bg-card p-3">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {c.channel.includes("SMS")    && <MessageSquare className="mr-1 inline h-3 w-3" />}
                      {c.channel.includes("Email")  && <Mail className="mr-1 inline h-3 w-3" />}
                      {c.channel.includes("Call")   && <Phone className="mr-1 inline h-3 w-3" />}
                      {c.channel}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right"><p className="text-[10px] text-muted-foreground">Sent</p><p className="font-mono tabular-nums">{c.sent}</p></div>
                    <div className="text-right"><p className="text-[10px] text-muted-foreground">Opened</p><p className="font-mono tabular-nums">{c.opened}</p></div>
                    <div className="text-right"><p className="text-[10px] text-muted-foreground">Booked</p><p className="font-mono text-[color:var(--success)] tabular-nums">{c.booked}</p></div>
                    <Badge className={c.status === "running" ? "badge-active" : "bg-muted text-muted-foreground"}>{c.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
