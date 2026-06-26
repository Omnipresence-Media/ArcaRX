import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable, BarRow } from "@/components/shell/AnalyticsSubPage";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { mrrSeries } from "@/lib/seed-data";

export const Route = createFileRoute("/admin/membership-health")({
  head: () => ({ meta: [{ title: "Membership Health - ARCA Rx" }] }),
  component: Page,
});

function Page() {
  return (
    <AnalyticsSubPage
      title="Membership Health"
      description="MRR, churn, expansion, and cohort retention across all membership tiers."
      stats={[
        { label: "Active Members", value: "847", sub: "+24 MTD" },
        { label: "MRR", value: "$48,279", sub: "+6.4%" },
        { label: "Net Churn", value: "−1.2%", sub: "Negative = healthy" },
        { label: "Expansion MRR", value: "$4,820", sub: "Upgrades" },
        { label: "Avg Tenure", value: "14.2 mo", sub: "+0.6" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="MRR trend · 12 months">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mrrSeries} margin={{ left: -10 }}>
              <defs><linearGradient id="mh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
              </linearGradient></defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="mrr" stroke="var(--teal)" strokeWidth={2} fill="url(#mh)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Tier mix">
          <div className="space-y-3">
            <BarRow label="Platinum · $299" value={218} max={847} />
            <BarRow label="Gold · $149" value={384} max={847} />
            <BarRow label="Silver · $79" value={245} max={847} />
          </div>
        </Panel>
      </div>
      <Panel title="Cohort retention (% retained at month)">
        <SimpleTable
          headers={["Cohort", "M1", "M3", "M6", "M12", "M24"]}
          rows={[
            ["Jan '25", "100%", "94%", "88%", "78%", "-"],
            ["Apr '25", "100%", "96%", "91%", "82%", "-"],
            ["Jul '25", "100%", "97%", "92%", "-", "-"],
            ["Oct '25", "100%", "95%", "-", "-", "-"],
            ["Jan '26", "100%", "-", "-", "-", "-"],
          ]}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
