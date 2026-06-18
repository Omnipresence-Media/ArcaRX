import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable } from "@/components/shell/AnalyticsSubPage";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/product-revenue")({
  head: () => ({ meta: [{ title: "Product Revenue — ARCA Rx" }] }),
  component: Page,
});

const byCat = [
  { cat: "Injectables", rev: 84200 },
  { cat: "Hormones", rev: 41800 },
  { cat: "Weight", rev: 38400 },
  { cat: "Lasers", rev: 28600 },
  { cat: "IV Therapy", rev: 14200 },
  { cat: "Skin", rev: 9800 },
];

function Page() {
  const total = byCat.reduce((s, r) => s + r.rev, 0);
  return (
    <AnalyticsSubPage
      title="Product Revenue"
      description="Per-SKU performance, category contribution, and inventory-tied margin."
      stats={[
        { label: "Revenue MTD", value: `$${(total / 1000).toFixed(1)}k`, sub: "+11%" },
        { label: "Top Category", value: "Injectables", sub: "38% mix" },
        { label: "Avg Order", value: "$487", sub: "+$32" },
        { label: "Gross Margin", value: "68.4%", sub: "+1.2pp" },
        { label: "Refunds", value: "0.8%", sub: "Healthy" },
      ]}
    >
      <Panel title="Revenue by category">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byCat} margin={{ left: -10 }} layout="vertical">
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `$${v / 1000}k`} />
            <YAxis type="category" dataKey="cat" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={110} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="rev" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
      <Panel title="Top SKUs">
        <SimpleTable
          headers={["SKU", "Units", "Revenue", "Margin", "Δ MoM"]}
          rows={[
            ["Neurotoxin (unit)", 4820, "$67,480", "72%", "+14%"],
            ["Dermal Filler 1mL", 168, "$142,800", "64%", "+8%"],
            ["Semaglutide Monthly", 96, "$38,304", "58%", "+22%"],
            ["Testosterone Plan", 142, "$41,038", "61%", "+5%"],
            ["Morpheus8 · Face", 18, "$33,300", "70%", "+18%"],
          ]}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
