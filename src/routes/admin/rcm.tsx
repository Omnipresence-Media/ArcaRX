import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Receipt, AlertTriangle, CheckCircle2, Clock, ArrowUpRight,
  ArrowDownRight, FileWarning, Send, Filter, Download, Zap,
} from "lucide-react";

export const Route = createFileRoute("/admin/rcm")({
  head: () => ({ meta: [{ title: "Revenue Cycle - ARCA Rx" }] }),
  component: RCM,
});

const kpis = [
  { label: "A/R outstanding",     value: "$284,910", delta: "-4.2%", down: false, sub: "vs last 30d" },
  { label: "Days in A/R",         value: "32.4",     delta: "-3.1 days", down: false, sub: "target ≤35" },
  { label: "Clean claim rate",    value: "94.2%",    delta: "+1.8 pts", down: false, sub: "industry 85%" },
  { label: "Denial rate",         value: "6.1%",     delta: "-0.9 pts", down: false, sub: "$18.2k at risk" },
  { label: "Net collection rate", value: "97.8%",    delta: "+0.4 pts", down: false, sub: "of allowed" },
  { label: "First-pass yield",    value: "88.6%",    delta: "+2.3 pts", down: false, sub: "auto-adjudicated" },
];

const aging = [
  { bucket: "0–30",    amount: 142800, pct: 50, color: "var(--success)" },
  { bucket: "31–60",   amount:  78100, pct: 27, color: "var(--teal)" },
  { bucket: "61–90",   amount:  38400, pct: 14, color: "var(--warning)" },
  { bucket: "91–120",  amount:  16200, pct:  6, color: "var(--warning)" },
  { bucket: "120+",    amount:   9410, pct:  3, color: "var(--danger)" },
];

const denials = [
  { id:"D-3294", payer:"Aetna",          patient:"E. Ruiz",       cpt:"99214", reason:"CO-97 · Bundled service",       amount: 184, age:"4d", priority:"high"   },
  { id:"D-3287", payer:"BCBS TX",        patient:"M. Patel",      cpt:"J3490", reason:"CO-50 · Not medically necessary", amount: 612, age:"6d", priority:"high"   },
  { id:"D-3271", payer:"UHC",            patient:"O. Pham",       cpt:"96372", reason:"PR-204 · Non-covered",           amount:  48, age:"2d", priority:"med"    },
  { id:"D-3268", payer:"Cigna",          patient:"N. Carter",     cpt:"99213", reason:"CO-16 · Missing modifier 25",    amount: 142, age:"8d", priority:"high"   },
  { id:"D-3255", payer:"Humana",         patient:"H. Nakamura",   cpt:"82947", reason:"CO-11 · Dx inconsistent",        amount:  28, age:"11d",priority:"low"    },
  { id:"D-3241", payer:"Aetna",          patient:"I. Brooks",     cpt:"99215", reason:"CO-29 · Timely filing",          amount: 218, age:"14d",priority:"med"    },
];

const payers = [
  { name:"Aetna",        volume: 412, paid: 184200, denial: 4.8, days: 28, score: 92 },
  { name:"BCBS TX",      volume: 388, paid: 162800, denial: 6.2, days: 34, score: 84 },
  { name:"UHC",          volume: 301, paid: 128400, denial: 8.1, days: 41, score: 71 },
  { name:"Cigna",        volume: 224, paid:  98100, denial: 5.4, days: 31, score: 88 },
  { name:"Humana",       volume: 162, paid:  68900, denial: 7.2, days: 38, score: 78 },
  { name:"Medicare",     volume: 142, paid:  54200, denial: 3.1, days: 22, score: 96 },
];

const eligibility = [
  { patient:"Eliana Ruiz",     time:"9:00",  payer:"Aetna",   status:"active",   copay: 35, deductible:"$420 / $1,500" },
  { patient:"Owen Pham",       time:"9:30",  payer:"UHC",     status:"active",   copay: 40, deductible:"$0 / $750"    },
  { patient:"Naomi Carter",    time:"10:00", payer:"BCBS",    status:"warning",  copay: 50, deductible:"$1,500 met"   },
  { patient:"Yusuf Aydin",     time:"10:30", payer:"Cigna",   status:"inactive", copay:  0, deductible:"Term 5/31"    },
  { patient:"Harper Nakamura", time:"11:00", payer:"Aetna",   status:"active",   copay: 25, deductible:"$280 / $1,000"},
];

