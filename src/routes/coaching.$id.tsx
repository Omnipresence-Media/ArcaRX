import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { fitClients, sampleWeek, mealPlans, sampleMeals } from "@/lib/fit-seed";
import { ExerciseRow } from "@/components/shell/fit/ExerciseRow";
import { MacroRing } from "@/components/shell/fit/MacroRing";
import { useClientPrograms, PROGRAM_META, type ProgramKey } from "@/features/coaching/programsStore";
import { protocolFor } from "@/features/coaching/protocolSeed";
import { Dumbbell, Salad, Sparkle, Flame } from "lucide-react";

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

  // Keep the active tab valid as toggles change.
  const current = active && programs[active] ? active : enabled[0] ?? null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        {/* Greeting */}
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
            {/* Program tabs — only enabled ones */}
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
                    style={on ? undefined : { color: undefined }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: on ? undefined : PROGRAM_META[key].accent }} />
                    {PROGRAM_META[key].label}
                  </button>
                );
              })}
            </div>

            {current === "fitness" && <FitnessProgram />}
            {current === "health" && <HealthProgram goal={client.goal} />}
            {current === "protocol" && <ProtocolProgram clientId={id} />}
          </>
        )}
      </main>
    </div>
  );
}

function SectionCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card/60 p-4 md:p-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function FitnessProgram() {
  const trainingDays = sampleWeek.filter((d) => d.exercises.length > 0);
  const [openDay, setOpenDay] = useState(trainingDays[0]?.day ?? "");
  return (
    <SectionCard title="This week's training" sub={`${trainingDays.length} training days`}>
      <div className="space-y-2">
        {sampleWeek.map((d) => {
          const isRest = d.exercises.length === 0;
          const open = openDay === d.day;
          return (
            <div key={d.day} className="rounded-lg border">
              <button
                onClick={() => !isRest && setOpenDay(open ? "" : d.day)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                disabled={isRest}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">{d.day}</p>
                  <p className="text-sm">{d.title}</p>
                </div>
                <span className="text-[11px] text-muted-foreground">{isRest ? "Rest" : `${d.exercises.length} exercises`}</span>
              </button>
              {open && !isRest && (
                <div className="space-y-1.5 border-t p-2.5">
                  {d.exercises.map((ex) => <ExerciseRow key={ex.id} ex={ex} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function HealthProgram({ goal }: { goal: string }) {
  const plan = mealPlans[0];
  return (
    <div className="space-y-4">
      <SectionCard title="Daily targets" sub={`${plan.protocol} · ${plan.calories} kcal`}>
        <div className="flex justify-center">
          <MacroRing
            protein={Math.round(plan.protein * 0.85)}
            carbs={Math.round(plan.carbs * 0.9)}
            fat={Math.round(plan.fat * 0.8)}
            proteinTarget={plan.protein}
            carbsTarget={plan.carbs}
            fatTarget={plan.fat}
          />
        </div>
      </SectionCard>
      <SectionCard title="Today's meals" sub={`${goal} plan`}>
        <div className="space-y-3">
          {sampleMeals.map((m) => (
            <div key={m.meal} className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">{m.meal}</p>
                <span className="text-[11px] text-muted-foreground">{m.time}</span>
              </div>
              <ul className="space-y-1">
                {m.items.map((it) => (
                  <li key={it.name} className="flex items-center justify-between text-xs">
                    <span className="text-foreground/90">{it.name}</span>
                    <span className="font-mono text-muted-foreground">{it.kcal} kcal · {it.p}p</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

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
