import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable, BarRow } from "@/components/shell/AnalyticsSubPage";

export const Route = createFileRoute("/admin/email-sms")({
  head: () => ({ meta: [{ title: "Email & SMS — ARCA Rx" }] }),
  component: Page,
});

const campaigns = [
  ["Summer Glow Promo", "Email", "1,240", "42%", "8.1%", "$4,820"],
  ["Reactivation 90d", "SMS", "318", "98%", "14.2%", "$3,210"],
  ["Hormone Lab Reminder", "SMS", "84", "97%", "62%", "$0"],
  ["New Member Welcome", "Email", "62", "71%", "22%", "$1,840"],
  ["Botox Pre-Book", "SMS", "412", "98%", "19%", "$6,140"],
];

function Page() {
  return (
    <AnalyticsSubPage
      title="Email & SMS"
      description="Lifecycle messaging performance, attributed revenue, and unsubscribe health."
      stats={[
        { label: "Sends MTD", value: "12.4k", sub: "+8%" },
        { label: "Open Rate", value: "47.3%", sub: "+1.8pp" },
        { label: "Click Rate", value: "9.1%", sub: "+0.6pp" },
        { label: "Attributed Rev", value: "$28,410", sub: "MTD" },
        { label: "Unsub Rate", value: "0.42%", sub: "Healthy" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Top-performing journeys">
          <div className="space-y-3">
            <BarRow label="Reactivation 90d" value={3210} max={6500} suffix=" $" />
            <BarRow label="Pre-Book Reminder" value={6140} max={6500} suffix=" $" />
            <BarRow label="Birthday Offer" value={2180} max={6500} suffix=" $" />
            <BarRow label="Welcome Series" value={1840} max={6500} suffix=" $" />
            <BarRow label="Lab Review" value={1420} max={6500} suffix=" $" />
          </div>
        </Panel>
        <Panel title="Deliverability">
          <div className="space-y-3">
            <BarRow label="Email Delivered" value={98} max={100} suffix="%" />
            <BarRow label="SMS Delivered" value={99} max={100} suffix="%" />
            <BarRow label="Spam Rate" value={1} max={100} suffix="%" />
            <BarRow label="Bounce Rate" value={2} max={100} suffix="%" />
          </div>
        </Panel>
      </div>
      <Panel title="Recent campaigns">
        <SimpleTable headers={["Campaign", "Channel", "Sent", "Delivered", "CTR", "Revenue"]} rows={campaigns} />
      </Panel>
    </AnalyticsSubPage>
  );
}
