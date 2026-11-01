import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileSignature, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateModal } from "@/components/shell/CreateButton";
import { SpPage, SectionCard, Pill, EmptyState, ToneImage } from "@/features/spruce/ui";
import { approvePatient, rejectPatient, requestChanges, useSpruce, type Patient } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/approvals")({
  head: () => ({ meta: [{ title: "Approvals - Spruce Micro" }] }),
  component: Approvals,
});

const planLabel = (p: Patient) => (p.membershipType === "virtual" ? "Virtual" : p.membershipType === "in_clinic" ? "In-Clinic" : "Not chosen");

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function Approvals() {
  const s = useSpruce();
  const pending = s.patients.filter((p) => p.onboarding === "pending_review");
  const waiting = s.patients.filter((p) => p.onboarding === "changes_requested");
  const [changesFor, setChangesFor] = useState<Patient | null>(null);
  const [rejectFor, setRejectFor] = useState<Patient | null>(null);

  return (
    <SpPage title="Approvals" sub="Review consent, ID and baseline photos before a member goes live.">
      {pending.length === 0 ? (
        <EmptyState title="The approval queue is clear" body="When a new member finishes onboarding, they appear here for review. Approving schedules their first check-in and sends a welcome email." />
      ) : (
        <div className="space-y-4">
          {pending.map((p) => (
            <SectionCard key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.code} - {planLabel(p)} - {p.state} - Submitted {p.createdLabel}</p>
                </div>
                <Pill tone="warning">Pending review</Pill>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Panel title="Consent">
                  <div className="flex items-start gap-2 text-sm">
                    <FileSignature className="mt-0.5 h-4 w-4 text-[color:var(--teal)]" />
                    <div>
                      <p className="font-medium">Signed by {p.name}</p>
                      <p className="text-xs text-muted-foreground">Consent v2 - signed {p.createdLabel}</p>
                    </div>
                  </div>
                  <Pill tone={p.consentSigned ? "success" : "danger"}>{p.consentSigned ? "On file" : "Missing"}</Pill>
                </Panel>

                <Panel title="Photo ID">
                  <div className="relative overflow-hidden rounded-lg ring-2 ring-emerald-400/70">
                    <ToneImage tone="from-slate-100 to-slate-300" label="ID, front" className="aspect-[1.6/1] w-full" />
                    <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  </div>
                </Panel>

                <Panel title="Baseline photos">
                  {p.membershipType === "virtual" ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Front", "Left", "Right"].map((l, i) => (
                        <ToneImage key={l} tone={["from-rose-100 to-orange-200", "from-amber-100 to-rose-200", "from-orange-100 to-amber-200"][i]} label={l} className="aspect-[3/4] rounded-md" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not required for in-clinic members</p>
                  )}
                </Panel>
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setRejectFor(p)}>Reject</Button>
                <Button variant="outline" size="sm" onClick={() => setChangesFor(p)}>Request changes</Button>
                <Button
                  size="sm"
                  className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90"
                  onClick={() => {
                    approvePatient(p.id);
                    toast.success("Approved. First check-in scheduled for Fri, Nov 6 and welcome email sent");
                  }}
                >
                  <CheckCircle2 /> Approve
                </Button>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      <SectionCard title="Waiting on patient">
        {waiting.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one is waiting on updates. Patients you send back for changes show up here until they resubmit.</p>
        ) : (
          <ul className="divide-y">
            {waiting.map((p) => (
              <li key={p.id} className="flex flex-wrap items-start justify-between gap-2 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{p.name} <span className="text-xs font-normal text-muted-foreground">{p.code}</span></p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.changesReason ?? "Changes requested."}</p>
                </div>
                <Pill tone="info">Changes requested</Pill>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <CreateModal
        open={changesFor !== null}
        onClose={() => setChangesFor(null)}
        title="Request changes"
        description={changesFor ? `Tell ${changesFor.name} what to fix. The email will not include these details.` : undefined}
        fields={[{ name: "reason", label: "Reason", type: "textarea", placeholder: "Your photo ID was blurry. Please upload a clear photo of the front." }]}
        submitLabel="Send request"
        successMessage="Changes requested. Patient emailed (no details in the email)."
        onSubmit={(v) => {
          if (changesFor) requestChanges(changesFor.id, (v.reason ?? "").trim() || "Please review and update your information.");
        }}
      />

      <Dialog open={rejectFor !== null} onOpenChange={(o) => { if (!o) setRejectFor(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this application?</DialogTitle>
            <DialogDescription>{rejectFor ? `${rejectFor.name} (${rejectFor.code}) will not be able to join. This cannot be undone in the prototype.` : ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectFor(null)}>Keep in queue</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (rejectFor) {
                  rejectPatient(rejectFor.id);
                  toast.success("Application rejected");
                }
                setRejectFor(null);
              }}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SpPage>
  );
}
