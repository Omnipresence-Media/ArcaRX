import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { fitClients } from "@/lib/fit-seed";
import { useClientPrograms, PROGRAM_META, type ProgramKey } from "@/features/coaching/programsStore";
import {
  useAssignment, usePrograms, useMealPlans, useDayLog,
  toggleExerciseDone, toggleMealDone, mealTotals,
  type BuilderProgram, type BuilderMealPlan,
} from "@/features/coaching/builderStore";
import { protocolFor } from "@/features/coaching/protocolSeed";
import { Dumbbell, Salad, Sparkle, Flame, CheckCircle2, Circle, ChevronDown, Trophy } from "lucide-react";

export const Route = createFileRoute("/coaching/$id")({
  head: () => ({ meta: [{ title: "My Coaching - ARCA Rx" }] }),
  component: ClientCoachingPortal,
});

const PROGRAM_ICON: Record<ProgramKey, typeof Dumbbell> = {
  fitness: Dumbbell,
  health: Salad,
  protocol: Sparkle,
};

function ClientCoachingPortal() {
  const { id } = Route.useParams();
  const client = fitClients.find((c) => c.id === id) ?? fitClients[0];
  const programs = useClientPrograms(id);
  const enabled = (Object.keys(programs) as ProgramKey[]).filter((k) => programs[k]);
  const [active, setActive] = useState<ProgramKey | null>(enabled[0] ?? null);

  const current = active && programs[active] ? active : enabled[0] ?? null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full gradient-brand" />
            <span className="text-lg font-semibold tracking-tight">ARCA Rx</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <img src={client.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden font-medium sm:inline">{client.name.split(" ")[0]}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--teal)]">Your coaching</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back, {client.name.split(" ")[0]}.</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-[color:var(--warning)]" />
            Week {client.startedWeeksAgo} · {enabled.length} active program{enabled.length !== 1 ? "s" : ""}
          </p>
        </div>

        {enabled.length === 0 ? (
          <div className="rounded-xl border bg-card/60 p-8 text-center">
            <p className="text-sm font-medium">No programs assigned yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Your coach will enable your programs soon. Check back shortly.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {enabled.map((key) => {
                const Icon = PROGRAM_ICON[key];
                const on = current === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      on ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: on ? undefined : PROGRAM_META[key].accent }} />
                    {PROGRAM_META[key].label}
                  </button>
                );
              })}
            </div>

            {current === "fitness" && <FitnessProgram clientId={id} />}
            {current === "health" && <HealthProgram clientId={id} />}
            {current === "protocol" && <ProtocolProgram clientId={id} />}
          </>
        )}
      </main>
    </div>
  );
}

