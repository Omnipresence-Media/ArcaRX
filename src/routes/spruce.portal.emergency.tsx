import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Phone, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createEmergency, useSpruce, type Emergency } from "@/features/spruce/store";
import { EmptyState, Pill, SectionCard, SpPage } from "@/features/spruce/ui";

export const Route = createFileRoute("/spruce/portal/emergency")({
  head: () => ({ meta: [{ title: "Emergency - Spruce Micro" }] }),
  component: EmergencyPage,
});

const STATUS: Record<Emergency["status"], { label: string; tone: "danger" | "warning" | "success" }> = {
  open: { label: "Open", tone: "danger" },
  acknowledged: { label: "Acknowledged", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
};

function EmergencyPage() {
  const s = useSpruce();
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const mine = s.emergencies.filter((e) => e.patientId === s.meId);

  function submit() {
    const text = body.trim();
    if (!text) {
      toast.error("Please describe what is happening.");
      return;
    }
    createEmergency(text);
    setBody("");
    setSent(true);
    toast.success("Emergency request sent");
  }

  return (
    <SpPage title="Emergency" sub="Emergency requests are always available, even if your membership is paused or past due.">
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <Phone className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">If this is a medical emergency, call 911.</p>
          <p className="mt-0.5 text-xs">Do not wait for a reply here if you are in danger.</p>
        </div>
      </div>

      {sent ? (
        <SectionCard>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--teal)]" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">We received your request. We will respond today.</p>
              <p className="text-xs text-muted-foreground">For a medical emergency, call 911 right away.</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setSent(false)}>
                Send another request
              </Button>
            </div>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Describe what is happening">
          <div className="space-y-3">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Describe what is happening"
              aria-label="Describe what is happening"
            />
            <Button
              onClick={submit}
              className="w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto"
            >
              <ShieldAlert className="h-4 w-4" />
              Send
            </Button>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Previous requests">
        {mine.length === 0 ? (
          <EmptyState title="No emergency requests" body="If you send one, it will show up here with its status." />
        ) : (
          <ul className="divide-y">
            {mine.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm">{e.body}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.at}</p>
                </div>
                <Pill tone={STATUS[e.status].tone}>{STATUS[e.status].label}</Pill>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </SpPage>
  );
}
