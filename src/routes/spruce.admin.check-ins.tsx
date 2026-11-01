import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpPage, SectionCard, Pill, EmptyState, ToneImage } from "@/features/spruce/ui";
import { CHECKIN_QUESTIONS, cancelCheckIn, uploadProtocol, useSpruce, type CheckIn, type CheckInStatus } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/check-ins")({
  head: () => ({ meta: [{ title: "Check-ins - Spruce Micro" }] }),
  component: CheckIns,
});

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";
const STATUS: Record<CheckInStatus, { label: string; tone: Tone }> = {
  submitted: { label: "Submitted", tone: "warning" },
  open: { label: "Open", tone: "info" },
  scheduled: { label: "Scheduled", tone: "neutral" },
  reviewed: { label: "Reviewed", tone: "success" },
  missed: { label: "Missed", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

const SECTIONS: { title: string; statuses: CheckInStatus[]; empty: string }[] = [
  { title: "Submitted (awaiting review)", statuses: ["submitted"], empty: "No submitted check-ins. When a member submits one, it lands here for a protocol." },
  { title: "Open and scheduled", statuses: ["open", "scheduled"], empty: "Nothing scheduled right now." },
  { title: "Reviewed", statuses: ["reviewed"], empty: "No reviewed check-ins yet." },
  { title: "Missed", statuses: ["missed"], empty: "No missed check-ins." },
];

const PHOTO_TONES = ["from-rose-100 to-orange-200", "from-amber-100 to-rose-200", "from-orange-100 to-amber-200"];

function CheckIns() {
  const s = useSpruce();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = s.checkIns.find((c) => c.id === selectedId) ?? null;
  const visible = s.checkIns.filter((c) => c.status !== "cancelled");

  return (
    <SpPage title="Check-ins" sub="Review weekly check-ins and send each member a protocol.">
      {visible.length === 0 ? (
        <EmptyState title="No check-ins yet" body="Approved members get a check-in scheduled every Friday. They will show up here." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            {SECTIONS.map((sec) => {
              const rows = visible.filter((c) => sec.statuses.includes(c.status));
              return (
                <SectionCard key={sec.title} title={sec.title}>
                  {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{sec.empty}</p>
                  ) : (
                    <ul className="divide-y">
                      {rows.map((c) => {
                        const p = s.patients.find((x) => x.id === c.patientId);
                        const canOpen = c.status === "submitted" || c.status === "reviewed";
                        const st = STATUS[c.status];
                        return (
                          <li key={c.id} className={`flex items-center gap-3 py-2.5 text-sm ${selectedId === c.id ? "-mx-2 rounded-md bg-muted px-2" : ""}`}>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{p?.name ?? "Unknown patient"} <span className="text-xs font-normal text-muted-foreground">{p?.code}</span></p>
                              <p className="text-xs text-muted-foreground">Due {c.dueLabel}</p>
                            </div>
                            <Pill tone={st.tone}>{st.label}</Pill>
                            {canOpen && <Button variant="outline" size="sm" onClick={() => setSelectedId(c.id)}>{c.status === "submitted" ? "Review" : "View"}</Button>}
                            {c.status === "scheduled" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  cancelCheckIn(c.id);
                                  if (selectedId === c.id) setSelectedId(null);
                                  toast.success("Check-in cancelled");
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </SectionCard>
              );
            })}
          </div>

          <div>
            {selected && (selected.status === "submitted" || selected.status === "reviewed") ? (
              <ReviewPanel key={selected.id} checkIn={selected} onClose={() => setSelectedId(null)} />
            ) : (
              <EmptyState title="Select a check-in" body="Open a submitted or reviewed check-in to see the answers and photos, and to send a protocol." />
            )}
          </div>
        </div>
      )}
    </SpPage>
  );
}

function ReviewPanel({ checkIn, onClose }: { checkIn: CheckIn; onClose: () => void }) {
  const s = useSpruce();
  const patient = s.patients.find((p) => p.id === checkIn.patientId);
  const linked = s.protocols.find((pr) => pr.checkInId === checkIn.id);
  const [title, setTitle] = useState("Personalized protocol");
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <SectionCard
      title={`${patient?.name ?? "Patient"} - due ${checkIn.dueLabel}`}
      right={<Button variant="ghost" size="icon" aria-label="Close review" onClick={onClose}><X /></Button>}
      className="lg:sticky lg:top-4"
    >
      <div className="space-y-5">
        <div className="space-y-3">
          {CHECKIN_QUESTIONS.map((q) => {
            const raw = checkIn.answers?.[q.id];
            const answer = raw ? (q.type === "scale" ? `${raw} / 10` : raw) : "No answer";
            return (
              <div key={q.id}>
                <p className="text-xs text-muted-foreground">{q.prompt}</p>
                <p className="text-sm font-medium">{answer}</p>
              </div>
            );
          })}
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Photos</p>
          <div className="grid grid-cols-3 gap-2">
            {["Front", "Left", "Right"].map((l, i) => (
              <ToneImage key={l} tone={PHOTO_TONES[i]} label={l} className="aspect-[3/4] rounded-lg" />
            ))}
          </div>
        </div>

        {checkIn.status === "reviewed" ? (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3 text-sm">
            <FileText className="h-4 w-4 text-[color:var(--teal)]" />
            <span>{linked ? `Protocol sent: ${linked.title}` : "Reviewed. No protocol linked."}</span>
          </div>
        ) : (
          <div className="space-y-3 rounded-lg border bg-muted/40 p-3">
            <p className="text-sm font-semibold">Upload protocol</p>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="protocol-title">Protocol title</label>
              <Input id="protocol-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="protocol-file">PDF file (demo, nothing is uploaded)</label>
              <input
                id="protocol-file"
                type="file"
                accept="application/pdf"
                className="block w-full text-xs file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              {fileName && <p className="text-xs text-muted-foreground">Attached: {fileName}</p>}
            </div>
            <Button
              className="w-full bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90"
              onClick={() => {
                uploadProtocol(checkIn.patientId, title.trim() || "Personalized protocol", checkIn.id);
                toast.success("Protocol sent. Patient emailed (no details in the email).");
              }}
            >
              Upload protocol and mark reviewed
            </Button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
