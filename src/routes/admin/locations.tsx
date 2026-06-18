import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { practice } from "@/lib/seed-data";
import { MapPin, Users, DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin/locations")({
  head: () => ({ meta: [{ title: "Locations — ARCA Rx" }] }),
  component: Locations,
});

function Locations() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader eyebrow="Operations" title="Locations" description="3 clinics · 1 group · consolidated rollup view." />
      <div className="grid gap-4 md:grid-cols-3">
        {practice.locations.map(l => (
          <Card key={l.id} className="surface-elevated">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--teal)]">Clinic</p>
                  <h3 className="mt-1 text-lg font-semibold">{l.name}</h3>
                  <p className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{l.city}</p>
                </div>
                <Badge variant="outline" className="badge-active">Live</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border bg-card/60 p-3">
                  <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground"><Users className="h-3 w-3" />Members</p>
                  <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums">{l.members}</p>
                </div>
                <div className="rounded-md border bg-card/60 p-3">
                  <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground"><DollarSign className="h-3 w-3" />MRR</p>
                  <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums">${(l.mrr/1000).toFixed(1)}k</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
