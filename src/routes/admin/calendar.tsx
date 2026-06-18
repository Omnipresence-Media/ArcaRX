import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { todaySchedule, providers } from "@/lib/seed-data";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/calendar")({
  head: () => ({ meta: [{ title: "Calendar — ARCA Rx" }] }),
  component: CalendarPage,
});

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8 → 18
const PROVIDER_COLS = providers.slice(0, 4);

function CalendarPage() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Front Desk"
        title="Calendar"
        description="Multi-provider day view · drag to reschedule, click any slot to book."
        actions={
          <>
            <div className="flex items-center gap-1 rounded-md border bg-muted/40 p-0.5">
              {["Day","Week","Month"].map((v,i) => (
                <button key={v} className={`px-2.5 py-1 text-xs rounded ${i===0?"bg-background shadow-sm font-medium":"text-muted-foreground"}`}>{v}</button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-9"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-medium">Today</Button>
            <Button variant="outline" size="sm" className="h-9"><ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />Book</Button>
          </>
        }
      />
      <Card className="surface-elevated overflow-hidden">
        <CardContent className="p-0">
          <div className="grid" style={{ gridTemplateColumns: `64px repeat(${PROVIDER_COLS.length}, 1fr)` }}>
            <div className="border-b border-r bg-muted/30 p-2 text-[10px] uppercase tracking-wider text-muted-foreground">Time</div>
            {PROVIDER_COLS.map((p) => (
              <div key={p.id} className="border-b p-2 text-center">
                <p className="text-xs font-semibold">{p.name.split(",")[0]}</p>
                <p className="text-[10px] text-muted-foreground">{p.utilization}% booked</p>
              </div>
            ))}
            {HOURS.map((h) => (
              <div key={h} className="contents">
                <div className="border-r border-b bg-muted/10 px-2 py-3 text-[11px] font-mono text-muted-foreground">
                  {h}:00
                </div>
                {PROVIDER_COLS.map((p) => {
                  const appt = todaySchedule.find(a => {
                    const hour = parseInt(a.time.split(":")[0]);
                    return hour === h && a.provider.includes(p.name.split(" ")[1] ?? "");
                  });
                  return (
                    <div key={p.id+h} className="relative border-b border-r/40 min-h-[64px] p-1 hover:bg-muted/20">
                      {appt && (
                        <div className="rounded-md border-l-4 border-l-[color:var(--teal)] bg-[color-mix(in_oklab,var(--teal)_10%,var(--card))] p-1.5 text-[11px]">
                          <p className="font-semibold leading-tight">{appt.patient}</p>
                          <p className="text-muted-foreground">{appt.type}</p>
                          <Badge variant="outline" className="mt-1 text-[9px]">{appt.status}</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
