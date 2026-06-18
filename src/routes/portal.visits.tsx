import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, MapPin, Phone, Plus, FileText } from "lucide-react";
import { upcomingVisits, pastVisits } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/visits")({
  head: () => ({ meta: [{ title: "Appointments — ARCA Rx Portal" }] }),
  component: Visits,
});

function modalityIcon(m: string) {
  if (m === "video") return Video;
  if (m === "phone") return Phone;
  return MapPin;
}

function Visits() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upcoming & past visits with your care team.</p>
        </div>
        <Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />Book visit</Button>
      </div>

      {/* Upcoming */}
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upcoming · {upcomingVisits.length}</p>
        <div className="space-y-2.5">
          {upcomingVisits.map((v) => {
            const Icon = modalityIcon(v.modality);
            return (
              <Card key={v.id} className="surface-elevated">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md border bg-card text-center">
                      <span className="text-[10px] uppercase text-muted-foreground">{v.dateLabel.split(" ")[0]}</span>
                      <span className="text-sm font-semibold leading-none">{v.dateLabel.split(" ")[1] ?? "·"}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{v.type}</p>
                        {v.status === "soon" && <Badge className="badge-active text-[10px]">Soon</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{v.time} · with {v.provider}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Icon className="h-3 w-3" />{v.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">Reschedule</Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">Cancel</Button>
                    {v.modality === "video" && (
                      <Button size="sm" className="h-8 gradient-brand text-xs text-white">
                        <Video className="mr-1 h-3.5 w-3.5" />Join
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Past */}
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Past</p>
        <div className="space-y-2.5">
          {pastVisits.map((v) => {
            const Icon = modalityIcon(v.modality);
            return (
              <Card key={v.id} className="surface-elevated">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{v.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.dateLabel} · {v.time} · {v.provider}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Icon className="h-3 w-3" />{v.location}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <FileText className="mr-1 h-3.5 w-3.5" />Notes
                    </Button>
                  </div>
                  {v.summary && (
                    <p className="mt-3 rounded-md border bg-card/60 p-3 text-xs leading-relaxed text-muted-foreground">
                      {v.summary}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
