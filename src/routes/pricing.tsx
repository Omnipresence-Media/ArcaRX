import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/marketing/StubPage";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing - ARCA Rx" },
      { name: "description", content: "Simple, transparent pricing for ARCA Rx. Starting at $149/month." },
    ],
  }),
  component: () => (
    <StubPage
      title="Simple, transparent pricing."
      subtitle="Starter $149/mo · Growth $299/mo · Scale $499/mo. 14-day free trial on every plan. Annual billing saves 20%."
    />
  ),
});
