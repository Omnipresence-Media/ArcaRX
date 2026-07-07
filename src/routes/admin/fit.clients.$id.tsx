import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel, SimpleTable, BarRow } from "@/components/shell/AnalyticsSubPage";
import { AreaTrend } from "@/components/shell/viz/AreaTrend";
import { MacroRing } from "@/components/shell/fit/MacroRing";
import { ProgressPhotoCompare } from "@/components/shell/fit/ProgressPhotoCompare";
import { ExerciseRow } from "@/components/shell/fit/ExerciseRow";
import { fitClients, sampleWeek, sampleConversation, checkInCard } from "@/lib/fit-seed";
import { Switch } from "@/components/ui/switch";
import {
  useClientPrograms,
  toggleProgram,
  PROGRAM_META,
  PROGRAM_KEYS,
  enabledCount,
  type ProgramKey,
} from "@/features/coaching/programsStore";
import { protocolFor } from "@/features/coaching/protocolSeed";
import { usePrograms, useMealPlans, useAssignment, assignToClient } from "@/features/coaching/builderStore";
import { ResultsReport } from "@/components/shell/fit/ResultsReport";
import { useGoToast } from "@/lib/coachToast";
import { ArrowLeft, MessageSquare, Calendar, Sparkles, Dumbbell, Salad, Sparkle, Share2 } from "lucide-react";

export const Route = createFileRoute("/admin/fit/clients/$id")({
  head: () => ({ meta: [{ title: "Client - ARCA Fit" }] }),
  component: ClientProfile,
});

const TABS = ["Progress", "Results", "Program", "Nutrition", "Protocol", "Check-ins", "Messages"] as const;

const PROGRAM_ICON: Record<ProgramKey, typeof Dumbbell> = {
  fitness: Dumbbell,
  health: Salad,
  protocol: Sparkle,
};

