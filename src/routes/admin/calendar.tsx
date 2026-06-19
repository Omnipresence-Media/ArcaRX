import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, MapPin, Video, Clock } from "lucide-react";
import { useTodaySchedule } from "@/hooks/queries/useAppointments";
import { providers } from "@/lib/data/providers";
import { locations } from "@/lib/data/locations";

export const Route = createFileRoute("/admin/calendar")({
  head: () => ({ meta: [{ title: "Calendar — ArcaRX" }] }),
  component: CalendarPage,
});

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 08:00–18:00

const STATUS_COLOR: Record<string, string> = {
  "scheduled":  "border-l-slate-400",
  "confirmed":  "border-l-blue-400",
  "checked-in": "border-l-amber-400",
  "in-room":    "border-l-emerald-400",
  "completed":  "border-l-muted-foreground",
  "cancelled":  "border-l-red-400",
  "no-show":    "border-l-red-400",
};

const STATUS_BG: Record<string, string> = {
  "scheduled":  "bg-slate-500/5",
  "confirmed":  "bg-blue-500/5",
  "checked-in": "bg-amber-500/5",
  "in-room":    "bg-emerald-500/5",
  "completed":  "bg-muted/30",
  "cancelled":  "bg-red-500/5 opacity-50",
  "no-show":    "bg-red-500/5 opacity-50",
};

function CalendarPage() {
  const [selectedLocation, setSelectedLocation] = useState("loc-atx");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const { data: schedule = [], isLoading } = useTodaySchedule(selectedLocation);

  const locationProviders = providers.filter(p => p.locationId === selectedLocation).slice(0, 4);

  function getApptForSlot(providerId: string, hour: number) {
    return schedule.filter(a => {
      if (a.providerId !== providerId) return false;
      const [h] = a.time.split(":").map(Number);
      return h === hour;
    });
  }

  const checkedIn = schedule.filter(a => a.status === "checked-in" || a.status === "in-room").length;
  const completed = schedule.filter(a => a.status === "completed").length;
  const remaining = schedule.filter(a => a.status === "scheduled").length;

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Front Desk"
        title="Calendar"
        description={`${dateLabel} · Multi-provider day view`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.city.split(",")[0]}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 rounded-md border bg-muted/40 p-0.5">
              {(["day", "week"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-3 py-1 text-xs rounded capitalize ${viewMode === v ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}>
                  {v}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-medium">Today</Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0"><ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />Book</Button>
          </div>
        }
      />

      {/* Day stats */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Total today", value: isLoading ? "—" : schedule.length.toString(), color: "" },
          { label: "Checked in / In room", value: isLoading ? "—" : checkedIn.toString(), color: "text-amber-400" },
          { label: "Completed", value: isLoading ? "—" : completed.toString(), color: "text-emerald-400" },
          { label: "Remaining", value: isLoading ? "—" : remaining.toString(), color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className={`font-mono font-semibold text-sm ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <Card className="surface-elevated overflow-auto">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <div className="min-w-[640px]">
              <div className="grid border-b bg-muted/20" style={{ gridTemplateColumns: `80px repeat(${locationProviders.length}, 1fr)` }}>
                <div className="border-r p-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                {locationProviders.map(p => (
                  <div key={p.id} className="border-r last:border-r-0 p-2 text-center">
                    <p className="text-xs font-semibold truncate">{p.name.replace("Dr. ", "Dr. ")}</p>
                    <p className="text-[10px] text-muted-foreground">{p.credentials} · {p.utilization}%</p>
                    <div className="mt-1 h-1 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-[color:var(--teal)]" style={{ width: `${p.utilization}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {HOURS.map(h => (
                <div key={h} className="grid" style={{ gridTemplateColumns: `80px repeat(${locationProviders.length}, 1fr)` }}>
                  <div className="border-r border-b bg-muted/5 px-2 py-3 text-[11px] font-mono text-muted-foreground text-right pr-3">
                    {h}:00
                  </div>
                  {locationProviders.map(p => {
                    const appts = getApptForSlot(p.id, h);
                    return (
                      <div key={p.id + h} className="relative border-r border-b last:border-r-0 min-h-[72px] p-1 space-y-1 hover:bg-muted/10 transition-colors group">
                        {appts.map(a => (
                          <Link key={a.id} to="/admin/patients/$id" params={{ id: a.patientId }}>
                            <div className={`rounded-md border-l-4 p-2 text-[11px] cursor-pointer hover:brightness-110 transition-all ${STATUS_COLOR[a.status] ?? "border-l-border"} ${STATUS_BG[a.status] ?? "bg-card/40"}`}>
                              <div className="flex items-start justify-between gap-1">
                                <p className="font-semibold leading-tight truncate flex-1">{a.patientName}</p>
                                {a.isVirtual && <Video className="h-3 w-3 text-blue-400 shrink-0 mt-0.5" />}
                              </div>
                              <p className="text-muted-foreground truncate mt-0.5">{a.type}</p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <Badge variant="outline" className="text-[9px] h-4 px-1">{a.status}</Badge>
                                <span className="text-[9px] text-muted-foreground">{a.time} · {a.duration}m</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                        {appts.length === 0 && (
                          <button className="absolute inset-0 w-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Plus className="h-3 w-3" />Book</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's schedule list view */}
      <Card className="surface-elevated">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-semibold mb-3">All appointments today</p>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : schedule.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No appointments today for this location.</p>
          ) : (
            schedule.map(a => {
              const prov = providers.find(p => p.id === a.providerId);
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-md border bg-card/60 p-3 hover:bg-card transition-colors">
                  <div className="w-12 text-center shrink-0">
                    <p className="font-mono text-sm font-semibold">{a.time}</p>
                    <p className="text-[10px] text-muted-foreground">{a.duration}m</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to="/admin/patients/$id" params={{ id: a.patientId }} className="text-sm font-medium hover:text-[color:var(--teal)] block truncate">
                      {a.patientName}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">{a.type} · {prov?.name}</p>
                  </div>
                  {a.roomNumber && <span className="text-[10px] text-muted-foreground shrink-0">Rm {a.roomNumber}</span>}
                  {a.isVirtual && <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/20"><Video className="mr-1 h-3 w-3" />Virtual</Badge>}
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${
                    a.status === "in-room" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                    a.status === "checked-in" ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                    a.status === "completed" ? "text-muted-foreground" :
                    ""
                  }`}>{a.status}</Badge>
                  <Button size="sm" variant="ghost" className="h-7 text-xs shrink-0">Chart</Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