function SectionCard({ title, sub, right, children }: { title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card/60 p-4 md:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

/* ---------- Fitness: the assigned program, fully interactive ---------- */

function FitnessProgram({ clientId }: { clientId: string }) {
  const assignment = useAssignment(clientId);
  const allPrograms = usePrograms();
  const program: BuilderProgram = allPrograms.find((p) => p.id === assignment.programId) ?? allPrograms[0];
  const log = useDayLog(clientId);

  const trainingDays = program.days.filter((d) => d.exercises.length > 0);
  const [openDay, setOpenDay] = useState<string>(trainingDays[0]?.id ?? "");

  const totalEx = trainingDays.reduce((s, d) => s + d.exercises.length, 0);
  const doneEx = trainingDays.reduce((s, d) => s + d.exercises.filter((e) => log.exercises[e.id]).length, 0);
  const pct = totalEx ? Math.round((doneEx / totalEx) * 100) : 0;

  return (
    <div className="space-y-4">
      <SectionCard
        title={program.name}
        sub={`${trainingDays.length} training days · assigned by your coach`}
        right={
          <div className="text-right">
            <p className="font-mono text-lg font-semibold tabular-nums text-[color:var(--teal)]">{pct}%</p>
            <p className="text-[10px] text-muted-foreground">this week</p>
          </div>
        }
      >
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-[color:var(--teal)] transition-all" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <p className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-[color:var(--success)]/30 bg-[color:color-mix(in_oklab,var(--success)_10%,transparent)] p-3 text-sm font-medium text-[color:var(--success)]">
            <Trophy className="h-4 w-4" /> Week complete. Outstanding work.
          </p>
        )}
      </SectionCard>

      <SectionCard title="This week's training" sub="Tap a day, then tap each exercise as you finish it.">
        <div className="space-y-2">
          {program.days.map((d) => {
            const isRest = d.exercises.length === 0;
            const open = openDay === d.id;
            const dayDone = d.exercises.length > 0 && d.exercises.every((e) => log.exercises[e.id]);
            return (
              <div key={d.id} className={`rounded-lg border ${dayDone ? "border-[color:var(--success)]/40" : ""}`}>
                <button
                  onClick={() => !isRest && setOpenDay(open ? "" : d.id)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                  disabled={isRest}
                >
                  <div className="flex items-center gap-2.5">
                    {dayDone && <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">{d.day}</p>
                      <p className="text-sm">{d.title}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {isRest ? "Rest" : `${d.exercises.filter((e) => log.exercises[e.id]).length}/${d.exercises.length} done`}
                    {!isRest && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />}
                  </span>
                </button>
                {open && !isRest && (
                  <ul className="space-y-1.5 border-t p-2.5">
                    {d.exercises.map((ex) => {
                      const done = !!log.exercises[ex.id];
                      return (
                        <li key={ex.id}>
                          <button
                            onClick={() => toggleExerciseDone(clientId, ex.id)}
                            className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                              done ? "border-[color:var(--success)]/40 bg-[color:color-mix(in_oklab,var(--success)_7%,transparent)]" : "hover:border-[color:var(--teal)]/40"
                            }`}
                          >
                            {done
                              ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--success)]" />
                              : <Circle className="h-5 w-5 shrink-0 text-muted-foreground/50" />}
                            <span className="min-w-0 flex-1">
                              <span className={`block truncate text-sm font-medium ${done ? "text-muted-foreground line-through" : ""}`}>{ex.name}</span>
                              <span className="block text-[11px] text-muted-foreground">
                                {ex.sets} sets × {ex.reps} · RPE {ex.rpe} · rest {ex.rest}
                              </span>
                              {ex.notes && (
                                <span className="mt-1 block rounded bg-muted/60 px-2 py-1 text-[11px] italic text-foreground/75">
                                  Coach: {ex.notes}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------- Health: the assigned meal plan, check off meals ---------- */

function HealthProgram({ clientId }: { clientId: string }) {
  const assignment = useAssignment(clientId);
  const allPlans = useMealPlans();
  const plan: BuilderMealPlan = allPlans.find((p) => p.id === assignment.mealPlanId) ?? allPlans[0];
  const log = useDayLog(clientId);

  const eaten = plan.meals.filter((m) => log.meals[m.id]);
  const consumed = eaten.reduce(
    (a, m) => { const t = mealTotals(m); return { kcal: a.kcal + t.kcal, p: a.p + t.p, c: a.c + t.c, f: a.f + t.f }; },
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  return (
    <div className="space-y-4">
      <SectionCard
        title={plan.name}
        sub="Your daily targets · tap each meal when you've eaten it"
        right={
          <div className="text-right">
            <p className="font-mono text-lg font-semibold tabular-nums text-[color:var(--teal)]">{consumed.kcal}</p>
            <p className="text-[10px] text-muted-foreground">of {plan.calories} kcal</p>
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          {([["Protein", consumed.p, plan.protein], ["Carbs", consumed.c, plan.carbs], ["Fat", consumed.f, plan.fat]] as const).map(([label, val, target]) => (
            <div key={label} className="rounded-lg border p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{val}<span className="text-muted-foreground">/{target}g</span></p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[color:var(--teal)]" style={{ width: `${Math.min(100, Math.round((val / Math.max(1, target)) * 100))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Today's meals">
        <div className="space-y-2.5">
          {plan.meals.map((m) => {
            const t = mealTotals(m);
            const done = !!log.meals[m.id];
            return (
              <button
                key={m.id}
                onClick={() => toggleMealDone(clientId, m.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  done ? "border-[color:var(--success)]/40 bg-[color:color-mix(in_oklab,var(--success)_7%,transparent)]" : "hover:border-[color:var(--teal)]/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2.5">
                    {done
                      ? <CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" />
                      : <Circle className="h-5 w-5 text-muted-foreground/50" />}
                    <span>
                      <span className={`block text-sm font-semibold ${done ? "text-muted-foreground line-through" : ""}`}>{m.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{m.time}</span>
                    </span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">{t.kcal} kcal · {t.p}p</span>
                </div>
                {m.items.length > 0 && (
                  <ul className="mt-2 space-y-1 border-t pt-2">
                    {m.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between text-xs">
                        <span className="text-foreground/90">{it.name} <span className="text-muted-foreground">· {it.grams}g</span></span>
                        <span className="font-mono tabular-nums text-muted-foreground">{it.kcal} kcal</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------- Protocol: assigned regimen ---------- */

function ProtocolProgram({ clientId }: { clientId: string }) {
  const p = protocolFor(clientId);
  return (
    <div className="space-y-4">
      <SectionCard title={p.name} sub={`${p.category} · ${p.durationWeeks} weeks`}>
        <p className="text-sm text-muted-foreground">{p.summary}</p>
      </SectionCard>
      <SectionCard title="Your regimen">
        <div className="space-y-2">
          {p.regimen.map((r) => (
            <div key={r.step} className="flex items-start gap-3 rounded-lg border p-2.5">
              <span className="mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: "color-mix(in oklab, var(--chart-violet, #a78bfa) 16%, transparent)", color: "var(--chart-violet, #a78bfa)" }}>{r.time}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{r.product}</p>
                <p className="text-xs text-muted-foreground">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Supplements">
        <ul className="divide-y">
          {p.supplements.map((s) => (
            <li key={s.name} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.dose} · {s.timing}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
      {p.dosing.length > 0 && (
        <SectionCard title="Dosing schedule">
          <ul className="space-y-2">
            {p.dosing.map((d) => (
              <li key={d.med} className="rounded-lg border p-2.5 text-sm">
                <p className="font-semibold">{d.med} <span className="text-xs font-normal text-muted-foreground">· {d.route}</span></p>
                <p className="text-xs text-muted-foreground">{d.schedule}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
