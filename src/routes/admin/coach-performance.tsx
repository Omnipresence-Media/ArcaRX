import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable, BarRow } from "@/components/shell/AnalyticsSubPage";
import { providers } from "@/lib/data/providers";

export const Route = createFileRoute("/admin/coach-performance")({
  head: () => ({ meta: [{ title: "Coach Performance — ARCA Rx" }] }),
  component: Page,
});

function Page() {
  const max = Math.max(...providers.map((p) => p.revenue));
  return (
    <AnalyticsSubPage
      title="Coach Performance"
      description="Revenue, retention, NPS, and protocol adherence per provider/coach."
      stats={[
        { label: "Top Performer", value: "Dr. Chen", sub: "$41.2k" },
        { label: "Avg Utilization", value: "79%", sub: "+3pp" },
        { label: "Avg NPS", value: "74", sub: "+4" },
        { label: "Repeat Rate", value: "82%", sub: "+2pp" },
        { label: "Protocol Adherence", value: "94%", sub: "+1pp" },
      ]}
    >
      <Panel title="Revenue per provider">
        <div className="space-y-3">
          {providers.map((p) => <BarRow key={p.id} label={p.name} value={p.revenue} max={max} suffix=" $" />)}
        </div>
      </Panel>
      <Panel title="Performance scorecard">
        <SimpleTable
          headers={["Provider", "Patients", "Revenue", "Util %", "NPS", "Repeat"]}
          rows={providers.map((p) => [p.name, p.patients, `$${p.revenue.toLocaleString()}`, `${p.utilization}%`, "72-78", "78-86%"])}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
