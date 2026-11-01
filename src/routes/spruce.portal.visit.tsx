import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SpPage, SectionCard, EmptyState, Pill } from "@/features/spruce/ui";
import { VISIT_QUESTIONS, submitVisit, useSpruce, type Visit } from "@/features/spruce/store";
import { money } from "@/features/spruce/rules";

export const Route = createFileRoute("/spruce/portal/visit")({
  head: () => ({ meta: [{ title: "Doctor visit - Spruce Micro" }] }),
  validateSearch: (s: Record<string, unknown>): { id?: string } => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: VisitPage,
});

function VisitPage() {
  const s = useSpruce();
  const { id } = Route.useSearch();
  const mine = s.visits.filter((v) => v.patientId === s.meId);
  const visit = (id ? mine.find((v) => v.id === id) : undefined) ?? mine[0];

  if (!visit) {
    return (
      <SpPage title="Doctor visit">
        <EmptyState
          title="No doctor visit yet"
          body="If an order includes a prescription item without an active prescription, a quick visit is created at checkout."
          action={<Button asChild size="sm"><Link to="/spruce/portal/store">Go to the store</Link></Button>}
        />
      </SpPage>
    );
  }
  return <VisitView key={visit.id} visit={visit} />;
}

function VisitView({ visit }: { visit: Visit }) {
  const s = useSpruce();
  const names = visit.productIds.map((pid) => s.products.find((p) => p.id === pid)?.name ?? "Prescription item");

  return (
    <SpPage title="Doctor visit" sub="A licensed doctor reviews your prescription items before they ship.">
      {visit.status === "awaiting_patient" && <Form visit={visit} names={names} />}

      {visit.status === "in_review" && (
        <SectionCard>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--teal)]" />
            <div className="space-y-2">
              <p className="text-sm font-semibold">A doctor is reviewing your case</p>
              <p className="text-sm text-muted-foreground">This is usually same day. We will email you when there is a decision.</p>
              <ReviewList names={names} />
              <p className="text-xs text-muted-foreground">Prototype: use the Demo button to approve or decline.</p>
            </div>
          </div>
        </SectionCard>
      )}

      {visit.status === "approved" && (
        <SectionCard>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="space-y-2">
              <p className="text-sm font-semibold">Approved</p>
              <p className="text-sm text-muted-foreground">Your prescription has been created and the pharmacy will ship your items. You will get tracking as soon as it is on the way.</p>
              <ReviewList names={names} />
              <Button asChild size="sm"><Link to="/spruce/portal/orders">View my orders</Link></Button>
            </div>
          </div>
        </SectionCard>
      )}

      {visit.status === "declined" && (
        <SectionCard>
          <div className="space-y-2">
            <p className="text-sm font-semibold">The doctor was not able to approve these items</p>
            <p className="text-sm text-muted-foreground">
              The prescription items were released and you will not be charged for them. The visit fee is kept because the doctor reviewed your case. Any essentials in the order still ship.
            </p>
            <ReviewList names={names} />
            <Button asChild size="sm" variant="outline"><Link to="/spruce/portal/orders">View my orders</Link></Button>
          </div>
        </SectionCard>
      )}
    </SpPage>
  );
}

function ReviewList({ names }: { names: string[] }) {
  return (
    <ul className="list-disc space-y-0.5 pl-5 text-sm">
      {names.map((n, i) => <li key={`${n}-${i}`}>{n}</li>)}
    </ul>
  );
}

function Form({ visit, names }: { visit: Visit; names: string[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [videoName, setVideoName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement | null>(null);

  const set = (qid: string, v: string) => {
    setAnswers((a) => ({ ...a, [qid]: v }));
    setErrors((e) => ({ ...e, [qid]: false }));
  };

  const submit = () => {
    const errs: Record<string, boolean> = {};
    for (const q of VISIT_QUESTIONS) if (!answers[q.id]?.trim()) errs[q.id] = true;
    if (visit.type === "video" && !videoName) errs.video = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please answer every question to continue.");
      return;
    }
    submitVisit(visit.id, { answers, videoName: videoName ?? undefined });
    toast.success("Visit submitted. A doctor will review it soon.");
  };

  return (
    <>
      <SectionCard title="Needs review">
        <ReviewList names={names} />
        <p className="mt-3 text-sm text-muted-foreground">
          One flat visit fee of <span className="font-semibold text-foreground">{money(visit.feeCents)}</span> covers all of these items.
        </p>
      </SectionCard>

      {visit.type === "video" && (
        <SectionCard title="Short video">
          <p className="mb-3 text-sm text-muted-foreground">Record a short video of your skin concerns so the doctor can see them in good light.</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 text-sm text-muted-foreground transition-colors hover:border-[color:var(--teal)] ${errors.video ? "border-red-400" : ""}`}
          >
            <Upload className="h-4 w-4" />
            {videoName ? videoName : "Tap to choose a video"}
          </button>
          {errors.video && <p className="mt-1 text-xs text-red-600">A video is required.</p>}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setVideoName(f.name);
                setErrors((x) => ({ ...x, video: false }));
              }
              e.target.value = "";
            }}
          />
        </SectionCard>
      )}

      <SectionCard title="Health questions">
        <div className="space-y-5">
          {VISIT_QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="text-sm font-medium">{q.prompt}</p>
              {q.type === "yes_no" ? (
                <div className="flex gap-2">
                  {["Yes", "No"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set(q.id, opt)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${answers[q.id] === opt ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <Textarea rows={3} value={answers[q.id] ?? ""} onChange={(e) => set(q.id, e.target.value)} />
              )}
              {errors[q.id] && <p className="text-xs text-red-600">This answer is required.</p>}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center gap-2">
        <Button className="flex-1 sm:flex-none" onClick={submit}>Submit for doctor review</Button>
        <Pill tone="warning">Required to ship</Pill>
      </div>
    </>
  );
}
