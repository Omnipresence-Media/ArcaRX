import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clinical"
        title="Protocols"
        description="Standardized treatment paths with adherence tracking and outcome reporting."
        actions={<Button className="gradient-brand text-white" onClick={() => toast.info("New protocol", { description: "Build a treatment protocol with dosing, labs, and follow-up cadence." })}>+ New protocol</Button>}
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
