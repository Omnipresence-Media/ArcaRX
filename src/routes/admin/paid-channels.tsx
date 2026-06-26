import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable } from "@/components/shell/AnalyticsSubPage";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/paid-channels")({
  head: () => ({ meta: [{ title: "Paid Channels - ARCA Rx" }] }),
  component: Page,
});

const spend = [
  { ch: "Meta", spend: 8420, leads: 312, conv: 58, roas: 4.2 },
  { ch: "Google", spend: 6180, leads: 224, conv: 49, roas: 5.1 },
  { ch: "TikTok", spend: 2940, leads: 168, conv: 18, roas: 2.3 },
  { ch: "YouTube", spend: 1820, leads: 64, conv: 11, roas: 1.8 },
  { ch: "Local Print", spend: 1200, leads: 22, conv: 6, roas: 1.4 },
];

function Page() {
  const total = spend.reduce((s, r) => s + r.spend, 0);
  return (
    <AnalyticsSubPage
      title="Paid Channels"
      description="Spend, CAC, and ROAS across every paid acquisition channel."
      stats={[
        { label: "Spend MTD", value: `$${total.toLocaleString()}`, sub: "+12%" },
        { label: "Blended CAC", value: "$148", sub: "−$22" },
        { label: "Blended ROAS", value: "3.8×", sub: "Target 3.5×" },
        { label: "Conversions", value: "142", sub: "MTD" },
        { label: "Best Channel", value: "Google", sub: "5.1× ROAS" },
      ]}
    >
      <Panel title="Spend & conversions by channel">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={spend} margin={{ left: -10 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="ch" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="spend" fill="var(--teal)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
      <Panel title="Channel scorecard">
        <SimpleTable
          headers={["Channel", "Spend", "Leads", "Conv", "CAC", "ROAS"]}
          rows={spend.map((r) => [r.ch, `$${r.spend.toLocaleString()}`, r.leads, r.conv, `$${Math.round(r.spend / r.conv)}`, `${r.roas}×`])}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
