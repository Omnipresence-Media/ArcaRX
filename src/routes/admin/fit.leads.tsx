import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { LeadKanban } from "@/components/shell/fit/LeadKanban";
import { leads } from "@/lib/fit-seed-extra";

export const Route = createFileRoute("/admin/fit/leads")({
  head: () => ({ meta: [{ title: "Leads - ARCA Fit" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const pipeline = leads.reduce((s, l) => s + l.value, 0);
  const bySource = leads.reduce<Record<string, number>>((acc, l) => { acc[l.source] = (acc[l.source] ?? 0) + 1; return acc; }, {});
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader eyebrow="Business" title="Lead pipeline" description="Inquiry → Consult → Onboarding → Active." />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Open leads",     value: leads.filter((l) => l.stage !== "Active").length },
          { label: "Pipeline value", value: `$${pipeline.toLocaleString()}` },
          { label: "Conversion",     value: "38%" },
          { label: "Avg deal",       value: "$1,178" },
        ].map((k) => (
          <div key={k.label} className="glass-panel p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
            <p className="metric-numeral mt-2 text-3xl text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      <Panel title="Pipeline">
        <LeadKanban />
      </Panel>

      <Panel title="Source attribution">
        <div className="grid gap-3 md:grid-cols-5">
          {Object.entries(bySource).map(([src, n]) => (
            <div key={src} className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{src}</p>
              <p className="metric-numeral mt-1 text-2xl text-foreground">{n}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
