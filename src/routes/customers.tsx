import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/marketing/StubPage";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers - ARCA Rx" },
      { name: "description", content: "500+ health optimization practices run on ARCA Rx. Read their stories." },
    ],
  }),
  component: () => (
    <StubPage
      title="500+ practices. One platform."
      subtitle="Read how med spas, HRT clinics, IV centers, and functional medicine practices replaced their disconnected tools with ARCA Rx - and what happened next."
    />
  ),
});
