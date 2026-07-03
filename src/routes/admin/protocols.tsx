import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateModal } from "@/components/shell/CreateButton";

export const Route = createFileRoute("/admin/protocols")({
  head: () => ({ meta: [{ title: "Protocols - ARCA Rx" }] }),
  component: Page,
});

const protocols = [
  { name: "Testosterone Optimization · Male", phase: "8-week titration", patients: 142, adherence: 94, owner: "Dr. Patel" },
  { name: "Semaglutide Weight Protocol", phase: "12-week ramp", patients: 96, adherence: 88, owner: "J. Reeves" },
  { name: "Estradiol + Progesterone · Female", phase: "Quarterly review", patients: 84, adherence: 91, owner: "Dr. Patel" },
  { name: "Morpheus8 Series · Face", phase: "3-session series", patients: 62, adherence: 97, owner: "Dr. Chen" },
  { name: "NAD+ Longevity Stack", phase: "Monthly infusion", patients: 48, adherence: 86, owner: "M. Okonkwo" },
  { name: "Peptide Recovery · BPC-157", phase: "6-week cycle", patients: 34, adherence: 79, owner: "Dr. Patel" },
];

function Page() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="space-y-5 p-4 md:p-8">
      <CreateModal
        open={creating}
        onClose={() => setCreating(false)}
        title="New protocol"
        description="Build a treatment protocol with dosing, labs, and follow-up cadence."
        submitLabel="Create protocol"
        fields={[
          { name: "name", label: "Protocol name", placeholder: "e.g. TRT titration" },
          { name: "track", label: "Treatment track", type: "select", options: ["HRT / TRT", "GLP-1 / weight loss", "Aesthetics", "Peptides", "Longevity"] },
          { name: "dosing", label: "Dosing & schedule", type: "textarea", placeholder: "Medication, dose, route, cadence…" },
          { name: "labs", label: "Lab cadence", placeholder: "Baseline, 6 weeks, then quarterly" },
        ]}
      />
      <PageHeader
        eyebrow="Clinical"
        title="Protocols"
        description="Standardized treatment paths with adherence tracking and outcome reporting."
        actions={<Button className="gradient-brand text-white" onClick={() => setCreating(true)}>+ New protocol</Button>}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {protocols.map((p) => (
          <Card key={p.name} className="surface-elevated">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-semibold">{p.name}</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{p.adherence}%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{p.phase}</p>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Active patients</span>
                <span className="font-mono tabular-nums font-medium">{p.patients}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium">{p.owner}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-muted">
                <div className="h-full gradient-brand" style={{ width: `${p.adherence}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
