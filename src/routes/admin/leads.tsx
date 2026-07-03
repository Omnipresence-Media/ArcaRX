import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { leads } from "@/lib/seed-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Leads - ARCA Rx" }] }),
  component: Leads,
});

const STAGES = [
  { id: "new",       label: "New lead",   color: "var(--chart-1)" },
  { id: "contacted", label: "Contacted",  color: "var(--chart-2)" },
  { id: "consulted", label: "Consulted",  color: "var(--chart-3)" },
  { id: "booked",    label: "Booked",     color: "var(--chart-4)" },
  { id: "won",       label: "Converted",  color: "var(--success)" },
];

function Leads() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Growth"
        title="Leads & Pipeline"
        description="1,240 leads in flight · $284k weighted pipeline · 17.2% close rate."
        actions={<Button size="sm" className="h-9 gradient-brand text-white" onClick={() => toast.info("New lead", { description: "Capture contact, source, and interest to start the pipeline." })}><Plus className="mr-1.5 h-4 w-4" />New lead</Button>}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {STAGES.map(stage => {
          const items = leads.filter(l => l.stage === stage.id);
          const total = items.reduce((s,l) => s + l.value, 0);
          return (
            <Card key={stage.id} className="surface-elevated">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: stage.color }} />
                    <p className="text-xs font-semibold uppercase tracking-wider">{stage.label}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                </div>
                <p className="font-mono text-xs text-muted-foreground tabular-nums">${total.toLocaleString()} pipeline</p>
                {items.map(l => (
                  <div key={l.id} className="rounded-md border bg-card/60 p-2.5 hover:border-[color:var(--teal)] cursor-pointer">
                    <p className="text-sm font-medium">{l.name}</p>
                    <p className="text-[11px] text-muted-foreground">{l.interest} · {l.source}</p>
                    <p className="mt-1 font-mono text-xs font-semibold tabular-nums">${l.value.toLocaleString()}</p>
                  </div>
                ))}
                {items.length === 0 && <p className="text-[11px] italic text-muted-foreground">No leads</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
