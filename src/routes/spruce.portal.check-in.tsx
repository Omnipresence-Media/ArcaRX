import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CHECKIN_QUESTIONS, submitCheckIn, useSpruce, type CheckIn } from "@/features/spruce/store";
import { headingFont } from "@/features/spruce/theme";
import { EmptyState, PhotoSlots, Pill, SectionCard, SpPage } from "@/features/spruce/ui";

export const Route = createFileRoute("/spruce/portal/check-in")({
  head: () => ({ meta: [{ title: "Check-in - Spruce Micro" }] }),
  component: CheckInPage,
});

const STATUS_PILL = {
  scheduled: { tone: "info", label: "Scheduled" },
  open: { tone: "brand", label: "Open" },
  submitted: { tone: "warning", label: "Submitted" },
  reviewed: { tone: "success", label: "Reviewed" },
  missed: { tone: "neutral", label: "Missed" },
  cancelled: { tone: "neutral", label: "Cancelled" },
} as const;

const TIPS = ["Face the camera straight on", "Turn your left cheek to the camera", "Turn your right cheek to the camera"];

function CheckInPage() {
  const s = useSpruce();
  const mine = s.checkIns.filter((c) => c.patientId === s.meId);
  const current = mine.find((c) => c.status === "open") ?? mine.find((c) => c.status === "scheduled") ?? mine[0];
  const rest = mine.filter((c) => c.id !== current?.id);
  const [viewId, setViewId] = useState<string | null>(null);
  const shown = (viewId ? mine.find((c) => c.id === viewId) : undefined) ?? current;

  if (!shown) {
    return (
      <SpPage title="Check-in">
        <EmptyState title="Your practitioner will schedule your next check-in" body="Check-ins open on a Monday and are due the Friday of that week." />
      </SpPage>
    );
  }

  return (
    <SpPage title="Check-in" sub={`Due ${shown.dueLabel}`}>
      <CheckInBody key={shown.id} c={shown} />
      {rest.length > 0 && (
        <SectionCard title="History">
          <ul className="divide-y">
            {[...(shown.id !== current?.id && current ? [current] : []), ...rest.filter((r) => r.id !== shown.id)].map((c) => {
              const p = STATUS_PILL[c.status];
              return (
                <li key={c.id}>
                  <button type="button" onClick={() => setViewId(c.id)} className="flex w-full items-center justify-between gap-3 py-2.5 text-left hover:bg-muted/50">
                    <span className="text-sm">Due {c.dueLabel}</span>
                    <Pill tone={p.tone}>{p.label}</Pill>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </SpPage>
  );
}

function AnswerList({ c }: { c: CheckIn }) {
  return (
    <dl className="space-y-3">
      {CHECKIN_QUESTIONS.map((q) => (
        <div key={q.id}>
          <dt className="text-xs text-muted-foreground">{q.prompt}</dt>
          <dd className="mt-0.5 text-sm">{c.answers?.[q.id] || "-"}</dd>
        </div>
      ))}
      <div>
        <dt className="text-xs text-muted-foreground">Photos</dt>
        <dd className="mt-0.5 text-sm">{c.photos ?? 0} added</dd>
      </div>
    </dl>
  );
}

function CheckInBody({ c }: { c: CheckIn }) {
  if (c.status === "scheduled") {
    return (
      <SectionCard>
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><Lock className="h-5 w-5" /></div>
          <p className="text-base font-semibold" style={headingFont}>Opens {c.opensLabel}</p>
          <p className="max-w-sm text-sm text-muted-foreground">Your check-in window runs from Monday to Friday at 11:59 PM. Come back then to answer a few questions and add three photos.</p>
        </div>
      </SectionCard>
    );
  }
  if (c.status === "open") return <OpenForm c={c} />;
  if (c.status === "submitted") {
    return (
      <SectionCard title="Submitted" right={<Pill tone="warning">In review</Pill>}>
        <p className="mb-4 text-sm text-muted-foreground">Your practitioner is reviewing your check-in.</p>
        <AnswerList c={c} />
      </SectionCard>
    );
  }
  if (c.status === "reviewed") {
    return (
      <SectionCard title="Reviewed" right={<Pill tone="success">Reviewed</Pill>}>
        <AnswerList c={c} />
        <Button asChild size="sm" className="mt-4"><Link to="/spruce/portal/protocols">See your protocols</Link></Button>
      </SectionCard>
    );
  }
  if (c.status === "missed") {
    return (
      <SectionCard>
        <div className="space-y-1 py-2 text-center">
          <p className="text-base font-semibold" style={headingFont}>This window closed</p>
          <p className="text-sm text-muted-foreground">No worries. Message your practitioner and they can help you get back on track.</p>
          <Button asChild size="sm" variant="outline" className="mt-3"><Link to="/spruce/portal/messages">Message practitioner</Link></Button>
        </div>
      </SectionCard>
    );
  }
  return (
    <SectionCard>
      <p className="py-2 text-center text-sm text-muted-foreground">This check-in was cancelled.</p>
    </SectionCard>
  );
}

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-2 text-sm transition-colors ${on ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-white" : "bg-card hover:border-[color:var(--teal)]"}`;

function OpenForm({ c }: { c: CheckIn }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  const [tried, setTried] = useState(false);

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  const missing = (id: string) => id !== "notes" && !(answers[id] ?? "").trim();
  const photosDone = previews.every(Boolean);

  const submit = () => {
    setTried(true);
    if (CHECKIN_QUESTIONS.some((q) => missing(q.id)) || !photosDone) {
      toast.error("Please answer every question and add all 3 photos.");
      return;
    }
    submitCheckIn(c.id, answers, 3);
    toast.success("Check-in submitted. Your practitioner will review it.");
  };

  return (
    <div className="space-y-4">
      <SectionCard title="This week">
        <div className="space-y-6">
          {CHECKIN_QUESTIONS.map((q) => {
            const val = answers[q.id] ?? "";
            const selected = val ? val.split(", ") : [];
            return (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium">{q.prompt}{q.id === "notes" && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}</p>
                {q.type === "scale" && (
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((n) => (
                      <button key={n} type="button" onClick={() => set(q.id, n)} className={`h-10 rounded-lg border text-sm font-medium ${val === n ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-white" : "bg-card hover:border-[color:var(--teal)]"}`}>{n}</button>
                    ))}
                  </div>
                )}
                {q.type === "yes_no" && (
                  <div className="grid grid-cols-2 gap-2">
                    {["Yes", "No"].map((o) => (
                      <button key={o} type="button" onClick={() => set(q.id, o)} className={`h-10 rounded-lg border text-sm font-medium ${val === o ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-white" : "bg-card hover:border-[color:var(--teal)]"}`}>{o}</button>
                    ))}
                  </div>
                )}
                {q.type === "multi" && (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((o) => {
                      const on = selected.includes(o);
                      return (
                        <button key={o} type="button" aria-pressed={on} onClick={() => set(q.id, (on ? selected.filter((x) => x !== o) : [...selected, o]).join(", "))} className={chip(on)}>{o}</button>
                      );
                    })}
                  </div>
                )}
                {q.type === "single" && (
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {q.options.map((o) => (
                      <button key={o} type="button" role="radio" aria-checked={val === o} onClick={() => set(q.id, o)} className={chip(val === o)}>{o}</button>
                    ))}
                  </div>
                )}
                {q.type === "long" && <Textarea rows={3} value={val} onChange={(e) => set(q.id, e.target.value)} placeholder="Optional" />}
                {tried && missing(q.id) && <p className="text-xs font-medium text-red-600">This question is required.</p>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Photos" right={<span className="text-xs text-muted-foreground">{previews.filter(Boolean).length} of 3</span>}>
        <PhotoSlots
          labels={["Front", "Left", "Right"]}
          previews={previews}
          onPick={(i, url) => setPreviews((p) => p.map((x, j) => (j === i ? url : x)))}
        />
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          {TIPS.map((t) => <li key={t}>{t}</li>)}
        </ul>
        {tried && !photosDone && <p className="mt-2 text-xs font-medium text-red-600">Please add all 3 photos.</p>}
      </SectionCard>

      <Button type="button" className="w-full sm:w-auto" onClick={submit}>Submit check-in</Button>
    </div>
  );
}
