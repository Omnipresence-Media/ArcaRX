import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, MapPin, Phone, Plus, FileText } from "lucide-react";
import { upcomingVisits, pastVisits, type Visit } from "@/features/portal/mockData";
import { BookingModal, type BookingResult } from "@/components/portal/BookingModal";

export const Route = createFileRoute("/portal/visits")({
  head: () => ({ meta: [{ title: "Appointments - ARCA Rx Portal" }] }),
  component: Visits,
});

function modalityIcon(m: string) {
  if (m === "video") return Video;
  if (m === "phone") return Phone;
  return MapPin;
}

function Visits() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);
  const [rescheduling, setRescheduling] = useState<Visit | null>(null);
  const [cancelling, setCancelling] = useState<Visit | null>(null);
  const [viewingNotes, setViewingNotes] = useState<Visit | null>(null);
  const [visits, setVisits] = useState(upcomingVisits);

  function handleCancel(id: string) {
    setVisits(prev => prev.filter(v => v.id !== id));
    setCancelling(null);
  }

  function handleBooked(result: BookingResult) {
    const newVisit: Visit = {
      id: `v-${Date.now()}`,
      date: result.dateLabel,
      dateLabel: result.dateLabel,
      time: result.time,
      type: result.type,
      modality: result.modality,
      provider: result.provider,
      location: result.location,
      status: "upcoming",
    };
    setVisits(prev => [newVisit, ...prev]);
  }

  function handleRescheduled(result: BookingResult) {
    if (!rescheduling) return;
    const targetId = rescheduling.id;
    setVisits(prev => prev.map(v => v.id !== targetId ? v : {
      ...v,
      date: result.dateLabel,
      dateLabel: result.dateLabel,
      time: result.time,
      status: "upcoming",
    }));
  }

  return (
    <div className="space-y-5 p-4 md:p-8">
      {booking && <BookingModal onClose={() => setBooking(false)} onBooked={handleBooked} />}
      {rescheduling && <BookingModal title="Reschedule appointment" onClose={() => setRescheduling(null)} onBooked={handleRescheduled} />}

      {viewingNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewingNotes(null)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--teal)]">Visit notes</p>
              <h2 className="mt-1 text-base font-semibold">{viewingNotes.type}</h2>
              <p className="text-xs text-muted-foreground">{viewingNotes.dateLabel} · {viewingNotes.time} · {viewingNotes.provider}</p>
            </div>
            <div className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
              {viewingNotes.summary ?? "No notes recorded for this visit."}
            </div>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setViewingNotes(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {cancelling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCancelling(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-semibold">Cancel appointment?</h2>
            <p className="text-sm text-muted-foreground">
              {cancelling.type} on {cancelling.dateLabel} at {cancelling.time} with {cancelling.provider} will be cancelled. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setCancelling(null)}>Keep it</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleCancel(cancelling.id)}>Yes, cancel</Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upcoming & past visits with your care team.</p>
        </div>
        <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => setBooking(true)}><Plus className="mr-1.5 h-4 w-4" />Book visit</Button>
      </div>

      {/* Upcoming */}
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upcoming · {upcomingVisits.length}</p>
        <div className="space-y-2.5">
          {visits.map((v) => {
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
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setRescheduling(v)}>Reschedule</Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={() => setCancelling(v)}>Cancel</Button>
                    {v.modality === "video" && (
                      <Button size="sm" className="h-8 gradient-brand text-xs text-white" onClick={() => navigate({ to: "/portal/visit/$id", params: { id: v.id } })}>
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
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setViewingNotes(v)}>
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
