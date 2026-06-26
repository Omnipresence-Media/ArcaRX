import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable, BarRow } from "@/components/shell/AnalyticsSubPage";

export const Route = createFileRoute("/admin/phone-calls")({
  head: () => ({ meta: [{ title: "Phone Calls - ARCA Rx" }] }),
  component: Page,
});

function Page() {
  return (
    <AnalyticsSubPage
      title="Phone Calls"
      description="Call volume, answer rate, conversion to consult, and missed-call recovery."
      stats={[
        { label: "Calls MTD", value: "2,184", sub: "+6%" },
        { label: "Answer Rate", value: "92%", sub: "Target 95%" },
        { label: "Avg Wait", value: "0:18", sub: "−0:06" },
        { label: "Call → Book", value: "34%", sub: "+2pp" },
        { label: "Missed Recovered", value: "78%", sub: "via SMS" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Call reasons">
          <div className="space-y-3">
            <BarRow label="Book appointment" value={812} max={2184} />
            <BarRow label="Service question" value={482} max={2184} />
            <BarRow label="Reschedule" value={362} max={2184} />
            <BarRow label="Billing" value={284} max={2184} />
            <BarRow label="Membership" value={244} max={2184} />
          </div>
        </Panel>
        <Panel title="Agent performance">
          <div className="space-y-3">
            <BarRow label="Sasha (Lead)" value={94} max={100} suffix="%" />
            <BarRow label="Kai" value={88} max={100} suffix="%" />
            <BarRow label="Devon" value={82} max={100} suffix="%" />
            <BarRow label="AI Voice (after hrs)" value={71} max={100} suffix="%" />
          </div>
        </Panel>
      </div>
      <Panel title="Recent calls">
        <SimpleTable
          headers={["Time", "Caller", "Reason", "Duration", "Outcome"]}
          rows={[
            ["09:12", "Lena Park", "New consult", "4:18", "Booked"],
            ["09:34", "Jonas Wei", "Reschedule", "1:42", "Moved"],
            ["10:02", "Unknown", "Hang-up", "0:08", "Recovered via SMS"],
            ["10:48", "Maya Kim", "Pricing", "6:22", "Quote sent"],
            ["11:14", "Ezra Cohen", "Membership", "3:51", "Upgraded Gold"],
          ]}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
