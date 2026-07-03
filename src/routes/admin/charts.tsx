import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { patients } from "@/lib/data/patients";
import { FileText, Plus, Edit3 } from "lucide-react";

export const Route = createFileRoute("/admin/charts")({
  head: () => ({ meta: [{ title: "Charts - ARCA Rx" }] }),
  component: Charts,
});

function Charts() {
  const navigate = useNavigate();
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clinical"
        title="Charts / EMR"
        description="SOAP notes, treatment maps, photo timelines, consents - all in one ledger."
        actions={<Button size="sm" className="h-9 gradient-brand text-white" onClick={() => toast.info("New encounter", { description: "Draft it automatically with the AI Scribe.", action: { label: "Open AI Scribe", onClick: () => navigate({ to: "/admin/scribe" }) } })}><Plus className="mr-1.5 h-4 w-4" />New encounter</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-elevated lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent charts</CardTitle></CardHeader>
          <CardContent className="space-y-1 pt-0">
            {patients.map((p,i) => (
              <button key={p.id} onClick={() => toast.info(`${p.firstName} ${p.lastName}`, { description: `Last visit ${p.lastVisitDate}` })} className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left ${i===0?"bg-muted":"hover:bg-muted/50"}`}>
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.firstName} {p.lastName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{p.lastVisitDate} · {p.tags[0] ?? ""}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card className="surface-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-semibold">{patients[0].firstName} {patients[0].lastName} · Encounter</CardTitle>
              <p className="text-[11px] text-muted-foreground">Jun 5, 2026 · Neurotoxin 40u · Dr. Chen</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("Edit encounter", { description: "Update the SOAP note, codes, and charges." })}><Edit3 className="mr-1.5 h-3.5 w-3.5" />Edit</Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-sm">
            {[
              { label: "Subjective", body: "Pt presents for routine neurotoxin maintenance. Reports satisfaction with last treatment. No adverse events. Wishes to soften glabella + crows feet." },
              { label: "Objective", body: "VS WNL. Skin: no lesions. Forehead lines moderate at rest, severe with animation. No asymmetry." },
              { label: "Assessment", body: "Hyperdynamic glabellar + orbicularis activity. Good candidate for neurotoxin." },
              { label: "Plan", body: "Botox 40u: Glabella 20u, Crows 8u/side, Frontalis 4u. F/u 2 weeks. Patient consented." },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--teal)]">{s.label}</p>
                <p className="mt-1 leading-relaxed">{s.body}</p>
              </div>
            ))}
            <div className="rounded-md border bg-muted/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Treatment map · units injected</p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
                {[["Glabella",20],["Frontalis",4],["Crows L",4],["Crows R",4],["Lip flip",4],["Masseter L",2]].map(([z,u]) => (
                  <div key={z as string} className="rounded-md border bg-card p-2">
                    <p className="text-muted-foreground">{z}</p>
                    <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">{u}u</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-[color:var(--success)]/30 bg-[color-mix(in_oklab,var(--success)_8%,transparent)] p-3 text-sm">
              <span>Consent signed · e-signature on file</span>
              <Badge variant="outline" className="badge-active">Signed</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
