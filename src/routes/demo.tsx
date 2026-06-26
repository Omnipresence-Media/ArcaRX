import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/marketing/StubPage";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Watch a Demo - ARCA Rx" },
      { name: "description", content: "Watch a 3-minute ARCA Rx product tour or book a live demo with our team." },
    ],
  }),
  component: () => (
    <StubPage
      title="See ARCA Rx in 3 minutes."
      subtitle="Watch a guided product tour, or book a 30-minute live demo with a product specialist who knows your specialty."
    />
  ),
});
