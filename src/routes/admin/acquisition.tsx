import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, BarRow, SimpleTable } from "@/components/shell/AnalyticsSubPage";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/acquisition")({
  head: () => ({ meta: [{ title: "Acquisition Funnel — ARCA Rx" }] }),
  component: Page,
});

const funnel = [
  { stage: "Impressions", count: 184320 },
  { stage: "Site Visits", count: 28940 },
  { stage: "Leads", count: 1240 },
  { stage: "Consults Booked", count: 418 },
  { stage: "Showed", count: 362 },
  { stage: "Converted", count: 214 },
];

const weekly = Array.from({ length: 12 }, (_, i) => ({
  wk: `W${i + 1}`,
  leads: 80 + Math.round(Math.sin(i / 2) * 18 + i * 4),
  consults: 22 + Math.round(Math.cos(i / 2) * 6 + i * 1.2),
}));

function Page() {
  return (
    <AnalyticsSubPage
      title="Acquisition Funnel"
      description="Top-of-funnel through converted member — measure where leads leak."
      stats={[
        { label: "Leads MTD", value: "1,240", sub: "+18%" },
        { label: "Visit → Lead", value: "4.3%", sub: "+0.4pp" },
        { label: "Lead → Consult", value: "33.7%", sub: "Target 35%" },
        { label: "Show Rate", value: "86.6%", sub: "+2pp" },
        { label: "Close Rate", value: "59.1%", sub: "+5pp" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Stage-by-stage">
          <div className="space-y-3">
            {funnel.map((f) => <BarRow key={f.stage} label={f.stage} value={f.count} max={funnel[0].count} />)}
          </div>
        </Panel>
        <Panel title="Leads vs Consults · 12 weeks">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weekly} margin={{ left: -10 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="wk" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="leads" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="consults" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Drop-off diagnostics">
        <SimpleTable
          headers={["Stage", "Volume", "Conv %", "Δ vs Last Mo", "Owner"]}
          rows={[
            ["Visit → Lead", 28940, "4.3%", "+0.4pp", "Marketing"],
            ["Lead → Consult", 1240, "33.7%", "-1.1pp", "Front Desk"],
            ["Consult → Show", 418, "86.6%", "+2.0pp", "Concierge"],
            ["Show → Close", 362, "59.1%", "+5.0pp", "Providers"],
          ]}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
