import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { patients } from "@/lib/seed-data";
import { ArrowLeft, Phone, Mail, Calendar, FileText, CreditCard, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/patients/$id")({
  head: () => ({ meta: [{ title: "Patient profile — ARCA Rx" }] }),
  component: PatientProfile,
});

const TABS = ["Overview","Encounters","Photos","Prescriptions","Labs","Invoices","Membership","Notes","Documents","Activity"];

function PatientProfile() {
  const { id } = Route.useParams();
  const p = patients.find(x => x.id === id) ?? patients[0];
  return (
    <div className="space-y-5 p-4 md:p-8">
      <Link to="/admin/patients" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />Back to patients
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row">
        <Card className="surface-elevated lg:w-80 shrink-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full gradient-brand flex items-center justify-center text-lg font-semibold text-white">
                {p.name.split(" ").map(w => w[0]).slice(0,2).join("")}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="font-mono text-xs text-muted-foreground">{p.mrn}</p>
              </div>
            </div>
            <Badge variant="secondary" className="mt-3">{p.tag}</Badge>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />(512) 555-0118</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{p.name.split(" ")[0].toLowerCase()}@email.com</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" />DOB · Aug 14, 1989</div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-md border bg-card/60 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">LTV</p>
                <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">${(p.ltv/1000).toFixed(1)}k</p>
              </div>
              <div className="rounded-md border bg-card/60 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Visits</p>
                <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">24</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button size="sm" className="w-full gradient-brand text-white"><Sparkles className="mr-1.5 h-4 w-4" />Book visit</Button>
              <Button size="sm" variant="outline" className="w-full"><CreditCard className="mr-1.5 h-4 w-4" />Charge / POS</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-1.5 border-b pb-2">
            {TABS.map((t,i) => (
              <button key={t} className={`px-3 py-1.5 text-xs rounded-md ${i===0?"bg-muted font-semibold text-foreground":"text-muted-foreground hover:bg-muted/50"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="surface-elevated">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Active protocols</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0 text-sm">
                {[
                  { name: "Semaglutide 1.5mg weekly", since: "Mar 2026", status: "Active" },
                  { name: "Bioidentical Estrogen 0.5mg", since: "Jan 2026", status: "Active" },
                  { name: "NAD+ IV monthly", since: "Apr 2026", status: "Active" },
                ].map(x => (
                  <div key={x.name} className="flex items-center justify-between rounded-md border bg-card/60 p-2.5">
                    <div><p className="font-medium">{x.name}</p><p className="text-xs text-muted-foreground">Since {x.since}</p></div>
                    <Badge variant="outline" className="badge-active">{x.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="surface-elevated">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent encounters</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0 text-sm">
                {[
                  { d: "Jun 5", t: "Filler · Lips 1mL", p: "S. Whitfield", a: 850 },
                  { d: "May 22", t: "Hormone Follow-up", p: "Dr. Patel", a: 289 },
                  { d: "May 8", t: "Neurotoxin 40u", p: "Dr. Chen", a: 560 },
                  { d: "Apr 30", t: "NAD+ IV 500mg", p: "M. Okonkwo", a: 425 },
                ].map((x,i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{x.t}</p>
                        <p className="text-xs text-muted-foreground">{x.d} · {x.p}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm tabular-nums">${x.a}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
