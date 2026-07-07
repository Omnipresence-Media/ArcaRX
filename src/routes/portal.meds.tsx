import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateModal } from "@/components/shell/CreateButton";
import { CheckCircle2, Circle, Truck, Package, RefreshCcw, AlertCircle } from "lucide-react";
import { medications as initialMeds } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/meds")({
  head: () => ({ meta: [{ title: "Medications - ARCA Rx Portal" }] }),
  component: Meds,
});

function shipBadge(s: string) {
  if (s === "delivered") return <Badge className="badge-active gap-1"><CheckCircle2 className="h-3 w-3" />Delivered</Badge>;
  if (s === "in_transit") return <Badge variant="outline" className="gap-1 border-[color:var(--info)]/40 text-[color:var(--info)]"><Truck className="h-3 w-3" />In transit</Badge>;
  return <Badge variant="outline" className="gap-1"><Package className="h-3 w-3" />Scheduled</Badge>;
}

function Meds() {
  const navigate = useNavigate();
  const [takenIds, setTakenIds] = useState<Set<string>>(
    () => new Set(initialMeds.filter(m => m.takenToday).map(m => m.id))
  );
  const [requestedIds, setRequestedIds] = useState<Set<string>>(() => new Set());
  const [loggingSideEffect, setLoggingSideEffect] = useState(false);

  function toggleTaken(id: string) {
    setTakenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function requestRefill(id: string, name: string) {
    setRequestedIds((prev) => new Set(prev).add(id));
    toast.success("Refill requested", { description: `We sent your ${name} refill to the pharmacy.` });
  }

  function logSideEffect(v: Record<string, string>) {
    if (!v.detail?.trim()) return;
    toast.success("Side-effect logged", { description: "Your care team will review it at your next visit." });
  }

  const medications = initialMeds.map(m => ({ ...m, takenToday: takenIds.has(m.id) }));

  return (
    <div className="space-y-5 p-4 md:p-8">
      <CreateModal
        open={loggingSideEffect}
        onClose={() => setLoggingSideEffect(false)}
        title="Log a side-effect"
        description="Describe what you're feeling so your care team can review it."
        submitLabel="Log side-effect"
        onSubmit={logSideEffect}
        fields={[
          { name: "medication", label: "Medication", type: "select", options: initialMeds.map((m) => m.name) },
          { name: "severity", label: "Severity", type: "select", options: ["Mild", "Moderate", "Severe"] },
          { name: "detail", label: "What are you experiencing?", type: "textarea", placeholder: "e.g. mild headache in the evenings" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Medications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your active prescriptions, refills, and shipments.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {medications.map((m) => {
          const lowRefill = m.refillsLeft === 0;
          return (
            <Card key={m.id} className={`surface-elevated ${lowRefill ? "border-[color:var(--warning)]/40" : ""}`}>
              <CardContent className="p-4 md:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold">{m.name}</p>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">{m.dose}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.schedule}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Prescribed by {m.prescriber}</p>
                  </div>
                  <button
                    onClick={() => toggleTaken(m.id)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      m.takenToday
                        ? "border-[color:var(--success)]/40 bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)] text-[color:var(--success)]"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-[color:var(--success)]/40"
                    }`}
                    aria-label={m.takenToday ? "Mark not taken" : "Mark taken"}
                  >
                    {m.takenToday ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-md border bg-card/60 p-3 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Refills</p>
                    <p className={`mt-0.5 font-mono text-sm ${lowRefill ? "text-[color:var(--warning)]" : ""}`}>
                      {m.refillsLeft} left
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next refill</p>
                    <p className="mt-0.5 font-mono text-sm">{m.nextRefill}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    {shipBadge(m.shipStatus)}
                    <p className="text-[11px] text-muted-foreground">{m.shipEta}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={lowRefill ? "default" : "outline"}
                    disabled={requestedIds.has(m.id)}
                    onClick={() => requestRefill(m.id, m.name)}
                    className={`h-8 text-xs ${lowRefill && !requestedIds.has(m.id) ? "gradient-brand text-white" : ""}`}
                  >
                    <RefreshCcw className="mr-1 h-3.5 w-3.5" />
                    {requestedIds.has(m.id) ? "Requested" : lowRefill ? "Request refill" : "Refill"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="surface-elevated">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--teal)]" />
          <div className="text-xs">
            <p className="font-medium text-foreground">Experiencing side-effects?</p>
            <p className="mt-0.5 text-muted-foreground">Log them so your care team can review at your next visit, or message us right away if urgent.</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setLoggingSideEffect(true)}>Log side-effect</Button>
              <Button size="sm" className="h-8 text-xs gradient-brand text-white" onClick={() => navigate({ to: "/portal/messages" })}>Message care team</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
