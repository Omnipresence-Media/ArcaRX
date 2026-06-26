import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSubPage, Panel, SimpleTable, BarRow } from "@/components/shell/AnalyticsSubPage";

export const Route = createFileRoute("/admin/bookings-analytics")({
  head: () => ({ meta: [{ title: "In-Clinic & Bookings - ARCA Rx" }] }),
  component: Page,
});

function Page() {
  return (
    <AnalyticsSubPage
      title="In-Clinic & Bookings"
      description="Booking volume, utilization, no-shows, and chair-time efficiency."
      stats={[
        { label: "Bookings MTD", value: "1,184", sub: "+9%" },
        { label: "Utilization", value: "82%", sub: "Target 85%" },
        { label: "No-Show Rate", value: "4.1%", sub: "−0.6pp" },
        { label: "Avg Lead Time", value: "9.2 days", sub: "+0.4" },
        { label: "Rebook Rate", value: "71%", sub: "+3pp" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Utilization by provider">
          <div className="space-y-3">
            <BarRow label="Dr. Chen" value={94} max={100} suffix="%" />
            <BarRow label="Dr. Patel" value={88} max={100} suffix="%" />
            <BarRow label="S. Whitfield" value={82} max={100} suffix="%" />
            <BarRow label="J. Reeves" value={76} max={100} suffix="%" />
            <BarRow label="M. Okonkwo" value={71} max={100} suffix="%" />
          </div>
        </Panel>
        <Panel title="Booking source">
          <div className="space-y-3">
            <BarRow label="Online widget" value={612} max={1184} />
            <BarRow label="Front desk" value={284} max={1184} />
            <BarRow label="SMS reminder" value={168} max={1184} />
            <BarRow label="Concierge" value={120} max={1184} />
          </div>
        </Panel>
      </div>
      <Panel title="Slot economics">
        <SimpleTable
          headers={["Service", "Bookings", "Avg Ticket", "Chair Min", "$/min"]}
          rows={[
            ["Neurotoxin", 412, "$420", 30, "$14.0"],
            ["Filler", 168, "$1,180", 45, "$26.2"],
            ["Morpheus8", 38, "$1,850", 90, "$20.6"],
            ["HydraFacial", 142, "$325", 50, "$6.5"],
            ["NAD+ IV", 86, "$425", 60, "$7.1"],
          ]}
        />
      </Panel>
    </AnalyticsSubPage>
  );
}
