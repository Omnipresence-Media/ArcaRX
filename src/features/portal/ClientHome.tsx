import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video, Flame, MessageSquare, ArrowRight, Calendar,
  Dumbbell, Salad, TrendingDown, LineChart,
} from "lucide-react";
import { patient, weightLog } from "./mockData";
import { coachThreads, clientProfile } from "./proData";
import { useAppointments, updateVisit } from "./appointmentsStore";
import { BookingModal } from "@/components/portal/BookingModal";
import {
  useAssignment, usePrograms, useMealPlans, useDayLog, mealTotals,
} from "@/features/coaching/builderStore";

// ARCA Pro Client home: the coach's client, not the clinic's patient.
// Everything on this screen is about the coaching relationship - today's
// training, nutrition, sessions with the coach, and progress. No medical.
const DEMO_CLIENT_ID = "c1";

export function ClientHome() {
  const navigate = useNavigate();
  const sessions = useAppointments();
  const next = sessions[0];
  const [rescheduling, setRescheduling] = useState(false);

  // Today's training, straight from the coaching program + today's log.
  const assignment = useAssignment(DEMO_CLIENT_ID);
  const programs = usePrograms();
  const program = programs.find((p) => p.id === assignment.programId) ?? programs[0];
  const log = useDayLog(DEMO_CLIENT_ID);
  const day = program.days.find((d) => d.exercises.length > 0 || (d.circuits?.length ?? 0) > 0);
  const dayTotalSets = day?.exercises.reduce((a, e) => a + e.sets, 0) ?? 0;
  const dayDoneSets = day
    ? day.exercises.reduce((a, e) => a + (log.sets[e.id]?.filter((s) => s.done).length ?? 0), 0)
    : 0;
  const dayVolume = day
    ? day.exercises.reduce((a, e) => a + (log.sets[e.id]?.filter((s) => s.done).reduce((x, s) => x + s.weight * s.reps, 0) ?? 0), 0)
    : 0;

  // Nutrition today from the assigned meal plan + today's check-offs.
  const plans = useMealPlans();
  const plan = plans.find((p) => p.id === assignment.mealPlanId) ?? plans[0];
  const eaten = plan.meals.filter((m) => log.meals[m.id]);
  const kcalEaten = eaten.reduce((a, m) => a + mealTotals(m).kcal, 0);

  // Progress snapshot.
  const startWeight = weightLog[0].w;
  const currentWeight = weightLog[weightLog.length - 1].w;
  const delta = (currentWeight - startWeight).toFixed(1);

  const unread = coachThreads.reduce((s, t) => s + t.unread, 0);

  return (
    <div className="space-y-5 p-4 md:p-8">
      {/* Greeting */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">
          Monday, July 6 · {clientProfile.team}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          Good afternoon, {patient.firstName}.
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-[color:var(--warning)]" />
          {patient.streak}-week training streak · coach {clientProfile.coach.split(",")[0]} is watching your logs.
        </p>
      </div>

      {/* Next session hero */}
      {rescheduling && next && (
        <BookingModal
          pro
          title="Reschedule session"
          onClose={() => setRescheduling(false)}
          onBooked={(r) => updateVisit(next.id, { dateLabel: r.dateLabel, date: r.dateLabel, time: r.time })}
        />
      )}
      {next ? (
        <Card className="surface-elevated overflow-hidden border-[color:var(--teal)]/30">
          <div className="relative p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--teal)_18%,transparent),transparent_60%)]" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge className="badge-active gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />Next session</Badge>
                  <p className="text-[11px] text-muted-foreground">{next.dateLabel} · {next.time}</p>
                </div>
                <p className="mt-2 text-lg font-semibold">{next.type}</p>
                <p className="text-xs text-muted-foreground">with {next.provider} · {next.location}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9" onClick={() => setRescheduling(true)}>Reschedule</Button>
                {next.modality === "video" ? (
                  <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => navigate({ to: "/portal/visit/$id", params: { id: next.id } })}>
                    <Video className="mr-1.5 h-4 w-4" />Join call
                  </Button>
                ) : (
                  <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => navigate({ to: "/portal/coaching" })}>
                    <Dumbbell className="mr-1.5 h-4 w-4" />Warm up
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="surface-elevated border-[color:var(--teal)]/30">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-sm font-medium">No upcoming sessions</p>
            <p className="text-xs text-muted-foreground">Book your next session with your coach.</p>
            <Link to="/portal/visits" className="text-xs text-[color:var(--teal)] hover:underline">Book a session <ArrowRight className="inline h-3 w-3" /></Link>
          </CardContent>
        </Card>
      )}

      {/* 2-column grid on md+ */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's training */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's training</p>
                <p className="mt-0.5 text-sm">{day ? `${day.day} · ${day.title}` : program.name}</p>
              </div>
              <Link to="/portal/coaching" className="text-xs text-[color:var(--teal)] hover:underline">
                Open <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 rounded-md border bg-card/60 p-3">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Dumbbell className="h-4 w-4 text-[color:var(--teal)]" />
                  {dayDoneSets} of {dayTotalSets} sets logged
                </p>
                <p className="font-mono text-sm font-semibold tabular-nums text-[color:var(--teal)]">{dayVolume.toLocaleString()} lb</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--teal)] to-emerald-400 transition-all duration-500" style={{ width: `${dayTotalSets ? (dayDoneSets / dayTotalSets) * 100 : 0}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {dayDoneSets === 0 ? "Your coach programmed today's session - tap Open to start." : dayDoneSets === dayTotalSets ? "Workout complete. Nice work." : "Session in progress - keep going."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition today */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nutrition today</p>
                <p className="mt-0.5 text-sm">{plan.name}</p>
              </div>
              <Link to="/portal/coaching" className="text-xs text-[color:var(--teal)] hover:underline">
                Log meals <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 rounded-md border bg-card/60 p-3">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Salad className="h-4 w-4 text-[color:var(--teal)]" />
                  {eaten.length} of {plan.meals.length} meals
                </p>
                <p className="font-mono text-sm font-semibold tabular-nums">{kcalEaten}<span className="text-muted-foreground">/{plan.calories} kcal</span></p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[color:var(--teal)]" style={{ width: `${Math.min(100, Math.round((kcalEaten / Math.max(1, plan.calories)) * 100))}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Protein target {plan.protein}g · check meals off as you eat.</p>
            </div>
          </CardContent>
        </Card>

        {/* Coach messages */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your coach</p>
                <p className="mt-0.5 text-sm">{unread} unread message{unread !== 1 && "s"}</p>
              </div>
              <Link to="/portal/messages" className="text-xs text-[color:var(--teal)] hover:underline">
                Open <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {coachThreads.slice(0, 2).map((t) => (
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

        {/* Progress + quick actions */}
        <Card className="surface-elevated">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progress</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm">
                  <span className="font-mono font-semibold tabular-nums">{currentWeight} lb</span>
                  <span className="flex items-center gap-0.5 text-xs text-[color:var(--success)]"><TrendingDown className="h-3 w-3" />{delta} lb</span>
                </p>
              </div>
              <Link to="/portal/progress" className="text-xs text-[color:var(--teal)] hover:underline">
                Review <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { to: "/portal/coaching", icon: Dumbbell,      label: "Today's workout" },
                { to: "/portal/messages", icon: MessageSquare, label: "Message coach" },
                { to: "/portal/visits",   icon: Calendar,      label: "Book session" },
                { to: "/portal/progress", icon: LineChart,     label: "Log check-in" },
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
