import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, CheckCircle2, Circle, Flame, FlaskConical, MessageSquare, ArrowRight, Calendar, Pill } from "lucide-react";
import { patient, upcomingVisits, medications, labPanels, threads } from "@/features/portal/mockData";
import { BookingModal } from "@/components/portal/BookingModal";

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Home - ARCA Rx Portal" }] }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [next, setNext] = useState(upcomingVisits[0]);
  const todayMeds = medications.filter((m) => m.takenToday !== undefined);
  const [rescheduling, setRescheduling] = useState(false);
  const takenCount = todayMeds.filter((m) => m.takenToday).length;
  const latestLab = labPanels[0];
  const flaggedMarker = latestLab.markers.find((m) => m.flag !== "ok");
  const unread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <div className="space-y-5 p-4 md:p-8">
      {/* Greeting */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">
          Monday, June 8
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          Good afternoon, {patient.firstName}.
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-[color:var(--warning)]" />
          {patient.streak}-week care streak · keep going.
        </p>
      </div>

      {/* Next visit hero */}
      <Card className="surface-elevated overflow-hidden border-[color:var(--teal)]/30">
        <div className="relative p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--teal)_18%,transparent),transparent_60%)]" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge className="badge-active gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />Starts soon</Badge>
                <p className="text-[11px] text-muted-foreground">{next.dateLabel} · {next.time}</p>
              </div>
              <p className="mt-2 text-lg font-semibold">{next.type}</p>
              <p className="text-xs text-muted-foreground">with {next.provider} · {next.location}</p>
            </div>
            <div className="flex gap-2">
              {rescheduling && (
                <BookingModal
                  title="Reschedule appointment"
                  onClose={() => setRescheduling(false)}
                  onBooked={(r) => setNext((prev) => ({ ...prev, dateLabel: r.dateLabel, date: r.dateLabel, time: r.time }))}
                />
              )}
              <Button variant="outline" size="sm" className="h-9" onClick={() => setRescheduling(true)}>Reschedule</Button>
              <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => navigate({ to: "/portal/visit/$id", params: { id: next.id } })}>
                <Video className="mr-1.5 h-4 w-4" />Join visit
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 2-column grid on md+ */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's meds */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's meds</p>
                <p className="mt-0.5 text-sm">{takenCount} of {todayMeds.length} taken</p>
              </div>
              <Link to="/portal/meds" className="text-xs text-[color:var(--teal)] hover:underline">
                See all <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {todayMeds.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-md border bg-card/60 p-2.5">
                  {m.takenToday
                    ? <CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" />
                    : <Circle className="h-5 w-5 text-muted-foreground" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.name} · {m.dose}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{m.schedule}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latest lab */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Latest results</p>
                <p className="mt-0.5 text-sm">{latestLab.name}</p>
              </div>
              <Link to="/portal/labs" className="text-xs text-[color:var(--teal)] hover:underline">
                Review <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 rounded-md border bg-card/60 p-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-[color:var(--teal)]" />
                <p className="text-sm font-medium">{latestLab.flagged} marker{latestLab.flagged !== 1 && "s"} need attention</p>
              </div>
              {flaggedMarker && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{flaggedMarker.name}</span> ·{" "}
                  <span className={flaggedMarker.flag === "high" ? "text-[color:var(--danger)]" : "text-[color:var(--warning)]"}>
                    {flaggedMarker.value} {flaggedMarker.unit}
                  </span>{" "}
                  · ref {flaggedMarker.refLow}–{flaggedMarker.refHigh}
                </p>
              )}
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{latestLab.interpretation}</p>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Care team</p>
                <p className="mt-0.5 text-sm">{unread} unread message{unread !== 1 && "s"}</p>
              </div>
              <Link to="/portal/messages" className="text-xs text-[color:var(--teal)] hover:underline">
                Open <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {threads.slice(0, 2).map((t) => (
                <div key={t.id} className="flex items-start gap-3 rounded-md border bg-card/60 p-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-brand text-[10px] font-semibold text-white">
                    {t.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{t.with}</p>
                      <span className="text-[10px] text-muted-foreground">{t.lastAt}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
                  </div>
                  {t.unread > 0 && <span className="h-2 w-2 rounded-full bg-[color:var(--teal)]" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick actions</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { to: "/portal/messages", icon: MessageSquare, label: "Message team" },
                { to: "/portal/visits",   icon: Calendar,      label: "Book visit"   },
                { to: "/portal/meds",     icon: Pill,          label: "Request refill" },
                { to: "/portal/progress", icon: LineIcon,      label: "Log check-in" },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex items-center gap-2 rounded-md border bg-card/60 p-3 text-sm hover:border-[color:var(--teal)]/40 hover:bg-[color:color-mix(in_oklab,var(--teal)_6%,transparent)]"
                >
                  <a.icon className="h-4 w-4 text-[color:var(--teal)]" />
                  {a.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LineIcon(props: React.SVGProps<SVGSVGElement>) {
  // simple line-chart icon to avoid a heavy import
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-6" />
    </svg>
  );
}