function RCM() {
  const total = aging.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Revenue · RCM Cockpit"
        title="Revenue cycle command"
        description="Real-time A/R, denials, eligibility, and payer performance - collect every dollar earned."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("837 file exported", { description: "Claims batch ready for clearinghouse upload." })}><Download className="mr-1.5 h-4 w-4" />Export 837</Button>
            <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => toast.success("Batch submitted", { description: "42 claims sent to payers for adjudication." })}><Send className="mr-1.5 h-4 w-4" />Submit batch (42)</Button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label} className="surface-elevated">
            <CardContent className="p-3.5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k.label}</p>
              <p className="mt-1 font-mono text-xl font-semibold tabular-nums">{k.value}</p>
              <div className="mt-1 flex items-center gap-1 text-[11px]">
                {k.down
                  ? <ArrowDownRight className="h-3 w-3 text-[color:var(--danger)]" />
                  : <ArrowUpRight className="h-3 w-3 text-[color:var(--success)]" />}
                <span className={k.down ? "text-[color:var(--danger)]" : "text-[color:var(--success)]"}>{k.delta}</span>
                <span className="text-muted-foreground">· {k.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* A/R aging */}
        <Card className="surface-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Accounts receivable aging</CardTitle>
              <p className="text-[11px] text-muted-foreground">Total outstanding · ${total.toLocaleString()}</p>
            </div>
            <Badge variant="outline" className="text-[10px]">Live · refreshed 2m ago</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex h-3 overflow-hidden rounded-full bg-muted">
              {aging.map((b) => (
                <div key={b.bucket} style={{ width: `${b.pct}%`, background: b.color }} title={`${b.bucket}: $${b.amount.toLocaleString()}`} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {aging.map((b) => (
                <div key={b.bucket} className="rounded-md border bg-card p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{b.bucket}d</p>
                  </div>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">${(b.amount/1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-muted-foreground">{b.pct}% of A/R</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's eligibility */}
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Today's eligibility</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0">
            {eligibility.map((e) => (
              <div key={e.patient} className="flex items-center justify-between rounded-md border bg-card px-2.5 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.patient}</p>
                  <p className="text-[10px] text-muted-foreground">{e.time} · {e.payer} · ${e.copay} copay · {e.deductible}</p>
                </div>
                {e.status === "active"   && <Badge className="badge-active gap-1"><CheckCircle2 className="h-3 w-3" />Active</Badge>}
                {e.status === "warning"  && <Badge variant="outline" className="gap-1 border-[color:var(--warning)]/40 text-[color:var(--warning)]"><Clock className="h-3 w-3" />Met</Badge>}
                {e.status === "inactive" && <Badge variant="outline" className="gap-1 border-[color:var(--danger)]/40 text-[color:var(--danger)]"><AlertTriangle className="h-3 w-3" />Inactive</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Denials + payer scorecard */}
      <Tabs defaultValue="denials">
        <TabsList>
          <TabsTrigger value="denials"><FileWarning className="mr-1.5 h-3.5 w-3.5" />Denial worklist · 24</TabsTrigger>
          <TabsTrigger value="payers"><Receipt className="mr-1.5 h-3.5 w-3.5" />Payer scorecard</TabsTrigger>
          <TabsTrigger value="codes"><Zap className="mr-1.5 h-3.5 w-3.5" />AI coding queue · 8</TabsTrigger>
        </TabsList>

        <TabsContent value="denials">
          <Card className="surface-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Denials - prioritized by dollar × age</CardTitle>
                <p className="text-[11px] text-muted-foreground">AI suggests appeal letter + supporting docs for each row.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info("Filter denials", { description: "Filter by payer, denial reason, age, or dollar amount." })}><Filter className="mr-1.5 h-3.5 w-3.5" />Filter</Button>
                <Button size="sm" className="h-8" onClick={() => toast.success("Auto-appeal started", { description: "Appeal letters generated and queued for the selected denials." })}><Zap className="mr-1.5 h-3.5 w-3.5" />Auto-appeal selected</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">Claim</th>
                      <th className="px-3 py-2 text-left">Payer</th>
                      <th className="px-3 py-2 text-left">Patient</th>
                      <th className="px-3 py-2 text-left">CPT</th>
                      <th className="px-3 py-2 text-left">Reason</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                      <th className="px-3 py-2 text-right">Age</th>
                      <th className="px-3 py-2 text-left">Priority</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {denials.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/30">
                        <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                        <td className="px-3 py-2">{d.payer}</td>
                        <td className="px-3 py-2">{d.patient}</td>
                        <td className="px-3 py-2 font-mono text-xs">{d.cpt}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{d.reason}</td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums">${d.amount}</td>
                        <td className="px-3 py-2 text-right text-xs text-muted-foreground">{d.age}</td>
                        <td className="px-3 py-2">
                          {d.priority === "high"
                            ? <Badge variant="outline" className="border-[color:var(--danger)]/40 text-[color:var(--danger)]">High</Badge>
                            : d.priority === "med"
                            ? <Badge variant="outline" className="border-[color:var(--warning)]/40 text-[color:var(--warning)]">Med</Badge>
                            : <Badge variant="outline">Low</Badge>}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.success("Appeal filed", { description: "A denial appeal was generated and submitted to the payer." })}>Appeal</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payers">
          <Card className="surface-elevated">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Payer performance - last 90 days</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-0">
              {payers.map((p) => (
                <div key={p.name} className="grid grid-cols-12 items-center gap-3 rounded-md border bg-card px-3 py-2.5">
                  <div className="col-span-2">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.volume} claims</p>
                  </div>
                  <div className="col-span-2"><p className="text-[10px] uppercase text-muted-foreground">Paid</p><p className="font-mono text-sm tabular-nums">${(p.paid/1000).toFixed(1)}k</p></div>
                  <div className="col-span-2"><p className="text-[10px] uppercase text-muted-foreground">Denial</p><p className="font-mono text-sm tabular-nums">{p.denial}%</p></div>
                  <div className="col-span-2"><p className="text-[10px] uppercase text-muted-foreground">Days to pay</p><p className="font-mono text-sm tabular-nums">{p.days}</p></div>
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <Progress value={p.score} className="h-2 flex-1" />
                      <span className="w-10 text-right font-mono text-xs tabular-nums">{p.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codes">
          <Card className="surface-elevated">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">AI coding suggestions</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-0">
              {[
                { enc:"E-4821", patient:"E. Ruiz",     ai:"99214 + 96372 + J1100",    confidence: 96, was:"99213"        },
                { enc:"E-4819", patient:"O. Pham",     ai:"99213 + Mod 25 + 11900",   confidence: 91, was:"99213"        },
                { enc:"E-4815", patient:"N. Carter",   ai:"99215 (HCC: E11.9, I10)",  confidence: 88, was:"99214"        },
                { enc:"E-4811", patient:"Y. Aydin",    ai:"Add G2211 prolonged care", confidence: 84, was:"99214"        },
              ].map((c) => (
                <div key={c.enc} className="flex items-center justify-between rounded-md border bg-card px-3 py-2.5">
                  <div>
                    <p className="text-sm"><span className="font-mono text-xs text-muted-foreground">{c.enc}</span> · {c.patient}</p>
                    <p className="text-[11px] text-muted-foreground">Coded as <span className="font-mono">{c.was}</span> → AI: <span className="font-mono text-foreground">{c.ai}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase text-muted-foreground">Conf {c.confidence}%</span>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast(`Kept original code for ${c.patient}`, { description: `Stays as ${c.was}.` })}>Reject</Button>
                    <Button size="sm" className="h-7 text-xs" onClick={() => toast.success(`AI code accepted · ${c.patient}`, { description: `Updated to ${c.ai}.` })}>Accept</Button>
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