function ClientProfile() {
  const { id } = Route.useParams();
  const go = useGoToast();
  const c = fitClients.find((x) => x.id === id) ?? fitClients[0];
  const [tab, setTab] = useState<(typeof TABS)[number]>("Progress");
  const programs = useClientPrograms(c.id);
  const activeCount = enabledCount(programs);

  const weightSeries = c.weightTrend.map((v, i) => ({ x: `W${i}`, weight: v, target: c.targetWeight }));

  function handleToggle(key: ProgramKey) {
    const nowOn = !programs[key];
    toggleProgram(c.id, key);
    toast.success(
      `${PROGRAM_META[key].label} ${nowOn ? "enabled" : "disabled"} for ${c.name}`,
      { description: nowOn ? "Now visible in the client's portal." : "Hidden from the client's portal." },
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <Link to="/admin/fit/clients" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to clients
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar profile card */}
        <aside className="glass-panel p-5 lg:w-80 shrink-0 self-start">
          <div className="flex items-center gap-3">
            <img src={c.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-1 ring-[color:var(--glass-stroke-strong)]" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">{c.name}</h2>
              <p className="text-xs text-muted-foreground">{c.city}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[color:color-mix(in_oklab,var(--teal)_22%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--teal)]">{c.goal}</span>
            <span className="rounded-full glass-panel-quiet px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Week {c.startedWeeksAgo}</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Mini label="Start"   value={`${c.startWeight}`} />
            <Mini label="Current" value={`${c.currentWeight}`} highlight />
            <Mini label="Target"  value={`${c.targetWeight}`} />
          </div>
          <div className="mt-5 space-y-2">
            <button onClick={() => go("Check-in sent", { description: `${c.name.split(" ")[0]} will get a weekly check-in form.` })} className="w-full rounded-full bg-foreground py-2 text-xs font-semibold text-background"><Sparkles className="mr-1 inline h-3.5 w-3.5" />Send check-in</button>
            <button onClick={() => go("Book a session", { description: "Open the calendar to schedule with this client.", to: "/admin/fit/calendar", label: "Open calendar" })} className="w-full rounded-full glass-panel-quiet py-2 text-xs font-semibold text-foreground"><Calendar className="mr-1 inline h-3.5 w-3.5" />Book session</button>
            <button onClick={() => go("Open conversation", { description: `Message ${c.name.split(" ")[0]} directly.`, to: "/admin/fit/messages", label: "Go to messages" })} className="w-full rounded-full glass-panel-quiet py-2 text-xs font-semibold text-foreground"><MessageSquare className="mr-1 inline h-3.5 w-3.5" />Message</button>
          </div>
          <div className="mt-5 border-t border-[color:var(--glass-stroke)] pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Adherence</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="metric-numeral text-3xl text-foreground">{c.adherence}%</span>
              <span className="text-[11px] text-muted-foreground">last 6 wk</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--muted)_60%,transparent)]">
              <div className="h-full rounded-full" style={{ width: `${c.adherence}%`, background: "linear-gradient(90deg,var(--teal),color-mix(in oklab,var(--navy) 70%,var(--teal)))" }} />
            </div>
          </div>

          {/* Coaching programs - provider controls what the client sees */}
          <div className="mt-5 border-t border-[color:var(--glass-stroke)] pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Coaching programs</p>
              <span className="text-[10px] text-muted-foreground">{activeCount}/3 on</span>
            </div>
            <div className="mt-3 space-y-2">
              {PROGRAM_KEYS.map((key) => {
                const Icon = PROGRAM_ICON[key];
                const on = programs[key];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                      on
                        ? "border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--surface-glass)_60%,transparent)]"
                        : "border-[color:var(--glass-stroke)] bg-transparent"
                    }`}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                      style={{ background: `color-mix(in oklab, ${PROGRAM_META[key].accent} 16%, transparent)`, color: PROGRAM_META[key].accent }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{PROGRAM_META[key].label}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{PROGRAM_META[key].blurb}</p>
                    </div>
                    <Switch checked={on} onCheckedChange={() => handleToggle(key)} aria-label={`Toggle ${PROGRAM_META[key].label}`} />
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              The client sees only the programs you enable here in their portal.
            </p>
            <a
              href={`/coaching/${c.id}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full glass-panel-quiet py-2 text-xs font-semibold text-foreground"
            >
              <Sparkle className="h-3.5 w-3.5" /> Preview client portal
            </a>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          <PageHeader eyebrow="Client profile" title={c.name} description={`${c.program} · started ${c.startedWeeksAgo} weeks ago`} />

          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t ? "bg-foreground text-background" : "glass-panel-quiet text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Progress" && (
            <div className="grid gap-5 lg:grid-cols-3">
              <Panel title="Weight trend" className="lg:col-span-2">
                <AreaTrend
                  data={weightSeries}
                  series={[
                    { key: "weight", label: "Weight (lb)", color: "var(--teal)" },
                    { key: "target", label: "Target",      color: "var(--data-pos)" },
                  ]}
                  height={260}
                />
              </Panel>
              <Panel title="Before / after">
                <ProgressPhotoCompare
                  before="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=480&q=70"
                  after="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=480&q=70"
                  beforeLabel="Week 0"
                  afterLabel={`Week ${c.startedWeeksAgo}`}
                />
              </Panel>
              <Panel title="Personal records" className="lg:col-span-3">
                <SimpleTable
                  headers={["Lift", "Start (lb)", "Current (lb)", "Δ", "Last hit"]}
                  rows={[
                    ["Back Squat",         225, 305, "+80", "Today"],
                    ["Bench Press",        185, 235, "+50", "2d ago"],
                    ["Deadlift",           275, 365, "+90", "Last Fri"],
                    ["Overhead Press",     115, 145, "+30", "Wed"],
                    ["Weighted Pull-Up",   "BW", "BW+45", "+45", "Mon"],
                  ]}
                />
              </Panel>
            </div>
          )}

          {tab === "Results" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Outcome report</p>
                  <p className="text-xs text-muted-foreground">Photos, body composition, and clinical markers in one shareable view.</p>
                </div>
                <a
                  href={`/results/${c.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
                >
                  <Share2 className="h-3.5 w-3.5" /> Open shareable report
                </a>
              </div>
              <ResultsReport client={c} />
            </div>
          )}

          {tab === "Program" && <ProgramTab clientId={c.id} weeksIn={c.startedWeeksAgo} />}

          {tab === "Nutrition" && (
            <div className="grid gap-5 lg:grid-cols-3">
              <Panel title="Daily macros" className="lg:col-span-1">
                <MacroRing protein={184} carbs={188} fat={62} proteinTarget={200} carbsTarget={200} fatTarget={65} />
              </Panel>
              <Panel title="7-day adherence" className="lg:col-span-2">
                <div className="space-y-3">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => {
                    const pct = [98, 92, 100, 88, 75, 64, 95][i];
                    return <BarRow key={d} label={d} value={pct} max={100} suffix="%" />;
                  })}
                </div>
              </Panel>
            </div>
          )}

          {tab === "Protocol" && (
            <ProtocolTab clientId={c.id} clientName={c.name} enabled={programs.protocol} onEnable={() => handleToggle("protocol")} />
          )}

          {tab === "Check-ins" && (
            <Panel title={`Week ${checkInCard.week} check-in`}>
              <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Mini label="Weight"   value={`${checkInCard.weight}`} highlight />
                    <Mini label="Δ"        value={`${checkInCard.weightDelta}`} />
                    <Mini label="Mood"     value={`${checkInCard.mood}/10`} />
                    <Mini label="Energy"   value={`${checkInCard.energy}/10`} />
                    <Mini label="Sleep"    value={`${checkInCard.sleep}h`} />
                    <Mini label="Steps"    value={`${(checkInCard.steps/1000).toFixed(1)}k`} />
                  </div>
                  <div className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3 text-sm text-foreground/90">
                    "{checkInCard.notes}"
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {checkInCard.photos.map((p, i) => (
                    <img key={i} src={p} alt={`Check-in photo ${i+1}`} className="aspect-[3/4] w-full rounded-lg object-cover ring-1 ring-[color:var(--glass-stroke-strong)]" />
                  ))}
                </div>
              </div>
            </Panel>
          )}

          {tab === "Messages" && (
            <Panel title="Conversation">
              <div className="space-y-3">
                {sampleConversation.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "trainer" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.from === "trainer"
                        ? "bg-foreground text-background rounded-br-sm"
                        : "glass-panel-quiet text-foreground rounded-bl-sm"
                    }`}>
                      <p>{m.text}</p>
                      <p className={`mt-1 text-[10px] ${m.from === "trainer" ? "text-background/60" : "text-muted-foreground"}`}>{m.when}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input placeholder="Reply to client…" className="h-10 flex-1 rounded-full glass-panel-quiet px-4 text-sm outline-none placeholder:text-muted-foreground" />
                <button onClick={() => toast.success("Message sent")} className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Send</button>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgramTab({ clientId, weeksIn }: { clientId: string; weeksIn: number }) {
  const go = useGoToast();
  const programs = usePrograms();
  const mealPlans = useMealPlans();
  const assignment = useAssignment(clientId);
  const program = programs.find((p) => p.id === assignment.programId) ?? programs[0];
  const plan = mealPlans.find((p) => p.id === assignment.mealPlanId) ?? mealPlans[0];

  return (
    <div className="space-y-4">
      <Panel title="Assigned programs" actions={<span className="text-[11px] text-muted-foreground">changes reach the client's app instantly</span>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Workout program</span>
            <select
              value={program.id}
              onChange={(e) => {
                assignToClient(clientId, { programId: e.target.value });
                toast.success("Program assigned", { description: "The client's Fitness tab now shows this program." });
              }}
              className="mt-1 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-2 text-sm text-foreground outline-none"
            >
              {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Meal plan</span>
            <select
              value={plan.id}
              onChange={(e) => {
                assignToClient(clientId, { mealPlanId: e.target.value });
                toast.success("Meal plan assigned", { description: "The client's Health tab now shows this plan." });
              }}
              className="mt-1 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-2 text-sm text-foreground outline-none"
            >
              {mealPlans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>
        <button
          onClick={() => go("Customize this program", { description: "Open it in the builder to adjust days, exercises, and coach notes.", to: "/admin/fit/workouts/builder", label: "Open in builder" })}
          className="mt-3 rounded-full glass-panel-quiet px-4 py-2 text-xs font-semibold text-foreground"
        >
          Edit program in builder
        </button>
      </Panel>

      <Panel title={`${program.name} · week view`} actions={<span className="text-[11px] text-muted-foreground">Week {Math.min(weeksIn + 1, program.weeks)} of {program.weeks}</span>}>
        <div className="space-y-4">
          {program.days.map((d) => (
            <div key={d.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
                  {d.day} · <span className="text-muted-foreground normal-case tracking-normal font-normal">{d.title}</span>
                </p>
                {d.exercises.length > 0 && (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{d.exercises.length} exercises</span>
                )}
              </div>
              {d.exercises.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[color:var(--glass-stroke)] p-3 text-center text-[11px] text-muted-foreground">
                  Rest day
                </div>
              ) : (
                <div className="space-y-1.5">
                  {d.exercises.map((ex) => <ExerciseRow key={ex.id} ex={ex} />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ProtocolTab({ clientId, clientName, enabled, onEnable }: { clientId: string; clientName: string; enabled: boolean; onEnable: () => void }) {
  const go = useGoToast();
  const p = protocolFor(clientId);

  if (!enabled) {
    return (
      <Panel title="Protocol program">
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "color-mix(in oklab, var(--chart-violet, #a78bfa) 16%, transparent)", color: "var(--chart-violet, #a78bfa)" }}>
            <Sparkle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Protocol isn't enabled for {clientName}</p>
            <p className="mt-1 text-xs text-muted-foreground">Turn it on to assign a skincare or clinical regimen, supplements, and dosing.</p>
          </div>
          <button onClick={onEnable} className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            Enable Protocol program
          </button>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-5">
      <Panel
        title={p.name}
        actions={<span className="text-[11px] text-muted-foreground">{p.category} · {p.durationWeeks} weeks</span>}
      >
        <p className="text-sm text-muted-foreground">{p.summary}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => toast.success("Protocol sent to client", { description: `${clientName} can now view it in their portal.` })} className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            Send to client
          </button>
          <button onClick={() => go("Swap protocol", { description: "Browse the library and pick a different regimen.", to: "/admin/fit/protocols", label: "Open Protocol library", kind: "info" })} className="rounded-full glass-panel-quiet px-4 py-2 text-xs font-semibold text-foreground">
            Swap protocol
          </button>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Regimen">
          <div className="space-y-2">
            {p.regimen.map((r) => (
              <div key={r.step} className="flex items-start gap-3 rounded-lg border border-[color:var(--glass-stroke)] p-2.5">
                <span className="mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: "color-mix(in oklab, var(--chart-violet, #a78bfa) 16%, transparent)", color: "var(--chart-violet, #a78bfa)" }}>{r.time}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">{r.product}</p>
                  <p className="text-[11px] text-muted-foreground">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Supplements">
            <SimpleTable
              headers={["Supplement", "Dose", "Timing"]}
              rows={p.supplements.map((s) => [s.name, s.dose, s.timing])}
            />
          </Panel>
          {p.dosing.length > 0 && (
            <Panel title="Dosing schedule">
              <SimpleTable
                headers={["Medication", "Schedule", "Route"]}
                rows={p.dosing.map((d) => [d.med, d.schedule, d.route])}
              />
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border border-[color:var(--glass-stroke)] p-2.5 ${highlight ? "bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)]" : "bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]"}`}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="metric-numeral mt-0.5 text-xl text-foreground">{value}</p>
    </div>
  );
}
