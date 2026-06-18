import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/marketing/StubPage";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partner Program — ARCA Rx" },
      { name: "description", content: "Earn 15–25% recurring commission for every practice you refer to ARCA Rx." },
    ],
  }),
  component: () => (
    <StubPage
      title="Refer a practice. Earn forever."
      subtitle="Earn 15% of every referred practice's monthly subscription for as long as they stay on ARCA Rx. Top affiliates earn over $2,400/month in passive income."
    />
  ),
});
