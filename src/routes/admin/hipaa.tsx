import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/hipaa")({
  head: () => ({ meta: [{ title: "HIPAA Log — ARCA Rx" }] }),
  component: Hipaa,
});

const events = Array.from({ length: 10 }).map((_, i) => ({
  id: i, who: ["Jordan Lee","Dr. Chen","S. Whitfield","Front Desk"][i%4],
  action: ["viewed chart","exported lab","updated allergies","printed invoice","sent SMS"][i%5],
  patient: ["Eliana Ruiz","Owen Pham","Naomi Carter","Harper Nakamura"][i%4],
  when: `${i*3+2}m ago`, ip: `10.0.${(i%5)+1}.${(i*7)%240}`,
}));

function Hipaa() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader eyebrow="Compliance" title="HIPAA Activity Log" description="Tamper-evident audit trail · 30-day retention default · exports nightly to cold storage." />
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { l: "Access events · 7d", v: "12,847" },
          { l: "Exports", v: "284" },
          { l: "Failed auth attempts", v: "0" },
        ].map(s => (
          <Card key={s.l} className="surface-elevated"><CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.l}</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.v}</p>
          </CardContent></Card>
        ))}
      </div>
      <Card className="surface-elevated">
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-[color:var(--success)]" />Audit trail</CardTitle></CardHeader>
        <CardContent className="space-y-0 pt-0">
          {events.map(e => (
            <div key={e.id} className="flex items-center justify-between border-b py-2.5 text-sm last:border-0">
              <div>
                <p><span className="font-medium">{e.who}</span> {e.action} for <span className="font-medium">{e.patient}</span></p>
                <p className="text-[11px] text-muted-foreground font-mono">IP {e.ip} · {e.when}</p>
              </div>
              <Badge variant="outline" className="badge-active text-[10px]">verified</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
