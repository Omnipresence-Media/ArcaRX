import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable, BarRow } from "@/components/shell/AnalyticsSubPage";

export const Route = createFileRoute("/admin/referrals")({
  head: () => ({ meta: [{ title: "Referral Program — ARCA Rx" }] }),
  component: Page,
});

function Page() {
  return (
    <AnalyticsSubPage
      title="Referral Program"
      description="Member-driven growth, payouts, and per-advocate LTV."
      stats={[
        { label: "Advocates", value: "184", sub: "+12 MTD" },
        { label: "Referrals MTD", value: "62", sub: "+18%" },
        { label: "Conversion", value: "48%", sub: "vs 22% paid" },
        { label: "Rewards Paid", value: "$3,840", sub: "MTD" },
        { label: "Referred LTV", value: "$11,240", sub: "1.3× avg" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Top advocates">
          <div className="space-y-3">
            <BarRow label="Imani Brooks" value={14} max={14} suffix=" refs" />
            <BarRow label="Owen Pham" value={9} max={14} suffix=" refs" />
            <BarRow label="Eliana Ruiz" value={8} max={14} suffix=" refs" />
            <BarRow label="Naomi Carter" value={6} max={14} suffix=" refs" />
            <BarRow label="Harper Nakamura" value={4} max={14} suffix=" refs" />
          </div>
        </Panel>
        <Panel title="Reward tier mix">
          <div className="space-y-3">
            <BarRow label="$50 service credit" value={142} max={184} />
            <BarRow label="$200 cash" value={28} max={184} />
            <BarRow label="1 month free membership" value={14} max={184} />
          </div>
        </Panel>
      </div>
      <Panel title="Recent referrals">
        <SimpleTable
          headers={["Date", "Advocate", "New Patient", "Status", "Reward"]}
          rows={[
            ["Today", "Imani Brooks", "Lena Park", "Converted", "$200"],
            ["Yesterday", "Owen Pham", "Jonas Wei", "Consult booked", "Pending"],
            ["2d ago", "Eliana Ruiz", "Maya Kim", "Converted", "$50 credit"],
            ["3d ago", "Naomi Carter", "Ezra Cohen", "No-show", "—"],
            ["5d ago", "Harper Nakamura", "Sage Ortiz", "Converted", "1 mo free"],
          ]}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
